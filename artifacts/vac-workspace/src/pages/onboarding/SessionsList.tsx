import { useState } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { ArrowRight, Plus, Trash2 } from "lucide-react";
import Layout from "@/components/onboarding/OnboardingLayout";
import {
  useListSessions,
  useDeleteSession,
  getListSessionsQueryKey,
  getGetSessionsSummaryQueryKey,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
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

const FILTERS = [
  { value: "", label: "All" },
  { value: "in_progress", label: "In Progress" },
  { value: "completed", label: "Completed" },
  { value: "paused", label: "Paused" },
];

const fade = (i = 0) => ({
  initial: { opacity: 0, y: 8 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.25, 0.1, 0.25, 1] as const, delay: i * 0.05 },
  },
});

export default function SessionsList() {
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleteName, setDeleteName] = useState<string>("");

  const params = {
    ...(statusFilter ? { status: statusFilter as "in_progress" | "completed" | "paused" } : {}),
    ...(search ? { search } : {}),
  };

  const { data: sessions, isLoading } = useListSessions(params, {
    query: { queryKey: getListSessionsQueryKey(params) },
  });

  const deleteSession = useDeleteSession();

  function confirmDelete(id: number, name: string) {
    setDeleteId(id);
    setDeleteName(name);
  }

  function handleDelete() {
    if (!deleteId) return;
    deleteSession.mutate(
      { id: deleteId },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListSessionsQueryKey() });
          queryClient.invalidateQueries({ queryKey: getGetSessionsSummaryQueryKey() });
          setDeleteId(null);
        },
      }
    );
  }

  return (
    <Layout>
      <div className="max-w-5xl px-14 pt-14 pb-24">

        {/* Header */}
        <motion.div {...fade(0)} className="mb-10">
          <p style={{ ...monoStyle, color: MUTED, marginBottom: "12px" }}>All Sessions</p>
          <div className="flex items-end justify-between gap-8">
            <h1 className="font-brand" style={{ fontSize: "3.4rem", lineHeight: 1.05 }}>
              Sessions
            </h1>
            <button
              data-testid="button-new-session"
              onClick={() => setLocation("/onboarding/new")}
              className="font-sans font-medium text-sm flex items-center gap-2 px-5 py-2.5 flex-shrink-0 transition-opacity hover:opacity-90"
              style={{ background: GREEN, color: "#fff" }}
            >
              <Plus className="w-3.5 h-3.5" />
              New
            </button>
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div
          {...fade(1)}
          style={{ borderTop: `1px solid ${BORDER}`, borderBottom: `1px solid ${BORDER}`, padding: "14px 0", marginBottom: "28px" }}
          className="flex items-center gap-6 flex-wrap"
        >
          <Input
            data-testid="input-search"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent border-0 border-b font-sans text-sm h-auto py-1 px-0 w-36"
            style={{ boxShadow: "none", borderRadius: 0, borderBottomColor: BORDER }}
            onFocus={(e) => { e.target.style.borderBottomColor = GREEN; }}
            onBlur={(e) => { e.target.style.borderBottomColor = BORDER; }}
          />
          <div style={{ width: "1px", height: "16px", background: BORDER }} />
          <div className="flex items-center gap-4">
            {FILTERS.map((f) => (
              <button
                key={f.value}
                data-testid={`filter-${f.value || "all"}`}
                onClick={() => setStatusFilter(f.value)}
                style={{
                  ...monoStyle,
                  color: statusFilter === f.value ? "hsl(var(--foreground))" : MUTED,
                  fontWeight: statusFilter === f.value ? 700 : 400,
                  transition: "color 0.15s",
                }}
              >
                {f.label}
              </button>
            ))}
          </div>
          {sessions && (
            <span style={{ ...monoStyle, color: MUTED, marginLeft: "auto" }}>
              {sessions.length} {sessions.length === 1 ? "session" : "sessions"}
            </span>
          )}
        </motion.div>

        {/* Table */}
        {isLoading ? (
          <div>
            {[0, 1, 2, 3].map((i) => (
              <div key={i} style={{ borderBottom: `1px solid ${BORDER}`, padding: "18px 0" }}>
                <Skeleton className="h-4 w-48" />
              </div>
            ))}
          </div>
        ) : sessions && sessions.length > 0 ? (
          <div>
            {/* Column headers */}
            <div
              className="grid"
              style={{
                gridTemplateColumns: "1fr 160px 100px 120px 72px",
                gap: "24px",
                borderBottom: `1px solid ${BORDER}`,
                paddingBottom: "10px",
              }}
            >
              {["Client", "Manager", "Progress", "Status", ""].map((h) => (
                <span key={h} style={{ ...monoStyle, color: MUTED }}>{h}</span>
              ))}
            </div>

            {sessions.map((session, i) => {
              const cfg = statusConfig[session.status as keyof typeof statusConfig];
              return (
                <motion.div
                  key={session.id}
                  {...fade(i + 2)}
                  className="grid group items-center"
                  style={{
                    gridTemplateColumns: "1fr 160px 100px 120px 72px",
                    gap: "24px",
                    borderBottom: `1px solid ${BORDER}`,
                    padding: "18px 0",
                  }}
                  data-testid={`row-session-${session.id}`}
                >
                  {/* Name */}
                  <button className="text-left" onClick={() => setLocation(`/onboarding/sessions/${session.id}`)}>
                    <span
                      className="font-sans text-sm font-medium flex items-center gap-2.5 group-hover:underline transition-all"
                      style={{ color: "hsl(var(--foreground))", textDecorationColor: GREEN }}
                    >
                      <span className="font-brand" style={{ color: GREEN, fontSize: "1rem", lineHeight: 1 }}>/</span>
                      {session.clientName}
                    </span>
                    <span className="font-sans text-xs mt-0.5 block" style={{ color: MUTED, paddingLeft: "22px" }}>
                      {session.clientCompany}
                    </span>
                  </button>

                  {/* Manager */}
                  <span className="font-sans text-xs" style={{ color: MUTED }}>{session.accountManager}</span>

                  {/* Progress */}
                  <div className="flex items-center gap-2">
                    <div style={{ flex: 1, height: "2px", background: BORDER, overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${session.completionPercent}%`, background: GREEN }} />
                    </div>
                    <span style={{ ...monoStyle, color: MUTED, flexShrink: 0 }}>{session.completionPercent}%</span>
                  </div>

                  {/* Status */}
                  <span style={{ ...monoStyle, color: cfg?.color }}>{cfg?.label}</span>

                  {/* Actions */}
                  <div className="flex items-center gap-3 justify-end">
                    {(session.status === "completed" || session.status === "in_progress") && (
                      <button
                        data-testid={session.status === "completed" ? `button-view-brief-${session.id}` : `button-continue-${session.id}`}
                        onClick={() =>
                          session.status === "completed"
                            ? setLocation(`/onboarding/sessions/${session.id}/brief`)
                            : setLocation(`/onboarding/flow/${session.id}`)
                        }
                        className="transition-colors"
                        style={{ color: GREEN }}
                        title={session.status === "completed" ? "View brief" : "Continue"}
                      >
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                    <button
                      data-testid={`button-delete-${session.id}`}
                      onClick={() => confirmDelete(session.id, session.clientName)}
                      className="transition-colors opacity-0 group-hover:opacity-100"
                      style={{ color: MUTED }}
                      onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "hsl(var(--destructive))"; }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = MUTED; }}
                      title="Delete"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <motion.div {...fade(2)} style={{ borderTop: `1px solid ${BORDER}`, padding: "64px 0 32px", textAlign: "center" }}>
            <p className="font-sans text-sm mb-6" style={{ color: MUTED }}>
              {search || statusFilter ? "No sessions match your filters." : "No sessions yet."}
            </p>
            {!search && !statusFilter && (
              <button
                data-testid="button-start-first-sessions"
                onClick={() => setLocation("/onboarding/new")}
                className="font-sans font-medium text-sm flex items-center gap-2 mx-auto transition-colors"
                style={{ color: GREEN }}
              >
                <Plus className="w-3.5 h-3.5" />
                Begin first onboarding
              </button>
            )}
          </motion.div>
        )}
      </div>

      <AlertDialog open={deleteId !== null} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent className="vac-onboarding bg-background border border-border">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-brand text-2xl">
              Delete session?
            </AlertDialogTitle>
            <AlertDialogDescription className="font-sans text-sm" style={{ color: MUTED }}>
              This will permanently remove the session for{" "}
              <strong className="font-medium" style={{ color: "hsl(var(--foreground))" }}>{deleteName}</strong>{" "}
              and all associated brief data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="font-sans text-sm border-border bg-transparent">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              data-testid="button-confirm-delete"
              onClick={handleDelete}
              className="font-sans text-sm font-medium border-0"
              style={{ background: "hsl(var(--destructive))", color: "#fff" }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Layout>
  );
}
