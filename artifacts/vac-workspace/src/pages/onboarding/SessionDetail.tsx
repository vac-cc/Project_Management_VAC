import { useParams, useLocation } from "wouter";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Layout from "@/components/onboarding/OnboardingLayout";
import { useGetSession, getGetSessionQueryKey } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";

const GREEN = "hsl(var(--primary))";
const RUST = "hsl(var(--rust))";
const MUTED = "hsl(var(--muted-foreground))";
const BORDER = "hsl(var(--border))";

const statusConfig = {
  in_progress: { label: "In Progress", color: GREEN },
  completed: { label: "Completed", color: RUST },
  paused: { label: "Paused", color: MUTED },
};

const monoStyle = {
  fontFamily: "var(--app-font-mono)",
  fontSize: "0.58rem",
  letterSpacing: "0.13em",
  textTransform: "uppercase" as const,
};

function ResponseBlock({ label, value }: { label: string; value: unknown }) {
  if (!value || (Array.isArray(value) && value.length === 0)) return null;

  let display: React.ReactNode;

  if (Array.isArray(value)) {
    display = (
      <div className="space-y-1.5">
        {value.map((v, i) => (
          <div key={i} className="flex items-start gap-3">
            <span className="font-brand" style={{ color: GREEN, fontSize: "0.9rem", lineHeight: 1.4 }}>/</span>
            <span className="font-sans text-sm" style={{ color: "hsl(var(--foreground))" }}>{String(v)}</span>
          </div>
        ))}
      </div>
    );
  } else if (typeof value === "object") {
    display = (
      <div className="grid grid-cols-2 gap-x-8 gap-y-3">
        {Object.entries(value as Record<string, unknown>).map(([k, v]) => (
          <div key={k} className="flex items-baseline gap-4">
            <span className="font-sans text-xs" style={{ color: MUTED, flexShrink: 0 }}>
              {k.replace(/([A-Z])/g, " $1").trim()}
            </span>
            <span className="font-brand" style={{ color: RUST, fontSize: "0.85rem" }}>{String(v)}</span>
          </div>
        ))}
      </div>
    );
  } else {
    display = (
      <p className="font-sans text-sm leading-relaxed" style={{ color: "hsl(var(--foreground))" }}>
        {String(value)}
      </p>
    );
  }

  return (
    <div
      className="grid gap-4"
      style={{
        gridTemplateColumns: "140px 1fr",
        borderBottom: `1px solid ${BORDER}`,
        padding: "20px 0",
      }}
    >
      <span style={{ ...monoStyle, color: MUTED, paddingTop: "2px" }}>{label}</span>
      <div>{display}</div>
    </div>
  );
}

const fade = (i = 0) => ({
  initial: { opacity: 0, y: 10 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.25, 0.1, 0.25, 1] as const, delay: i * 0.07 },
  },
});

export default function SessionDetail() {
  const { id } = useParams<{ id: string }>();
  const sessionId = parseInt(id, 10);
  const [, setLocation] = useLocation();

  const { data: session, isLoading } = useGetSession(sessionId, {
    query: { queryKey: getGetSessionQueryKey(sessionId), enabled: !!sessionId },
  });

  if (isLoading) {
    return (
      <Layout>
        <div className="max-w-3xl px-14 pt-14 space-y-8">
          <Skeleton className="h-12 w-64" />
          <Skeleton className="h-4 w-40" />
          <div className="space-y-4 mt-8">
            {[0, 1, 2].map((i) => <Skeleton key={i} className="h-16" />)}
          </div>
        </div>
      </Layout>
    );
  }

  if (!session) {
    return (
      <Layout>
        <div className="px-14 pt-14 font-sans text-sm" style={{ color: MUTED }}>Session not found.</div>
      </Layout>
    );
  }

  const cfg = statusConfig[session.status as keyof typeof statusConfig];
  const responses = (session.responses as Record<string, unknown>) || {};

  return (
    <Layout>
      <div className="max-w-3xl px-14 pt-14 pb-24">

        <motion.div {...fade(0)} className="mb-10">
          <button
            data-testid="link-back-sessions"
            onClick={() => setLocation("/onboarding/sessions")}
            className="font-sans text-xs flex items-center gap-1.5 mb-8 transition-colors"
            style={{ color: MUTED }}
          >
            ← All Sessions
          </button>

          <div className="flex items-start justify-between gap-6 mb-8">
            <div>
              <p style={{ ...monoStyle, color: MUTED, marginBottom: "10px" }}>{session.clientCompany}</p>
              <h1 className="font-brand" style={{ fontSize: "3.2rem", lineHeight: 1.05 }}>
                {session.clientName}
              </h1>
            </div>
            <div className="pt-2 flex-shrink-0">
              <span style={{ ...monoStyle, color: cfg?.color }}>{cfg?.label}</span>
            </div>
          </div>

          {/* Meta band */}
          <div
            className="grid"
            style={{
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: "24px",
              borderTop: `1px solid ${BORDER}`,
              borderBottom: `1px solid ${BORDER}`,
              padding: "16px 0",
            }}
          >
            {[
              { label: "Manager", value: session.accountManager },
              { label: "Email", value: session.clientEmail || "—" },
              { label: "Progress", value: `${session.completionPercent}%` },
              {
                label: "Started",
                value: new Date(session.createdAt).toLocaleDateString("en-GB", {
                  day: "numeric", month: "short", year: "numeric",
                }),
              },
            ].map(({ label, value }) => (
              <div key={label}>
                <p style={{ ...monoStyle, color: MUTED, marginBottom: "6px" }}>{label}</p>
                <p className="font-sans text-sm" style={{ color: "hsl(var(--foreground))" }}>{value}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Responses */}
        <motion.div {...fade(1)}>
          <p style={{ ...monoStyle, color: MUTED, marginBottom: "4px" }}>Discovery Responses</p>
          {Object.keys(responses).length === 0 ? (
            <p className="font-sans text-sm pt-6 italic" style={{ color: MUTED }}>
              No responses recorded yet.
            </p>
          ) : (
            <div style={{ borderTop: `1px solid ${BORDER}`, marginTop: "16px" }}>
              <ResponseBlock label="Context" value={responses.businessContext} />
              <ResponseBlock label="Brand Age" value={responses.brandAge} />
              <ResponseBlock label="Objectives" value={responses.objectives} />
              <ResponseBlock label="Audience" value={responses.audience} />
              <ResponseBlock label="Personality" value={responses.brandPersonality} />
              <ResponseBlock label="Tone" value={responses.toneWords} />
              <ResponseBlock label="Competitors" value={responses.competitors} />
              <ResponseBlock label="Channels" value={responses.channels} />
              <ResponseBlock label="Workflow" value={responses.workflow} />
              {!!responses.workflowNotes && (
                <ResponseBlock label="Notes" value={responses.workflowNotes} />
              )}
            </div>
          )}
        </motion.div>

        {/* Actions */}
        <motion.div {...fade(2)} className="flex gap-4 mt-12">
          {session.status === "in_progress" && (
            <button
              data-testid="button-continue-session"
              onClick={() => setLocation(`/onboarding/flow/${session.id}`)}
              className="font-sans font-medium text-sm flex items-center gap-3 px-6 py-3 transition-opacity hover:opacity-90"
              style={{ background: GREEN, color: "#fff" }}
            >
              Continue Session
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
          {session.status === "completed" && (
            <button
              data-testid="button-view-brief"
              onClick={() => setLocation(`/onboarding/sessions/${session.id}/brief`)}
              className="font-sans font-medium text-sm flex items-center gap-3 px-6 py-3 transition-opacity hover:opacity-90"
              style={{ background: RUST, color: "#fff" }}
            >
              View Strategic Brief
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </motion.div>
      </div>
    </Layout>
  );
}
