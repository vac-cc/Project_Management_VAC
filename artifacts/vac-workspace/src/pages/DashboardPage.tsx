import React, { useMemo, useState } from "react";
import { useLocation } from "wouter";
import {
  AlertTriangle, ArrowUpRight, CalendarClock, CheckCircle2,
  CircleDollarSign, FolderKanban, MessageSquareText,
  ThumbsUp, Users2, Wallet,
} from "lucide-react";
import { PROJECTS, type Project } from "./ProjectsPage";
import { SEED_TEAM } from "./TeamPage";
import { CLIENTS } from "./ClientsPage";

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
  const month = MONTHS[parts.length >= 2 ? parts[parts.length - 2] : parts[0]] ?? 0;
  const day = parts.length >= 3 ? Number(parts[0].split(/[–-]/)[0]) : 1;
  return new Date(year, month, day);
}

function daysUntil(date: Date): number {
  return Math.ceil((date.getTime() - TODAY.getTime()) / (1000 * 60 * 60 * 24));
}

// ── Operational Burn Checklist (next 5 upcoming deadlines) ────

interface DeadlineEntry {
  key: string;
  date: Date;
  label: string;
  project: Project;
}

function buildUpcomingDeadlines(): DeadlineEntry[] {
  const entries: DeadlineEntry[] = [];
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

// ── Active crew blueprint ────────────────────────────────────

function buildCrewStream() {
  const activeProjects = PROJECTS.filter((p) => p.status === "active");
  const byInitials = new Map<string, { count: number; projects: Project[] }>();
  for (const project of activeProjects) {
    for (const initials of project.crew) {
      const entry = byInitials.get(initials) ?? { count: 0, projects: [] };
      entry.count += 1;
      entry.projects.push(project);
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
        // Route the click to whichever active project this collaborator is
        // busiest on — that's the project Zone C should open pre-filtered to.
        primaryProject: data.projects[0],
      };
    })
    .sort((a, b) => ["PO", "CP", "AA", "IF"].indexOf(a.initials) - ["PO", "CP", "AA", "IF"].indexOf(b.initials));
}

// ── Briefing room (today's strategic syncs) ──────────────────

const BRIEFINGS: { time: string; title: string; type: string }[] = [];

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
  const activeCount = PROJECTS.filter((p) => p.status === "active").length;
  const notStartedCount = PROJECTS.filter((p) => p.status === "not-started").length;
  const completedCount = PROJECTS.filter((p) => p.status === "past").length;
  const totalProjects = PROJECTS.length;
  const totalClients = CLIENTS.length;
  const totalProfit = CLIENTS.reduce((total, client) => total + Number(client.profit.replace(/[^0-9]/g, "")), 0);
  const upcomingDeadlines = useMemo(() => buildUpcomingDeadlines(), []);
  const crewStream = useMemo(() => buildCrewStream(), []);
  const actionItems: { id: string; label: string; detail: string; severity: "urgent" | "warning" }[] = [];

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

        {/* ── Real-Time Cash Flow & Liquidity Monitor ─────────── */}
        <div
          data-testid="cash-flow-monitor"
          className="mb-6 transition-colors"
          style={{ border: "3px solid #1a1a1a" }}
        >
          <div className="flex items-center justify-between bg-black px-4 py-2.5">
            <div className="flex items-center gap-2">
              <Wallet size={13} className="text-white" strokeWidth={2.5} />
              <p className="text-[10px] font-bold text-white uppercase tracking-[0.16em]">
                Real-Time Cash Flow &amp; Liquidity Monitor
              </p>
            </div>
            <p className="text-[9px] font-bold text-white/60 uppercase tracking-wider">
              No cash flow data
            </p>
          </div>
          <div className="grid grid-cols-3 divide-x-2 divide-black">
            {/* Current Month Balance */}
            <button
              onClick={() => setLocation("/finance")}
              data-testid="monitor-current-balance"
              className="text-left px-6 py-5 hover:bg-[#f7f7f7] transition-colors"
            >
              <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-[0.14em]">
                Current Month Balance
              </p>
              <p
                className="text-[26px] font-bold tracking-tight mt-1.5 tabular-nums"
                style={{ color: "#1a1a1a" }}
              >
                €0
              </p>
              <p className="text-[10px] text-muted-foreground mt-1">
                €0 in · €0 out
              </p>
            </button>

            {/* Progress to Monthly Target */}
            <button
              onClick={() => setLocation("/finance")}
              data-testid="monitor-monthly-progress"
              className="text-left px-6 py-5 hover:bg-[#f7f7f7] transition-colors"
            >
              <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-[0.14em]">
                Monthly Cash Flow Recorded
              </p>
              <p
                className="text-[16px] font-bold tracking-tight mt-1.5 tabular-nums"
                style={{ color: "#1a1a1a" }}
              >
                €0
                <span className="text-[10px] text-muted-foreground font-normal"> / €0</span>
              </p>
              <div className="h-1.5 bg-black/10 mt-2.5 w-full">
                <div
                  className="h-full transition-all"
                  style={{
                    width: "0%",
                    backgroundColor: "#1a1a1a",
                  }}
                />
              </div>
            </button>

            {/* Progress to Yearly Target */}
            <button
              onClick={() => setLocation("/finance")}
              data-testid="monitor-yearly-progress"
              className="text-left px-6 py-5 hover:bg-[#f7f7f7] transition-colors"
            >
              <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-[0.14em]">
                Yearly Cash Flow Recorded
              </p>
              <p
                className="text-[16px] font-bold tracking-tight mt-1.5 tabular-nums"
                style={{ color: "#1a1a1a" }}
              >
                €0
                <span className="text-[10px] text-muted-foreground font-normal"> / €0</span>
              </p>
              <div className="h-1.5 bg-black/10 mt-2.5 w-full">
                <div
                  className="h-full transition-all"
                  style={{ width: "0%", backgroundColor: "#1a1a1a" }}
                />
              </div>
            </button>
          </div>
        </div>

        {/* ── TOP ROW MACRO KPIs ───────────────────────────────── */}
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
              {totalProjects}
            </p>
            <p className="text-[10px] text-muted-foreground mt-1">
              {activeCount} active · {notStartedCount} not yet started · {completedCount} completed
            </p>
          </button>

          {/* Total Clients */}
          <button
            onClick={() => setLocation("/clients")}
            data-testid="kpi-total-clients"
            className="text-left px-6 py-5 hover:bg-[#f7f7f7] transition-colors group"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users2 size={14} className="text-foreground" strokeWidth={2.5} />
                <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-[0.14em]">
                  Total Clients
                </p>
              </div>
              <ArrowUpRight size={13} className="text-muted-foreground group-hover:text-foreground transition-colors" />
            </div>
            <p className="text-[34px] font-bold tracking-tight mt-2 tabular-nums" data-testid="kpi-total-clients-value">
              {totalClients}
            </p>
            <p className="text-[10px] text-muted-foreground mt-1">
              real client records
            </p>
          </button>

          {/* Total Profit */}
          <button
            onClick={() => setLocation("/clients")}
            data-testid="kpi-total-profit"
            className="text-left px-6 py-5 hover:bg-[#f7f7f7] transition-colors group"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CircleDollarSign size={14} className="text-foreground" strokeWidth={2.5} />
                <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-[0.14em]">
                  Total Profit
                </p>
              </div>
              <ArrowUpRight size={13} className="text-muted-foreground group-hover:text-foreground transition-colors" />
            </div>
            <p className="text-[34px] font-bold tracking-tight mt-2 tabular-nums" data-testid="kpi-total-profit-value">
              €{totalProfit.toLocaleString()}
            </p>
            <p className="text-[10px] text-muted-foreground mt-1">recorded profit</p>
          </button>
        </div>

        {/* ── Daily Action Hub ─────────────────────────────────── */}
        <div className="mb-6" data-testid="daily-action-hub">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-[#99CC33] font-bold text-sm leading-none">/</span>
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.14em]">Daily Action Hub</p>
          </div>

          {/* Immediate Approvals Row */}
          <div
            data-testid="immediate-approvals-row"
            className="border-2 border-black bg-background mb-4"
          >
            <div className="flex items-center gap-2 bg-black px-4 py-2.5">
              <ThumbsUp size={13} className="text-white" strokeWidth={2.5} />
              <p className="text-[10px] font-bold text-white uppercase tracking-[0.14em]">Immediate Approvals</p>
              <span className="ml-auto text-[9px] font-bold text-white/60 uppercase tracking-wider">
                0 pending
              </span>
            </div>
            <div className="p-3 flex flex-wrap gap-2">
              <p className="px-2 py-3 text-[11px] text-muted-foreground">No approval data recorded.</p>
            </div>
          </div>

          {/* Operational Burn Checklist */}
          <WidgetFrame
            icon={CheckCircle2}
            title="Operational Burn Checklist"
            testId="widget-burn-checklist"
            onNavigate={() => setLocation("/projects")}
          >
            <div className="divide-y divide-border">
              {upcomingDeadlines.map((entry) => {
                const days = daysUntil(entry.date);
                const isSoon = days <= 7;
                const isDone = !!checked[entry.key];
                return (
                  <div
                    key={entry.key}
                    data-testid={`checklist-entry-${entry.key}`}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-[#f7f7f7] transition-colors"
                  >
                    <button
                      onClick={() => toggleChecked(entry.key)}
                      data-testid={`checklist-entry-${entry.key}-checkbox`}
                      className="w-4 h-4 border-2 border-black shrink-0 flex items-center justify-center"
                      style={{ backgroundColor: isDone ? LEAF : "transparent" }}
                    >
                      {isDone && <CheckCircle2 size={11} className="text-black" strokeWidth={3} />}
                    </button>
                    <button
                      onClick={() => setLocation(`/projects?project=${entry.project.id}`)}
                      className="min-w-0 flex-1 text-left"
                    >
                      <p className={`text-[12px] font-bold truncate ${isDone ? "line-through text-muted-foreground" : "text-foreground"}`}>
                        {entry.label}
                      </p>
                      <p className="text-[10px] text-muted-foreground mt-0.5 truncate">
                        {entry.project.client} · {entry.project.title}
                      </p>
                    </button>
                    <div className="text-right shrink-0">
                      <p className="text-[11px] font-bold" style={{ color: isSoon && !isDone ? TERRACOTTA : "#1a1a1a" }}>
                        {entry.date.toLocaleDateString("en-GB", { day: "2-digit", month: "short" })}
                      </p>
                      <p className="text-[9px] text-muted-foreground mt-0.5">{days}d</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </WidgetFrame>
        </div>

        {/* ── LEFT + RIGHT COLUMNS ─────────────────────────────── */}
        <div className="grid grid-cols-2 gap-6">
          {/* LEFT COLUMN */}
          <div className="flex flex-col gap-6">
            {/* Urgent Action Items */}
            <WidgetFrame
              icon={AlertTriangle}
              title="Urgent Action Items"
              testId="widget-urgent-actions"
              onNavigate={() => setLocation("/finance")}
              className="flex-1"
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
                {BRIEFINGS.length === 0 && (
                  <p className="px-4 py-6 text-[11px] text-muted-foreground">No briefing room entries recorded.</p>
                )}
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

            {/* Active Crew Blueprint */}
            <WidgetFrame
              icon={Users2}
              title="Active Crew Blueprint"
              testId="widget-crew-blueprint"
              onNavigate={() => setLocation("/team")}
              className="flex-1"
            >
              <div className="divide-y divide-border">
                {crewStream.map((member) => (
                  <button
                    key={member.initials}
                    onClick={() =>
                      member.primaryProject
                        ? setLocation(`/projects?project=${member.primaryProject.id}`)
                        : setLocation("/team")
                    }
                    data-testid={`crew-blueprint-${member.initials}`}
                    title={member.primaryProject ? `Open ${member.primaryProject.title} chat` : undefined}
                    className="w-full text-left flex items-center gap-3 px-4 py-3 hover:bg-[#f7f7f7] transition-colors group"
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
                    <div className="text-right shrink-0 flex items-center gap-2">
                      <div>
                        <p className="text-[13px] font-bold text-foreground tabular-nums">{member.count}</p>
                        <p className="text-[9px] text-muted-foreground">active</p>
                      </div>
                      <MessageSquareText size={13} className="text-muted-foreground group-hover:text-foreground transition-colors" />
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
