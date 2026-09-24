import { Router, type IRouter } from "express";
import { eq, desc, count, sql, ilike, or } from "drizzle-orm";
import { db, onboardingSessionsTable, strategicBriefsTable } from "@workspace/db";
import {
  CreateSessionBody,
  UpdateSessionBody,
  GetSessionParams,
  UpdateSessionParams,
  DeleteSessionParams,
  CompleteSessionParams,
  GetSessionBriefParams,
  ListSessionsQueryParams,
  GetRecentSessionsQueryParams,
  ListSessionsResponse,
  GetRecentSessionsResponse,
  GetSessionResponse,
  UpdateSessionResponse,
  CompleteSessionResponse,
  GetSessionsSummaryResponse,
  GetSessionBriefResponse,
} from "@workspace/api-zod";
import { INDUSTRY_CONFIG } from "../lib/industry-config.js";
import { generateClientEmailHtml, generateDirectorEmailHtml } from "../lib/generate-emails.js";
import { generateReportPdf } from "../lib/generate-pdf.js";
import { buildFolderPath, buildFilename, generateBrief } from "../lib/onboarding-logic.js";

const router: IRouter = Router();

router.get("/sessions/summary", async (req, res): Promise<void> => {
  const rows = await db
    .select({ status: onboardingSessionsTable.status, count: count() })
    .from(onboardingSessionsTable)
    .groupBy(onboardingSessionsTable.status);

  const total = rows.reduce((acc, r) => acc + Number(r.count), 0);
  const completed = Number(rows.find((r) => r.status === "completed")?.count ?? 0);
  const inProgress = Number(rows.find((r) => r.status === "in_progress")?.count ?? 0);
  const paused = Number(rows.find((r) => r.status === "paused")?.count ?? 0);
  const completionRate = total > 0 ? (completed / total) * 100 : 0;

  const completedSessions = await db
    .select({
      createdAt: onboardingSessionsTable.createdAt,
      completedAt: onboardingSessionsTable.completedAt,
    })
    .from(onboardingSessionsTable)
    .where(eq(onboardingSessionsTable.status, "completed"));

  let avgCompletionMinutes: number | null = null;
  if (completedSessions.length > 0) {
    const totalMs = completedSessions.reduce((acc, s) => {
      if (!s.completedAt) return acc;
      return acc + (s.completedAt.getTime() - s.createdAt.getTime());
    }, 0);
    avgCompletionMinutes = totalMs / completedSessions.length / 60000;
  }

  res.json(
    GetSessionsSummaryResponse.parse({
      total,
      completed,
      inProgress,
      paused,
      completionRate: Math.round(completionRate * 10) / 10,
      avgCompletionMinutes,
    })
  );
});

router.get("/sessions/recent", async (req, res): Promise<void> => {
  const query = GetRecentSessionsQueryParams.safeParse(req.query);
  const limit = query.success ? (query.data.limit ?? 5) : 5;

  const sessions = await db
    .select()
    .from(onboardingSessionsTable)
    .orderBy(desc(onboardingSessionsTable.updatedAt))
    .limit(limit);

  res.json(GetRecentSessionsResponse.parse(sessions));
});

router.get("/sessions", async (req, res): Promise<void> => {
  const query = ListSessionsQueryParams.safeParse(req.query);
  const status = query.success ? query.data.status : undefined;
  const search = query.success ? query.data.search : undefined;

  const conditions = [];

  if (status) {
    conditions.push(eq(onboardingSessionsTable.status, status as "in_progress" | "completed" | "paused"));
  }

  if (search) {
    conditions.push(
      or(
        ilike(onboardingSessionsTable.clientName, `%${search}%`),
        ilike(onboardingSessionsTable.clientCompany, `%${search}%`),
        ilike(onboardingSessionsTable.accountManager, `%${search}%`)
      )
    );
  }

  let sessions;
  if (conditions.length > 0) {
    sessions = await db
      .select()
      .from(onboardingSessionsTable)
      .where(conditions.length === 1 ? conditions[0] : sql`${conditions[0]} AND ${conditions[1]}`)
      .orderBy(desc(onboardingSessionsTable.updatedAt));
  } else {
    sessions = await db
      .select()
      .from(onboardingSessionsTable)
      .orderBy(desc(onboardingSessionsTable.updatedAt));
  }

  res.json(ListSessionsResponse.parse(sessions));
});

router.post("/sessions", async (req, res): Promise<void> => {
  const parsed = CreateSessionBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [session] = await db
    .insert(onboardingSessionsTable)
    .values({
      clientName: parsed.data.clientName,
      clientCompany: parsed.data.clientCompany,
      clientEmail: parsed.data.clientEmail,
      accountManager: parsed.data.accountManager,
    })
    .returning();

  res.status(201).json(GetSessionResponse.parse(session));
});

router.get("/sessions/:id", async (req, res): Promise<void> => {
  const params = GetSessionParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [session] = await db
    .select()
    .from(onboardingSessionsTable)
    .where(eq(onboardingSessionsTable.id, params.data.id));

  if (!session) {
    res.status(404).json({ error: "Session not found" });
    return;
  }

  res.json(GetSessionResponse.parse(session));
});

router.patch("/sessions/:id", async (req, res): Promise<void> => {
  const params = UpdateSessionParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const parsed = UpdateSessionBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const updateData: Record<string, unknown> = { updatedAt: new Date() };

  if (parsed.data.status !== undefined) updateData.status = parsed.data.status;
  if (parsed.data.currentStep !== undefined) {
    updateData.currentStep = parsed.data.currentStep;
    updateData.completionPercent = Math.round((parsed.data.currentStep / 10) * 100);
  }
  if (parsed.data.responses !== undefined) updateData.responses = parsed.data.responses;

  const [session] = await db
    .update(onboardingSessionsTable)
    .set(updateData)
    .where(eq(onboardingSessionsTable.id, params.data.id))
    .returning();

  if (!session) {
    res.status(404).json({ error: "Session not found" });
    return;
  }

  res.json(UpdateSessionResponse.parse(session));
});

router.delete("/sessions/:id", async (req, res): Promise<void> => {
  const params = DeleteSessionParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [deleted] = await db
    .delete(onboardingSessionsTable)
    .where(eq(onboardingSessionsTable.id, params.data.id))
    .returning();

  if (!deleted) {
    res.status(404).json({ error: "Session not found" });
    return;
  }

  res.sendStatus(204);
});

router.post("/sessions/:id/complete", async (req, res): Promise<void> => {
  const params = CompleteSessionParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [session] = await db
    .select()
    .from(onboardingSessionsTable)
    .where(eq(onboardingSessionsTable.id, params.data.id));

  if (!session) {
    res.status(404).json({ error: "Session not found" });
    return;
  }

  const responses = (session.responses as Record<string, unknown>) ?? {};
  const brief = generateBrief(session.clientName, session.clientCompany, responses);

  await db.insert(strategicBriefsTable).values({
    sessionId: session.id,
    ...brief,
  }).onConflictDoNothing();

  const [updated] = await db
    .update(onboardingSessionsTable)
    .set({
      status: "completed",
      currentStep: 10,
      completionPercent: 100,
      completedAt: new Date(),
      updatedAt: new Date(),
    })
    .where(eq(onboardingSessionsTable.id, params.data.id))
    .returning();

  res.json(CompleteSessionResponse.parse(updated));
});

router.get("/sessions/:id/brief", async (req, res): Promise<void> => {
  const params = GetSessionBriefParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [brief] = await db
    .select()
    .from(strategicBriefsTable)
    .where(eq(strategicBriefsTable.sessionId, params.data.id));

  if (!brief) {
    res.status(404).json({ error: "Brief not found" });
    return;
  }

  res.json(GetSessionBriefResponse.parse(brief));
});

// ─── Client-facing email ─────────────────────────────────────────────────────

router.post("/sessions/:id/client-email", async (req, res): Promise<void> => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }

  const [session] = await db.select().from(onboardingSessionsTable).where(eq(onboardingSessionsTable.id, id));
  if (!session) { res.status(404).json({ error: "Session not found" }); return; }

  const [brief] = await db.select().from(strategicBriefsTable).where(eq(strategicBriefsTable.sessionId, id));
  if (!brief) { res.status(404).json({ error: "Brief not generated yet" }); return; }

  const responses = (session.responses as Record<string, unknown>) ?? {};
  const industry = (responses.industry as string) ?? "other";
  const config = INDUSTRY_CONFIG[industry] ?? INDUSTRY_CONFIG.other;
  const folderPath = buildFolderPath(session.clientCompany);

  const { subject, html } = generateClientEmailHtml(
    { clientName: session.clientName, clientCompany: session.clientCompany, clientEmail: session.clientEmail, accountManager: session.accountManager },
    brief as Parameters<typeof generateClientEmailHtml>[1],
    config,
    folderPath
  );

  res.json({ subject, html, folderPath });
});

// ─── Internal director email ─────────────────────────────────────────────────

router.post("/sessions/:id/director-email", async (req, res): Promise<void> => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }

  const [session] = await db.select().from(onboardingSessionsTable).where(eq(onboardingSessionsTable.id, id));
  if (!session) { res.status(404).json({ error: "Session not found" }); return; }

  const [brief] = await db.select().from(strategicBriefsTable).where(eq(strategicBriefsTable.sessionId, id));
  if (!brief) { res.status(404).json({ error: "Brief not generated yet" }); return; }

  const responses = (session.responses as Record<string, unknown>) ?? {};
  const industry = (responses.industry as string) ?? "other";
  const config = INDUSTRY_CONFIG[industry] ?? INDUSTRY_CONFIG.other;
  const folderPath = buildFolderPath(session.clientCompany);
  const filename = buildFilename(session.clientCompany);

  const { subject, html } = generateDirectorEmailHtml(
    { clientName: session.clientName, clientCompany: session.clientCompany, clientEmail: session.clientEmail, accountManager: session.accountManager },
    brief as Parameters<typeof generateDirectorEmailHtml>[1],
    config,
    folderPath,
    filename
  );

  res.json({ subject, html, folderPath, filename });
});

// ─── PDF report ──────────────────────────────────────────────────────────────

router.get("/sessions/:id/report.pdf", async (req, res): Promise<void> => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }

  const [session] = await db.select().from(onboardingSessionsTable).where(eq(onboardingSessionsTable.id, id));
  if (!session) { res.status(404).json({ error: "Session not found" }); return; }

  const [brief] = await db.select().from(strategicBriefsTable).where(eq(strategicBriefsTable.sessionId, id));
  if (!brief) { res.status(404).json({ error: "Brief not generated yet" }); return; }

  const responses = (session.responses as Record<string, unknown>) ?? {};
  const industry = (responses.industry as string) ?? "other";
  const config = INDUSTRY_CONFIG[industry] ?? INDUSTRY_CONFIG.other;
  const filename = buildFilename(session.clientCompany);

  try {
    const pdfBuffer = await generateReportPdf(
      { clientName: session.clientName, clientCompany: session.clientCompany, accountManager: session.accountManager },
      brief as Parameters<typeof generateReportPdf>[1],
      config
    );

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    res.setHeader("Content-Length", pdfBuffer.length);
    res.send(pdfBuffer);
  } catch (err) {
    req.log.error({ err }, "PDF generation failed");
    res.status(500).json({ error: "PDF generation failed" });
  }
});

export default router;
