import { useState } from "react";
import { useParams, useLocation } from "wouter";
import { motion } from "framer-motion";
import { ArrowLeft, Download, Mail, FileText, X, FolderOpen } from "lucide-react";
import Layout from "@/components/onboarding/OnboardingLayout";
import {
  useGetSession,
  useGetSessionBrief,
  getGetSessionQueryKey,
  getGetSessionBriefQueryKey,
} from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";

const GREEN = "hsl(var(--primary))";
const RUST = "hsl(var(--rust))";
const MUTED = "hsl(var(--muted-foreground))";
const BORDER = "hsl(var(--border))";

const monoStyle = {
  fontFamily: "var(--app-font-mono)",
  fontSize: "0.58rem",
  letterSpacing: "0.13em",
  textTransform: "uppercase" as const,
};

function BriefSection({
  label,
  items,
  variant = "default",
}: {
  label: string;
  items: string[];
  variant?: "default" | "rust" | "muted";
}) {
  if (!items || items.length === 0) return null;
  const accentColor = variant === "rust" ? RUST : variant === "muted" ? MUTED : GREEN;
  return (
    <div style={{ borderTop: `1px solid ${BORDER}`, padding: "28px 0" }}>
      <p style={{ ...monoStyle, color: MUTED, marginBottom: "20px" }}>{label}</p>
      <div className="space-y-5">
        {items.map((text, idx) => (
          <div key={idx} className="flex gap-4">
            <span
              className="font-brand flex-shrink-0"
              style={{ color: accentColor, fontSize: "1.1rem", lineHeight: 1.6, minWidth: "20px" }}
            >
              /
            </span>
            <p className="text-sm leading-relaxed" style={{ color: "hsl(var(--foreground))" }}>
              {text}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

const fade = (i = 0) => ({
  initial: { opacity: 0, y: 12 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] as const, delay: i * 0.08 },
  },
});

interface EmailPreview {
  type: "client" | "director";
  subject: string;
  html: string;
  folderPath?: string;
  filename?: string;
}

export default function BriefView() {
  const { id } = useParams<{ id: string }>();
  const sessionId = parseInt(id, 10);
  const [, setLocation] = useLocation();

  const { data: session } = useGetSession(sessionId, {
    query: { queryKey: getGetSessionQueryKey(sessionId), enabled: !!sessionId },
  });

  const { data: brief, isLoading } = useGetSessionBrief(sessionId, {
    query: { queryKey: getGetSessionBriefQueryKey(sessionId), enabled: !!sessionId },
  });

  const [emailPreview, setEmailPreview] = useState<EmailPreview | null>(null);
  const [emailLoading, setEmailLoading] = useState<"client" | "director" | null>(null);
  const [folderPath, setFolderPath] = useState<string | null>(null);
  const [pdfFilename, setPdfFilename] = useState<string | null>(null);

  async function openClientEmail() {
    setEmailLoading("client");
    try {
      const res = await fetch(`/api/sessions/${sessionId}/client-email`, { method: "POST" });
      const data = await res.json();
      setFolderPath(data.folderPath ?? null);
      setEmailPreview({ type: "client", subject: data.subject, html: data.html, folderPath: data.folderPath });
    } finally {
      setEmailLoading(null);
    }
  }

  async function openDirectorEmail() {
    setEmailLoading("director");
    try {
      const res = await fetch(`/api/sessions/${sessionId}/director-email`, { method: "POST" });
      const data = await res.json();
      setFolderPath(data.folderPath ?? null);
      setPdfFilename(data.filename ?? null);
      setEmailPreview({ type: "director", subject: data.subject, html: data.html, folderPath: data.folderPath, filename: data.filename });
    } finally {
      setEmailLoading(null);
    }
  }

  // The claude.ai beta has no server to render the PDF.
  const pdfAvailable = !import.meta.env.VITE_PREVIEW;

  function downloadPdf() {
    if (!pdfAvailable) return;
    window.open(`/api/sessions/${sessionId}/report.pdf`, "_blank");
  }

  if (isLoading) {
    return (
      <Layout>
        <div className="max-w-3xl px-14 pt-14 space-y-12">
          <Skeleton className="h-12 w-72" />
          <Skeleton className="h-4 w-40" />
          <div className="space-y-8 mt-12">
            {[0, 1, 2].map((i) => <Skeleton key={i} className="h-32" />)}
          </div>
        </div>
      </Layout>
    );
  }

  if (!brief) {
    return (
      <Layout>
        <div className="px-14 pt-14 text-sm" style={{ color: MUTED }}>
          Brief not found or not yet generated.
        </div>
      </Layout>
    );
  }

  const snapshot = brief.clientSnapshot as Record<string, unknown>;
  const industryContext = brief.industryContext as Record<string, unknown> | undefined;
  const readingSuggestions = brief.readingSuggestions as Array<{ title: string; author: string; type: string }> | undefined;

  const slug = session?.clientCompany.replace(/[^a-zA-Z0-9]+/g, "-").replace(/^-|-$/g, "") ?? "client";
  const dateStr = new Date().toISOString().split("T")[0];
  const displayFolderPath = folderPath ?? `Clients / ${session?.clientCompany ?? "Client"} / Onboarding / ${dateStr}`;
  const displayFilename = pdfFilename ?? `${slug}_Strategic-Brief_${dateStr}.pdf`;

  return (
    <Layout>
      <div className="max-w-3xl px-14 pt-14 pb-24">

        {/* Header */}
        <motion.div {...fade(0)} className="mb-14">
          <button
            data-testid="link-back-session"
            onClick={() => setLocation(`/onboarding/sessions/${sessionId}`)}
            className="text-xs flex items-center gap-1.5 mb-8 transition-colors"
            style={{ color: MUTED }}
          >
            <ArrowLeft className="w-3 h-3" />
            Session
          </button>

          <p style={{ ...monoStyle, color: GREEN, marginBottom: "14px" }}>Strategic Brief</p>

          <h1
            className="font-brand"
            style={{ fontSize: "3.6rem", lineHeight: 1.05, marginBottom: "6px", color: "hsl(var(--foreground))" }}
          >
            {session?.clientCompany ?? "Client"}
          </h1>
          <p
            style={{ fontSize: "1.2rem", color: RUST, marginBottom: "8px", fontStyle: "italic" }}
          >
            Discovery Output
          </p>
          {!!snapshot?.industry && (
            <p style={{ ...monoStyle, color: GREEN, marginBottom: "12px" }}>
              {String(snapshot.industry)}
            </p>
          )}
          <p className="text-xs" style={{ color: MUTED }}>
            Generated{" "}
            {new Date(brief.generatedAt).toLocaleDateString("en-GB", {
              day: "numeric", month: "long", year: "numeric",
            })}
            {session && ` · ${session.accountManager}`}
          </p>
        </motion.div>

        {/* Client snapshot — green block */}
        <motion.div {...fade(1)}>
          <div style={{ background: GREEN, padding: "28px 32px", marginBottom: "0" }}>
            <p style={{ ...monoStyle, color: "rgba(255,255,255,0.6)", marginBottom: "20px" }}>
              Client Snapshot
            </p>
            <div className="grid gap-x-10 gap-y-5" style={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
              {[
                { label: "Client", value: session?.clientName },
                { label: "Company", value: String(snapshot?.company ?? "") },
                { label: "Sector", value: snapshot?.industry ? String(snapshot.industry) : undefined },
                { label: "Context", value: snapshot?.businessContext ? String(snapshot.businessContext).slice(0, 60) + (String(snapshot.businessContext).length > 60 ? "..." : "") : undefined },
                { label: "Channels", value: snapshot?.channels ? `${(snapshot.channels as string[]).length} platforms` : undefined },
                { label: "Brand Age", value: snapshot?.brandAge ? String(snapshot.brandAge) : undefined },
              ]
                .filter((r) => r.value)
                .map(({ label, value }) => (
                  <div key={label}>
                    <p style={{ ...monoStyle, color: "rgba(255,255,255,0.55)", marginBottom: "5px" }}>{label}</p>
                    <p className="text-sm font-medium" style={{ color: "#fff", lineHeight: 1.4 }}>{value}</p>
                  </div>
                ))}
            </div>

            {!!snapshot?.brandPersonality && Array.isArray(snapshot.brandPersonality) && snapshot.brandPersonality.length > 0 && (
              <div style={{ borderTop: "1px solid rgba(255,255,255,0.2)", marginTop: "20px", paddingTop: "20px" }}>
                <p style={{ ...monoStyle, color: "rgba(255,255,255,0.55)", marginBottom: "10px" }}>
                  Brand Personality
                </p>
                <div className="flex flex-wrap gap-5">
                  {(snapshot.brandPersonality as string[]).map((p) => (
                    <span key={p} className="text-sm font-medium" style={{ color: "#fff" }}>
                      {p}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {/* Industry context block */}
        {industryContext && (
          <motion.div {...fade(1.5)}>
            <div style={{ borderTop: `1px solid ${BORDER}`, padding: "28px 0" }}>
              <p style={{ ...monoStyle, color: MUTED, marginBottom: "14px" }}>Sector Context</p>
              <p className="text-sm leading-relaxed mb-5" style={{ color: RUST, fontStyle: "italic" }}>
                {String(industryContext.categoryTension ?? "")}
              </p>
              {Array.isArray(industryContext.strategicThemes) && (industryContext.strategicThemes as string[]).map((theme, i) => (
                <div key={i} className="flex gap-4 mb-3">
                  <span className="font-brand flex-shrink-0" style={{ color: GREEN, fontSize: "1rem", lineHeight: 1.6, minWidth: "20px" }}>/</span>
                  <p className="text-sm" style={{ color: "hsl(var(--foreground))" }}>{theme}</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Brief sections */}
        <motion.div {...fade(2)}>
          <BriefSection label="Key Opportunities" items={brief.keyOpportunities as string[]} />
        </motion.div>

        <motion.div {...fade(3)}>
          <BriefSection label="Strategic Risks" items={brief.strategicRisks as string[]} variant="rust" />
        </motion.div>

        <motion.div {...fade(4)}>
          <BriefSection label="Audience Insights" items={brief.audienceInsights as string[]} />
        </motion.div>

        <motion.div {...fade(5)}>
          <BriefSection label="Messaging Hypotheses" items={brief.messagingHypotheses as string[]} />
        </motion.div>

        <motion.div {...fade(6)}>
          <BriefSection label="Recommended Next Steps" items={brief.recommendedNextSteps as string[]} variant="rust" />
        </motion.div>

        {/* Reading suggestions */}
        {readingSuggestions && readingSuggestions.length > 0 && (
          <motion.div {...fade(6.5)}>
            <div style={{ borderTop: `1px solid ${BORDER}`, padding: "28px 0" }}>
              <p style={{ ...monoStyle, color: MUTED, marginBottom: "20px" }}>
                Reading — Curated for {String(snapshot?.industry ?? "your sector")}
              </p>
              <div className="space-y-4">
                {readingSuggestions.map((r, i) => (
                  <div key={i} className="flex gap-5 items-start">
                    <span style={{ ...monoStyle, color: MUTED, minWidth: "52px" }}>{r.type}</span>
                    <div>
                      <span className="text-sm font-medium" style={{ color: "hsl(var(--foreground))" }}>{r.title}</span>
                      <span className="text-sm ml-2" style={{ color: MUTED }}>— {r.author}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {brief.redFlags && (brief.redFlags as string[]).length > 0 && (
          <motion.div {...fade(7)} style={{ borderTop: `1px solid ${BORDER}`, padding: "28px 0" }}>
            <p style={{ ...monoStyle, color: "hsl(var(--destructive))", marginBottom: "16px" }}>
              Information Gaps
            </p>
            <div className="space-y-4">
              {(brief.redFlags as string[]).map((flag, idx) => (
                <div key={idx} className="flex gap-4">
                  <span className="font-brand" style={{ color: "hsl(var(--destructive))", fontSize: "1.1rem", lineHeight: 1.6 }}>—</span>
                  <p className="text-sm leading-relaxed" style={{ color: MUTED }}>{flag}</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {brief.internalNotes && (
          <motion.div {...fade(8)} style={{ borderTop: `1px solid ${BORDER}`, padding: "28px 0" }}>
            <p style={{ ...monoStyle, color: MUTED, marginBottom: "12px" }}>Internal Notes</p>
            <p className="text-sm leading-relaxed italic" style={{ color: MUTED }}>{brief.internalNotes}</p>
          </motion.div>
        )}

        {/* ── Outputs & Export Panel ─────────────────────────────────── */}
        <motion.div {...fade(9)}>
          <div style={{ borderTop: `2px solid ${GREEN}`, paddingTop: "32px", marginTop: "8px" }}>
            <p style={{ ...monoStyle, color: GREEN, marginBottom: "20px" }}>Outputs</p>

            {/* Action buttons */}
            <div className="flex flex-wrap gap-3 mb-8">
              <button
                onClick={downloadPdf}
                disabled={!pdfAvailable}
                title={pdfAvailable ? undefined : "Available in the full version with the server"}
                className="flex items-center gap-2.5 px-5 py-2.5 text-sm font-medium transition-opacity hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
                style={{ background: GREEN, color: "#fff" }}
              >
                <Download className="w-3.5 h-3.5" />
                {pdfAvailable ? "Download PDF Report" : "PDF Report (full version)"}
              </button>

              <button
                onClick={openClientEmail}
                disabled={emailLoading === "client"}
                className="flex items-center gap-2.5 px-5 py-2.5 text-sm font-medium transition-colors disabled:opacity-50"
                style={{ border: `1px solid ${GREEN}`, color: GREEN, background: "transparent" }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.background = GREEN;
                  (e.currentTarget as HTMLElement).style.color = "#fff";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.background = "transparent";
                  (e.currentTarget as HTMLElement).style.color = GREEN;
                }}
              >
                <Mail className="w-3.5 h-3.5" />
                {emailLoading === "client" ? "Generating..." : "Client Email"}
              </button>

              <button
                onClick={openDirectorEmail}
                disabled={emailLoading === "director"}
                className="flex items-center gap-2.5 px-5 py-2.5 text-sm font-medium transition-colors disabled:opacity-50"
                style={{ border: `1px solid ${RUST}`, color: RUST, background: "transparent" }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.background = RUST;
                  (e.currentTarget as HTMLElement).style.color = "#fff";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.background = "transparent";
                  (e.currentTarget as HTMLElement).style.color = RUST;
                }}
              >
                <FileText className="w-3.5 h-3.5" />
                {emailLoading === "director" ? "Generating..." : "Director Report"}
              </button>
            </div>

            {/* Microsoft 365 file workflow */}
            <div style={{ background: "hsl(var(--muted))", padding: "20px 24px" }}>
              <div className="flex items-start gap-3">
                <FolderOpen className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: GREEN }} />
                <div className="flex-1">
                  <p style={{ ...monoStyle, color: MUTED, marginBottom: "6px" }}>
                    Microsoft 365 file path
                  </p>
                  <code
                    className="text-xs block mb-3"
                    style={{
                      fontFamily: "var(--app-font-mono)",
                      color: "hsl(var(--foreground))",
                      letterSpacing: "0.02em",
                      wordBreak: "break-all",
                    }}
                  >
                    {displayFolderPath}
                  </code>
                  <code
                    className="text-xs block mb-4"
                    style={{
                      fontFamily: "var(--app-font-mono)",
                      color: GREEN,
                      letterSpacing: "0.02em",
                    }}
                  >
                    {displayFilename}
                  </code>
                  <p className="text-xs leading-relaxed" style={{ color: MUTED }}>
                    Download the PDF above, then upload it to the path shown in SharePoint or OneDrive.
                    Create the folder structure if it does not yet exist.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Footer */}
        <motion.div {...fade(10)} style={{ borderTop: `1px solid ${BORDER}`, paddingTop: "24px", marginTop: "32px" }}>
          <p style={{ ...monoStyle, color: MUTED, opacity: 0.5 }}>
            Vāc • Conscious Communication · Confidential · Not for external distribution
          </p>
        </motion.div>

      </div>

      {/* Email preview modal */}
      {emailPreview && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.7)",
            zIndex: 9999,
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Modal header */}
          <div
            className="flex items-center justify-between"
            style={{
              padding: "14px 24px",
              background: "hsl(var(--background))",
              borderBottom: `1px solid ${BORDER}`,
              flexShrink: 0,
            }}
          >
            <div>
              <p style={{ ...monoStyle, color: emailPreview.type === "client" ? GREEN : RUST, marginBottom: "2px" }}>
                {emailPreview.type === "client" ? "Client Email" : "Internal Director Report"}
              </p>
              <p className="text-sm font-medium" style={{ color: "hsl(var(--foreground))" }}>
                {emailPreview.subject}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={async () => {
                  const filename = `${emailPreview.type === "client" ? "client" : "director"}-email_${session?.clientCompany ?? "output"}.html`;
                  if (import.meta.env.VITE_PREVIEW) {
                    // claude.ai beta: files go through the viewer's download capability
                    const claude = (window as unknown as { claude?: { use(n: string): Promise<unknown> } }).claude;
                    const downloads = (await claude?.use("downloads").catch(() => null)) as
                      | { save(f: { filename: string; data: string }): Promise<unknown> }
                      | null
                      | undefined;
                    await downloads?.save({ filename, data: emailPreview.html }).catch(() => undefined);
                    return;
                  }
                  const blob = new Blob([emailPreview.html], { type: "text/html" });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement("a");
                  a.href = url;
                  a.download = filename;
                  a.click();
                  URL.revokeObjectURL(url);
                }}
                className="flex items-center gap-2 px-4 py-2 text-xs font-medium transition-opacity hover:opacity-80"
                style={{ background: emailPreview.type === "client" ? GREEN : RUST, color: "#fff" }}
              >
                <Download className="w-3 h-3" />
                Export HTML
              </button>
              <button
                onClick={() => setEmailPreview(null)}
                className="flex items-center gap-1.5 text-xs transition-colors"
                style={{ color: MUTED }}
              >
                <X className="w-4 h-4" />
                Close
              </button>
            </div>
          </div>
          {/* Email iframe */}
          <div style={{ flex: 1, overflow: "hidden" }}>
            <iframe
              srcDoc={emailPreview.html}
              style={{ width: "100%", height: "100%", border: "none", background: "#fff" }}
              title="Email preview"
            />
          </div>
        </div>
      )}

    </Layout>
  );
}
