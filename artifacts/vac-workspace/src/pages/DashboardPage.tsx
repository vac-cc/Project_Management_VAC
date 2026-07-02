import React, { useMemo, useState } from "react";
import { useLocation } from "wouter";
import {
  Activity, AlertTriangle, ArrowUpRight, CalendarClock, CheckCircle2,
  CircleDollarSign, Clock, FolderKanban, Landmark, Users2,
} from "lucide-react";
import { PROJECTS, type Project } from "./ProjectsPage";
import { SEED_TEAM } from "./TeamPage";
import {
  buildCostCenters,
  computeAgencyGlobals,
  DEFAULT_MONTHLY_BURN,
  RUNWAY_SAFE_THRESHOLD_MONTHS,
  TAX_DEADLINES,
} from "./FinancePage";

const LEAF = "#99CC33";
const TERRACOTTA = "#BF5700";

// Fixed "today" anchor so the demo dataset (all seeded 2025–2026) always
// resolves to a consistent, presentable relative timeline.
const TODAY = new Date(2026, 6, 2); // 02 Jul 2026

const MONTHS: Record<string, number> = {
  Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
  Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11,
};

function parseMilestoneDate(raw: string): Date {
  const parts = raw.trim().split(/\s+/);
  const year = Number(parts[parts.length - 1]);
  const month = MONTHS[parts[parts.length - 2]] ?? 0;
  const day = Number(parts[0].split(/[–-]/)[0]);
  return new Date(year, month, day);
}

function daysUntil(date: Date): number {
  return Math.ceil((date.getTime() - TODAY.getTime()) / (1000 * 60 * 60 * 24));
}

// ── Cross-project master timeline ────────────────────────────

interface TimelineEntry {
  key: string;
  date: Date;
  label: string;
  project: Project;
}

function buildTimeline(): TimelineEntry[] {
  const entries: TimelineEntry[] = [];
  for (const project of PROJECTS) {
    for (const m of project.milestones) {
      const date = parseMilestoneDate(m.date);
      if (date.getTime() >= TODAY.getTime()) {
        entries.push({ key: `${project.id}-${m.label}`, date, label: m.label, project });
      }
    }
  }
  return entries.sort((a, b) => a.date.getTime() - b.date.getTime()).slice(0, 5);
}

// ── Urgent action items ──────────────────────────────────────

interface ActionItem {
  id: string;
  label: string;
  detail: string;
  severity: "urgent" | "warning";
}

function buildActionItems(netProfit: number): ActionItem[] {
  const items: ActionItem[] = [];
  const activeProjects = PROJECTS.filter((p) => p.status === "active");

  for (const project of activeProjects) {
    const centers = buildCostCenters(project, project.id === "BPC-001");
    for (const center of centers) {
      for (const line of center.items) {
        const overrunPct = line.approved > 0 ? (line.actual - line.approved) / line.approved : 0;
        if (overrunPct > 0.15) {
          items.push({
            id: `overrun-${line.id}`,
            label: `Over-Budget Alert — ${line.label}`,
            detail: `${project.client} · ${project.title} — €${line.actual.toLocaleString()} actual vs €${line.approved.toLocaleString()} approved (+${Math.round(overrunPct * 100)}%)`,
            severity: "urgent",
          });
        } else if (!line.approvedSwitch) {
          items.push({
            id: `approval-${line.id}`,
            label: `Cost Approval Pending — ${line.label}`,
            detail: `${project.client} · ${project.title} — €${line.actual.toLocaleString()} awaiting sign-off`,
            severity: "warning",
          });
        }
      }
    }
  }

  const runwayMonths = DEFAULT_MONTHLY_BURN > 0 ? netProfit / DEFAULT_MONTHLY_BURN : Infinity;
  if (runwayMonths < RUNWAY_SAFE_THRESHOLD_MONTHS) {
    items.unshift({
      id: "runway-alert",
      label: "Liquidity Runway Below Safety Threshold",
      detail: `Current runway is ${runwayMonths.toFixed(1)} months — below the ${RUNWAY_SAFE_THRESHOLD_MONTHS}-month floor`,
      severity: "urgent",
    });
  }

  const nextTax = [...TAX_DEADLINES].sort((a, b) => a.date.getTime() - b.date.getTime())[0];
  if (nextTax) {
    const days = daysUntil(nextTax.date);
    if (days <= 21) {
      items.unshift({
        id: "tax-alert",
        label: `Tax Milestone Approaching — ${nextTax.label}`,
        detail: `Due in ${days} day${days === 1 ? "" : "s"} · ${nextTax.sub}`,
        severity: days <= 7 ? "urgent" : "warning",
      });
    }
  }

  const rank = { urgent: 0, warning: 1 } as const;
  return items.sort((a, b) => rank[a.severity] - rank[b.severity]).slice(0, 6);
}

// ── Active crew stream ────────────────────────────────────────

function buildCrewStream() {
  const activeProjects = PROJECTS.filter((p) => p.status === "active");
  const byInitials = new Map<string, { count: number; projects: string[] }>();
  for (const project of activeProjects) {
    for (const initials of project.crew) {
      const entry = byInitials.get(initials) ?? { count: 0, projects: [] };
      entry.count += 1;
      entry.projects.push(project.title);
      byInitials.set(initials, entry);
    }
  }
  return Array.from(byInitials.entries())
    .map(([initials, data]) => {
      const member = SEED_TEAM.find((m) => m.initials === initials);
      return {
        initials,
        name: member?.name ?? initials,
        role: member?.role ?? "Collaborator",
        count: data.count,
        projects: data.projects,
      };
    })
    .sort((a, b) => b.count - a.count);
}

// ── Briefing room (today's strategic syncs) ──────────────────

const BRIEFINGS = [
  { time: "09:30", title: "Weekly Ops Standup", type: "Internal Sync" },
  { time: "11:00", title: "Beach Pizza Cascais — Brand Strategy Review", type: "Client Presentation" },
  { time: "14:00", title: "Comporta Fine Stays — Identity Concept Check-in", type: "Creative Review" },
  { time: "16:30", title: "Estuário Studio — SEO Progress Call", type: "Client Sync" },
];

// ── Small shared shell ────────────────────────────────────────

function WidgetFrame({
  icon: Icon,
  title,
  onNavigate,
  testId,
  children,
  className = "",
}: {
  icon: React.ComponentType<{ size?: number; strokeWidth?: number; className?: string }>;
  title: string;
  onNavigate?: () => void;
  testId: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      data-testid={testId}
      className={`border-2 border-black flex flex-col bg-background ${className}`}
    >
      <div className="flex items-center justify-between bg-black px-4 py-2.5 shrink-0">
        <div className="flex items-center gap-2">
          <Icon size={13} className="text-white" strokeWidth={2.5} />
          <p className="text-[10px] font-bold text-white uppercase tracking-[0.14em]">{title}</p>
        </div>
        {onNavigate && (
          <button
            onClick={onNavigate}
            data-testid={`${testId}-goto`}
            className="text-white hover:text-[#99CC33] transition-colors"
            title="Open source page"
          >
            <ArrowUpRight size={14} />
          </button>
        )}
      </div>
      <div className="flex-1 min-h-0 flex flex-col">{children}</div>
    </div>
  );
}

// ── Dashboard ──────────────────────────────────────────────────

export default function DashboardPage() {
  const [, setLocation] = useLocation();
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  const globals = useMemo(() => computeAgencyGlobals(), []);
  const runwayMonths = DEFAULT_MONTHLY_BURN > 0 ? globals.netProfit / DEFAULT_MONTHLY_BURN : Infinity;
  const runwayHealthy = runwayMonths >= RUNWAY_SAFE_THRESHOLD_MONTHS;

  const nextTax = useMemo(
    () => [...TAX_DEADLINES].sort((a, b) => a.date.getTime() - b.date.getTime())[0],
    []
  );
  const taxDays = nextTax ? daysUntil(nextTax.date) : Infinity;
  const taxUrgent = taxDays <= 14;

  const timeline = useMemo(() => buildTimeline(), []);
  const actionItems = useMemo(() => buildActionItems(globals.netProfit), [globals.netProfit]);
  const crewStream = useMemo(() => buildCrewStream(), []);

  function toggleChecked(id: string) {
    setChecked((c) => ({ ...c, [id]: !c[id] }));
  }

  return (
    <div className="flex-1 min-w-0 overflow-y-auto bg-background">
      <div className="px-8 py-7 max-w-[1500px] mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-[22px] font-bold tracking-tight text-foreground" data-testid="dashboard-title">
              CEO Daily Brief
            </h1>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              Executive overview — Wednesday, 02 July 2026
            </p>
          </div>
        </div>

        {/* ── 1. TOP ROW MACRO KPIs ───────────────────────────── */}
        <div className="grid grid-cols-3 border-2 border-black divide-x-2 divide-black mb-6" data-testid="ceo-daily-brief">
          {/* Active Operations Tally */}
          <button
            onClick={() => setLocation("/projects")}
            data-testid="kpi-active-operations"
            className="text-left px-6 py-5 hover:bg-[#f7f7f7] transition-colors group"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FolderKanban size={14} className="text-foreground" strokeWidth={2.5} />
                <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-[0.14em]">
                  Active Operations Tally
                </p>
              </div>
              <ArrowUpRight size={13} className="text-muted-foreground group-hover:text-foreground transition-colors" />
            </div>
            <p className="text-[34px] font-bold tracking-tight mt-2 tabular-nums" data-testid="kpi-active-operations-value">
              {globals.activeCount}
            </p>
            <p className="text-[10px] text-muted-foreground mt-1">
              live engagements · {globals.pastCount} completed to date
            </p>
          </button>

          {/* Global Liquidity Runway */}
          <button
            onClick={() => setLocation("/finance")}
            data-testid="kpi-liquidity-runway"
            className="text-left px-6 py-5 hover:bg-[#f7f7f7] transition-colors group"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Landmark size={14} className="text-foreground" strokeWidth={2.5} />
                <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-[0.14em]">
                  Global Liquidity Runway
                </p>
              </div>
              <ArrowUpRight size={13} className="text-muted-foreground group-hover:text-foreground transition-colors" />
            </div>
            <p
              className="text-[34px] font-bold tracking-tight mt-2 tabular-nums"
              style={{ color: runwayHealthy ? LEAF : TERRACOTTA }}
              data-testid="kpi-liquidity-runway-value"
            >
              {Number.isFinite(runwayMonths) ? runwayMonths.toFixed(1) : "∞"} mo
            </p>
            <p className="text-[10px] text-muted-foreground mt-1">
              Net Liquid Cash €{globals.netProfit.toLocaleString(undefined, { maximumFractionDigits: 0 })} ÷ €{DEFAULT_MONTHLY_BURN.toLocaleString()}/mo burn
            </p>
          </button>

          {/* Next Tax Milestone Badge */}
          <button
            onClick={() => setLocation("/finance")}
            data-testid="kpi-tax-milestone"
            className="text-left px-6 py-5 hover:bg-[#f7f7f7] transition-colors group"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CalendarClock size={14} className="text-foreground" strokeWidth={2.5} />
                <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-[0.14em]">
                  Next Tax Milestone
                </p>
              </div>
              <ArrowUpRight size={13} className="text-muted-foreground group-hover:text-foreground transition-colors" />
            </div>
            <div className="mt-2 flex items-center gap-2">
              <span
                className="inline-block px-2 py-1 text-[11px] font-bold text-white uppercase tracking-wide"
                style={{ backgroundColor: taxUrgent ? TERRACOTTA : "#1a1a1a" }}
                data-testid="kpi-tax-milestone-badge"
              >
                {taxDays} day{taxDays === 1 ? "" : "s"}
              </span>
              <p className="text-[13px] font-bold text-foreground">{nextTax?.label}</p>
            </div>
            <p className="text-[10px] text-muted-foreground mt-1.5">{nextTax?.sub}</p>
          </button>
        </div>

        {/* ── 2 & 3. LEFT + RIGHT COLUMNS ─────────────────────── */}
        <div className="grid grid-cols-2 gap-6">
          {/* LEFT COLUMN */}
          <div className="flex flex-col gap-6">
            {/* Urgent Action Items */}
            <WidgetFrame
              icon={AlertTriangle}
              title="Urgent Action Items"
              testId="widget-urgent-actions"
              onNavigate={() => setLocation("/finance")}
            >
              <div className="divide-y divide-border">
                {actionItems.length === 0 && (
                  <p className="px-4 py-6 text-[11px] text-muted-foreground">No urgent items — all clear.</p>
                )}
                {actionItems.map((item) => {
                  const isChecked = !!checked[item.id];
                  const color = item.severity === "urgent" ? TERRACOTTA : "#1a1a1a";
                  return (
                    <div
                      key={item.id}
                      data-testid={`action-item-${item.id}`}
                      className="flex items-start gap-3 px-4 py-3 hover:bg-[#f7f7f7] transition-colors cursor-pointer"
                      onClick={() => setLocation("/finance")}
                    >
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleChecked(item.id);
                        }}
                        data-testid={`action-item-${item.id}-checkbox`}
                        className="w-4 h-4 border-2 border-black shrink-0 mt-0.5 flex items-center justify-center"
                        style={{ backgroundColor: isChecked ? LEAF : "transparent" }}
                      >
                        {isChecked && <CheckCircle2 size={11} className="text-black" strokeWidth={3} />}
                      </button>
                      <div className="min-w-0">
                        <p
                          className={`text-[12px] font-bold ${isChecked ? "line-through text-muted-foreground" : "text-foreground"}`}
                          style={!isChecked ? { color } : undefined}
                        >
                          {item.label}
                        </p>
                        <p className="text-[10px] text-muted-foreground mt-0.5">{item.detail}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </WidgetFrame>

            {/* Cross-Project Master Timeline */}
            <WidgetFrame
              icon={Clock}
              title="Cross-Project Master Timeline"
              testId="widget-master-timeline"
              onNavigate={() => setLocation("/projects")}
              className="flex-1"
            >
              <div className="divide-y divide-border">
                {timeline.map((entry) => {
                  const days = daysUntil(entry.date);
                  const isSoon = days <= 7;
                  return (
                    <button
                      key={entry.key}
                      onClick={() => setLocation("/projects")}
                      data-testid={`timeline-entry-${entry.key}`}
                      className="w-full text-left flex items-center gap-3 px-4 py-3 hover:bg-[#f7f7f7] transition-colors"
                    >
                      <div
                        className="w-1.5 h-10 shrink-0"
                        style={{ backgroundColor: isSoon ? TERRACOTTA : LEAF }}
                      />
                      <div className="min-w-0 flex-1">
                        <p className="text-[12px] font-bold text-foreground truncate">{entry.label}</p>
                        <p className="text-[10px] text-muted-foreground mt-0.5 truncate">
                          {entry.project.client} · {entry.project.title}
                        </p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-[11px] font-bold" style={{ color: isSoon ? TERRACOTTA : "#1a1a1a" }}>
                          {entry.date.toLocaleDateString("en-GB", { day: "2-digit", month: "short" })}
                        </p>
                        <p className="text-[9px] text-muted-foreground mt-0.5">{days}d</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </WidgetFrame>
          </div>

          {/* RIGHT COLUMN */}
          <div className="flex flex-col gap-6">
            {/* Briefing Room */}
            <WidgetFrame
              icon={CalendarClock}
              title="The Briefing Room"
              testId="widget-briefing-room"
            >
              <div className="divide-y divide-border">
                {BRIEFINGS.map((b, i) => (
                  <div
                    key={i}
                    data-testid={`briefing-item-${i}`}
                    className="flex items-center gap-3 px-4 py-3"
                  >
                    <div className="w-14 shrink-0 text-[12px] font-bold text-foreground tabular-nums">{b.time}</div>
                    <div className="w-px h-8 bg-black shrink-0" />
                    <div className="min-w-0">
                      <p className="text-[12px] font-bold text-foreground truncate">{b.title}</p>
                      <p className="text-[10px] text-muted-foreground mt-0.5">{b.type}</p>
                    </div>
                  </div>
                ))}
              </div>
            </WidgetFrame>

            {/* Active Crew Stream */}
            <WidgetFrame
              icon={Users2}
              title="Active Crew Stream"
              testId="widget-crew-stream"
              onNavigate={() => setLocation("/team")}
              className="flex-1"
            >
              <div className="divide-y divide-border">
                {crewStream.map((member) => (
                  <button
                    key={member.initials}
                    onClick={() => setLocation("/team")}
                    data-testid={`crew-stream-${member.initials}`}
                    className="w-full text-left flex items-center gap-3 px-4 py-3 hover:bg-[#f7f7f7] transition-colors"
                  >
                    <div
                      className="w-8 h-8 flex items-center justify-center text-[10px] font-bold shrink-0"
                      style={{ backgroundColor: LEAF, color: "#000" }}
                    >
                      {member.initials}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[12px] font-bold text-foreground truncate">{member.name}</p>
                      <p className="text-[10px] text-muted-foreground mt-0.5 truncate">{member.role}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-[13px] font-bold text-foreground tabular-nums">{member.count}</p>
                      <p className="text-[9px] text-muted-foreground">active</p>
                    </div>
                  </button>
                ))}
              </div>
            </WidgetFrame>
          </div>
        </div>
      </div>
    </div>
  );
}
