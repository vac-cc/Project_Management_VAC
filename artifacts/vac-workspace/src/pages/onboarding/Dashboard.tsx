import { Link, useLocation } from "wouter";
import { motion } from "framer-motion";
import { ArrowRight, Plus } from "lucide-react";
import Layout from "@/components/onboarding/OnboardingLayout";
import { useGetSessionsSummary, useGetRecentSessions } from "@workspace/api-client-react";
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

const fade = {
  hidden: { opacity: 0, y: 14 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] as const, delay: i * 0.07 },
  }),
};

const monoStyle = {
  fontFamily: "var(--app-font-mono)",
  fontSize: "0.58rem",
  letterSpacing: "0.13em",
  textTransform: "uppercase" as const,
};

export default function Dashboard() {
  const [, setLocation] = useLocation();
  const { data: summary, isLoading: summaryLoading } = useGetSessionsSummary();
  const { data: recent, isLoading: recentLoading } = useGetRecentSessions({ limit: 8 });

  return (
    <Layout>
      <div className="max-w-4xl px-14 pt-14 pb-24">

        {/* Masthead */}
        <motion.div custom={0} variants={fade} initial="hidden" animate="show" className="mb-14">
          <p style={{ ...monoStyle, color: MUTED, marginBottom: "12px" }}>
            Strategic Console
          </p>
          <h1
            className="font-brand"
            style={{ fontSize: "3.6rem", color: "hsl(var(--foreground))", lineHeight: 1.05 }}
          >
            Overview
          </h1>
        </motion.div>

        {/* Stats band */}
        <motion.div
          custom={1}
          variants={fade}
          initial="hidden"
          animate="show"
          style={{ borderTop: `1px solid ${BORDER}`, borderBottom: `1px solid ${BORDER}`, padding: "20px 0", marginBottom: "48px" }}
        >
          {summaryLoading ? (
            <div className="flex gap-10">
              {[0, 1, 2, 3].map((i) => <Skeleton key={i} className="h-8 w-20" />)}
            </div>
          ) : (
            <div className="flex flex-wrap">
              {[
                { label: "Sessions", value: summary?.total ?? 0 },
                { label: "Completed", value: summary?.completed ?? 0 },
                { label: "In Progress", value: summary?.inProgress ?? 0 },
                { label: "Completion Rate", value: `${Math.round(summary?.completionRate ?? 0)}%` },
              ].map(({ label, value }, i) => (
                <div
                  key={label}
                  style={{
                    paddingRight: "40px",
                    paddingLeft: i > 0 ? "40px" : 0,
                    borderLeft: i > 0 ? `1px solid ${BORDER}` : "none",
                  }}
                >
                  <div
                    className="font-brand"
                    style={{ fontSize: "2.4rem", color: i % 2 === 0 ? "hsl(var(--foreground))" : RUST, lineHeight: 1 }}
                  >
                    {value}
                  </div>
                  <div style={{ ...monoStyle, color: MUTED, marginTop: "6px" }}>
                    {label}
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Recent sessions */}
        <motion.div custom={2} variants={fade} initial="hidden" animate="show" className="mb-14">
          <div className="flex items-center justify-between mb-5">
            <p style={{ ...monoStyle, color: MUTED }}>
              Recent Activity
            </p>
            <Link
              href="/onboarding/sessions"
              className="text-xs font-sans transition-colors flex items-center gap-1.5"
              style={{ color: GREEN }}
              data-testid="link-all-sessions"
            >
              All sessions
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {recentLoading ? (
            <div>
              {[0, 1, 2].map((i) => (
                <div key={i} style={{ borderTop: `1px solid ${BORDER}`, padding: "18px 0" }}>
                  <Skeleton className="h-4 w-48" />
                </div>
              ))}
            </div>
          ) : recent && recent.length > 0 ? (
            <div>
              {recent.map((session, i) => {
                const cfg = statusConfig[session.status as keyof typeof statusConfig];
                return (
                  <motion.div
                    key={session.id}
                    custom={i + 3}
                    variants={fade}
                    initial="hidden"
                    animate="show"
                    style={{ borderTop: `1px solid ${BORDER}`, padding: "18px 0" }}
                    className="flex items-center justify-between group cursor-pointer"
                    onClick={() => setLocation(`/onboarding/sessions/${session.id}`)}
                    data-testid={`card-session-${session.id}`}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className="font-brand"
                        style={{ color: GREEN, fontSize: "1.1rem", lineHeight: 1 }}
                      >
                        /
                      </span>
                      <div>
                        <span
                          className="font-sans text-sm font-medium group-hover:underline transition-all"
                          style={{ color: "hsl(var(--foreground))", textDecorationColor: GREEN }}
                        >
                          {session.clientName}
                        </span>
                        <span className="text-sm font-sans ml-1.5" style={{ color: MUTED }}>
                          — {session.clientCompany}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-8">
                      <div className="hidden md:flex items-center gap-3">
                        <div style={{ width: "72px", height: "2px", background: BORDER, overflow: "hidden" }}>
                          <div
                            style={{
                              height: "100%",
                              width: `${session.completionPercent}%`,
                              background: GREEN,
                              transition: "width 0.5s ease",
                            }}
                          />
                        </div>
                        <span style={{ ...monoStyle, color: MUTED, width: "32px" }}>
                          {session.completionPercent}%
                        </span>
                      </div>

                      <span style={{ ...monoStyle, color: cfg?.color }}>
                        {cfg?.label}
                      </span>

                      <ArrowRight
                        className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform"
                        style={{ color: GREEN }}
                      />
                    </div>
                  </motion.div>
                );
              })}
              <div style={{ borderTop: `1px solid ${BORDER}` }} />
            </div>
          ) : (
            <div style={{ borderTop: `1px solid ${BORDER}`, padding: "64px 0", textAlign: "center" }}>
              <p className="text-sm font-sans mb-6" style={{ color: MUTED }}>
                No sessions yet. Begin your first client onboarding.
              </p>
              <button
                data-testid="button-start-first"
                onClick={() => setLocation("/onboarding/new")}
                className="text-sm font-sans font-medium flex items-center gap-2 mx-auto transition-colors"
                style={{ color: GREEN }}
              >
                <Plus className="w-3.5 h-3.5" />
                Begin onboarding
              </button>
            </div>
          )}
        </motion.div>

        {/* CTA — green filled block matching website style */}
        <motion.div custom={recent ? recent.length + 3 : 4} variants={fade} initial="hidden" animate="show">
          <button
            data-testid="button-new-onboarding"
            onClick={() => setLocation("/onboarding/new")}
            className="font-sans font-medium text-sm flex items-center gap-3 transition-opacity hover:opacity-90 px-8 py-4"
            style={{ background: GREEN, color: "#fff" }}
          >
            Begin New Client Onboarding
            <ArrowRight className="w-4 h-4" />
          </button>
        </motion.div>

      </div>
    </Layout>
  );
}
