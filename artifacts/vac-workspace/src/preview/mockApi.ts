// ── Preview build: in-browser API ─────────────────────────────────────
// The claude.ai beta has no Express server or Postgres. This module answers
// the same /api/sessions/* calls inside the browser, using the artifact's
// shared `db` capability when available (so sessions persist and every
// signed-in viewer sees the same data), falling back to this browser's
// local storage, and finally to memory.
//
// Brief generation and the email templates are the exact same code the
// API server runs (imported from artifacts/api-server/src/lib).

import { generateBrief, buildFolderPath, buildFilename } from "@server/lib/onboarding-logic";
import { INDUSTRY_CONFIG } from "@server/lib/industry-config";
import { generateClientEmailHtml, generateDirectorEmailHtml } from "@server/lib/generate-emails";

type Row = Record<string, unknown> & { id: number };

interface Store {
  list(col: string): Promise<Row[]>;
  get(col: string, id: number): Promise<Row | null>;
  put(col: string, row: Row): Promise<void>;
  remove(col: string, id: number): Promise<void>;
}

// ── Stores ────────────────────────────────────────────────────────────

function memoryStore(): Store {
  const LS_KEY = "vac-workspace-preview";
  let data: Record<string, Record<string, Row>> = {};
  try {
    data = JSON.parse(localStorage.getItem(LS_KEY) ?? "{}") ?? {};
  } catch {
    data = {};
  }
  const save = () => {
    try {
      localStorage.setItem(LS_KEY, JSON.stringify(data));
    } catch {
      /* storage unavailable: keep in memory */
    }
  };
  return {
    async list(col) {
      return Object.values(data[col] ?? {});
    },
    async get(col, id) {
      return data[col]?.[String(id)] ?? null;
    },
    async put(col, row) {
      data[col] = { ...(data[col] ?? {}), [String(row.id)]: row };
      save();
    },
    async remove(col, id) {
      if (data[col]) delete data[col][String(id)];
      save();
    },
  };
}

// Minimal structural types for the platform db namespace
type Snap = { id: string; exists: boolean; data(): Record<string, unknown> | undefined };
type PlatformDb = {
  doc(path: string): {
    get(): Promise<Snap>;
    set(d: Record<string, unknown>): Promise<void>;
    delete(): Promise<void>;
  };
  collection(path: string): { limit(n: number): { get(): Promise<{ docs: Snap[] }> } };
};

function platformStore(db: PlatformDb): Store {
  return {
    async list(col) {
      const snap = await db.collection(col).limit(1000).get();
      return snap.docs.filter((d) => d.exists).map((d) => ({ ...(d.data() as object) }) as Row);
    },
    async get(col, id) {
      const snap = await db.doc(`${col}/${id}`).get();
      return snap.exists ? ({ ...(snap.data() as object) } as Row) : null;
    },
    async put(col, row) {
      await db.doc(`${col}/${row.id}`).set(JSON.parse(JSON.stringify(row)));
    },
    async remove(col, id) {
      await db.doc(`${col}/${id}`).delete();
    },
  };
}

let storePromise: Promise<Store> | null = null;
function getStore(): Promise<Store> {
  if (!storePromise) {
    storePromise = (async () => {
      try {
        const claude = (window as unknown as { claude?: { use(n: string): Promise<unknown> } }).claude;
        const db = claude ? ((await claude.use("db")) as PlatformDb | null) : null;
        if (db) {
          // Probe once: a viewer who cannot write still reads fine.
          return platformStore(db);
        }
      } catch {
        /* fall through */
      }
      return memoryStore();
    })();
  }
  return storePromise;
}

// ── Helpers ───────────────────────────────────────────────────────────

const json = (body: unknown, status = 200) =>
  new Response(body === null ? null : JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });

const now = () => new Date().toISOString();
const byUpdatedDesc = (a: Row, b: Row) =>
  String(b.updatedAt ?? "").localeCompare(String(a.updatedAt ?? ""));

async function nextId(store: Store): Promise<number> {
  const rows = await store.list("sessions");
  const max = rows.reduce((m, r) => Math.max(m, Number(r.id) || 0), 0);
  // Add a small random offset so two viewers creating at once rarely collide
  return max + 1 + Math.floor(Math.random() * 3);
}

async function readBody(init?: RequestInit): Promise<Record<string, unknown>> {
  if (!init?.body || typeof init.body !== "string") return {};
  try {
    return JSON.parse(init.body);
  } catch {
    return {};
  }
}

// ── Router ────────────────────────────────────────────────────────────

async function handle(method: string, url: URL, init?: RequestInit): Promise<Response> {
  const store = await getStore();
  const path = url.pathname.replace(/^.*\/api/, "");
  const parts = path.split("/").filter(Boolean); // ["sessions", ":id", "brief"]

  if (path === "/healthz") return json({ status: "ok" });
  if (parts[0] !== "sessions") return json({ error: "Not found" }, 404);

  // /sessions/summary
  if (parts[1] === "summary" && method === "GET") {
    const rows = await store.list("sessions");
    const total = rows.length;
    const completedRows = rows.filter((r) => r.status === "completed");
    const completed = completedRows.length;
    const inProgress = rows.filter((r) => r.status === "in_progress").length;
    const paused = rows.filter((r) => r.status === "paused").length;
    let avgCompletionMinutes: number | null = null;
    if (completed > 0) {
      const ms = completedRows.reduce((acc, r) => {
        if (!r.completedAt) return acc;
        return acc + (Date.parse(String(r.completedAt)) - Date.parse(String(r.createdAt)));
      }, 0);
      avgCompletionMinutes = ms / completed / 60000;
    }
    const completionRate = total > 0 ? Math.round((completed / total) * 1000) / 10 : 0;
    return json({ total, completed, inProgress, paused, completionRate, avgCompletionMinutes });
  }

  // /sessions/recent
  if (parts[1] === "recent" && method === "GET") {
    const limit = Number(url.searchParams.get("limit") ?? 5) || 5;
    const rows = (await store.list("sessions")).sort(byUpdatedDesc).slice(0, limit);
    return json(rows);
  }

  // /sessions
  if (parts.length === 1) {
    if (method === "GET") {
      const status = url.searchParams.get("status");
      const search = (url.searchParams.get("search") ?? "").toLowerCase();
      let rows = await store.list("sessions");
      if (status) rows = rows.filter((r) => r.status === status);
      if (search)
        rows = rows.filter((r) =>
          [r.clientName, r.clientCompany, r.accountManager].some((v) =>
            String(v ?? "").toLowerCase().includes(search),
          ),
        );
      return json(rows.sort(byUpdatedDesc));
    }
    if (method === "POST") {
      const b = await readBody(init);
      if (!b.clientName || !b.clientCompany || !b.accountManager)
        return json({ error: "Client name, company and account manager are required" }, 400);
      const ts = now();
      const row: Row = {
        id: await nextId(store),
        clientName: String(b.clientName),
        clientCompany: String(b.clientCompany),
        clientEmail: b.clientEmail ? String(b.clientEmail) : null,
        accountManager: String(b.accountManager),
        status: "in_progress",
        currentStep: 1,
        totalSteps: 10,
        completionPercent: 0,
        responses: {},
        createdAt: ts,
        updatedAt: ts,
        completedAt: null,
      };
      await store.put("sessions", row);
      return json(row, 201);
    }
  }

  const id = parseInt(parts[1] ?? "", 10);
  if (Number.isNaN(id)) return json({ error: "Invalid id" }, 400);
  const session = await store.get("sessions", id);

  // /sessions/:id
  if (parts.length === 2) {
    if (!session) return json({ error: "Session not found" }, 404);
    if (method === "GET") return json(session);
    if (method === "PATCH") {
      const b = await readBody(init);
      const next: Row = { ...session, updatedAt: now() };
      if (b.status !== undefined) next.status = b.status;
      if (b.currentStep !== undefined) {
        next.currentStep = Number(b.currentStep);
        next.completionPercent = Math.round((Number(b.currentStep) / 10) * 100);
      }
      if (b.responses !== undefined) next.responses = b.responses;
      await store.put("sessions", next);
      return json(next);
    }
    if (method === "DELETE") {
      await store.remove("sessions", id);
      await store.remove("briefs", id);
      return json(null, 204);
    }
  }

  if (!session) return json({ error: "Session not found" }, 404);
  const action = parts[2];

  if (action === "complete" && method === "POST") {
    const responses = (session.responses as Record<string, unknown>) ?? {};
    const existing = await store.get("briefs", id);
    if (!existing) {
      const brief = generateBrief(session.clientName as string, session.clientCompany as string, responses);
      await store.put("briefs", { ...brief, id, sessionId: id, generatedAt: now() } as unknown as Row);
    }
    const ts = now();
    const updated: Row = {
      ...session,
      status: "completed",
      currentStep: 10,
      completionPercent: 100,
      completedAt: ts,
      updatedAt: ts,
    };
    await store.put("sessions", updated);
    return json(updated);
  }

  const brief = await store.get("briefs", id);

  if (action === "brief" && method === "GET") {
    if (!brief) return json({ error: "Brief not found" }, 404);
    return json(brief);
  }

  if ((action === "client-email" || action === "director-email") && method === "POST") {
    if (!brief) return json({ error: "Brief not generated yet" }, 404);
    const responses = (session.responses as Record<string, unknown>) ?? {};
    const industry = (responses.industry as string) ?? "other";
    const config = INDUSTRY_CONFIG[industry] ?? INDUSTRY_CONFIG.other;
    const s = {
      clientName: String(session.clientName),
      clientCompany: String(session.clientCompany),
      clientEmail: (session.clientEmail as string | null) ?? null,
      accountManager: String(session.accountManager),
    };
    const folderPath = buildFolderPath(s.clientCompany);
    if (action === "client-email") {
      const { subject, html } = generateClientEmailHtml(
        s,
        brief as unknown as Parameters<typeof generateClientEmailHtml>[1],
        config,
        folderPath,
      );
      return json({ subject, html, folderPath });
    }
    const filename = buildFilename(s.clientCompany);
    const { subject, html } = generateDirectorEmailHtml(
      s,
      brief as unknown as Parameters<typeof generateDirectorEmailHtml>[1],
      config,
      folderPath,
      filename,
    );
    return json({ subject, html, folderPath, filename });
  }

  if (action === "report.pdf") {
    return json({ error: "The PDF report is generated by the server and is not available in the beta preview." }, 501);
  }

  return json({ error: "Not found" }, 404);
}

export function installPreviewApi() {
  const realFetch = window.fetch.bind(window);
  window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
    const raw = typeof input === "string" ? input : input instanceof URL ? input.href : input.url;
    const url = new URL(raw, "https://preview.local/");
    if (/(^|\/)api\//.test(url.pathname)) {
      const method = (init?.method ?? (input instanceof Request ? input.method : "GET")).toUpperCase();
      let body = init;
      if (!init?.body && input instanceof Request && method !== "GET") {
        body = { ...init, body: await input.text() };
      }
      try {
        return await handle(method, url, body);
      } catch (err) {
        return json({ error: err instanceof Error ? err.message : "Preview error" }, 500);
      }
    }
    return realFetch(input as RequestInfo, init);
  };
}
