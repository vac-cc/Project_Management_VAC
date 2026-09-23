import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertTriangle,
  CircleDollarSign,
  ChevronRight,
  Film,
  HardHat,
  Stamp,
  Users,
} from "lucide-react";
import { PROJECTS, type Project } from "./ProjectsPage";
import {
  getProjectFinancialRecord,
  PROJECT_FINANCIALS,
  type FinanceCostLine,
  type ProjectFinanceRecord,
} from "../data/projectFinancials";

// ── Tabs ─────────────────────────────────────────────────────

type FinanceTab = "projects" | "fiscal" | "agency";

const FINANCE_TABS: { id: FinanceTab; label: string }[] = [
  { id: "projects", label: "Project Management" },
  { id: "fiscal", label: "Financial Management" },
  { id: "agency", label: "Agency Management" },
];

// ── Real project finance records ─────────────────────────────

export type CostLine = FinanceCostLine;

export interface CostCenter {
  id: string;
  label: string;
  icon: React.ComponentType<{ size?: number; strokeWidth?: number; className?: string }>;
  items: CostLine[];
}

interface ProjectTeamMember {
  name: string;
  role: string;
}

const COST_CENTER_DEFINITIONS: Omit<CostCenter, "items">[] = [
  { id: "hr", label: "Human Resources — Freelancer Costs", icon: Users },
  { id: "prod", label: "Production Costs", icon: HardHat },
  { id: "post", label: "Post-Production Costs", icon: Film },
  { id: "lic", label: "Licensing & Permissions", icon: Stamp },
];

function emptyCostCenters(): CostCenter[] {
  return COST_CENTER_DEFINITIONS.map((center) => ({ ...center, items: [] }));
}

export function buildCostCenters(project: Project): CostCenter[] {
  const record = getProjectFinancialRecord(project.id);
  if (!record) return [];
  return COST_CENTER_DEFINITIONS.map((center) => ({
    ...center,
    items: center.id === "hr" ? record.costs : [],
  }));
}

function getProjectFinance(project: Project): ProjectFinanceRecord | null {
  return getProjectFinancialRecord(project.id);
}

// ── Main page ────────────────────────────────────────────────

export default function FinancePage() {
  const [tab, setTab] = useState<FinanceTab>("projects");

  return (
    <div className="flex-1 h-full flex flex-col min-w-0 bg-white overflow-hidden">
      <div className="shrink-0 border-b border-border px-8 pt-6 flex items-end justify-between">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <span className="text-accent font-bold text-sm leading-none">/</span>
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.14em]">Finance</p>
          </div>
          <div className="flex items-end">
            {FINANCE_TABS.map((t) => {
              const active = tab === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  data-testid={`finance-tab-${t.id}`}
                  className={`flex items-center gap-1.5 px-4 py-2.5 text-[11px] font-bold uppercase tracking-[0.12em] border-b-2 -mb-px transition-all duration-150 ${
                    active
                      ? "text-foreground border-b-accent"
                      : "text-muted-foreground border-b-transparent hover:text-foreground"
                  }`}
                >
                  {active && <span className="text-accent font-bold text-sm leading-none">/</span>}
                  {t.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="flex-1 min-h-0 overflow-hidden relative">
        <AnimatePresence mode="wait">
          {tab === "projects" && <ProjectManagementTab key="projects" />}
          {tab === "fiscal" && <EmptyFinanceTab key="fiscal" title="Financial Management" />}
          {tab === "agency" && <EmptyFinanceTab key="agency" title="Agency Management" />}
        </AnimatePresence>
      </div>
    </div>
  );
}

// ── Project management ──────────────────────────────────────

function ProjectManagementTab() {
  const financeProjects = useMemo(
    () => PROJECTS.filter((project) => Boolean(getProjectFinance(project))),
    [],
  );
  const [selectedId, setSelectedId] = useState(financeProjects[0]?.id ?? "");
  const selected = financeProjects.find((project) => project.id === selectedId) ?? financeProjects[0];
  const record = selected ? getProjectFinance(selected) : null;
  const costCenters = record?.costCenters ?? [];
  const totalApproved = costCenters.reduce(
    (sum, center) => sum + center.items.reduce((centerSum, line) => centerSum + line.approved, 0),
    0,
  );
  const totalActual = costCenters.reduce(
    (sum, center) => sum + center.items.reduce((centerSum, line) => centerSum + line.actual, 0),
    0,
  );
  const overBudget = record ? totalActual - record.budget : 0;

  if (!selected || !record) {
    return <EmptyFinanceTab title="Project Management" />;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="absolute inset-0 flex overflow-hidden"
    >
      {/* ── Project rail ── */}
      <div className="w-[260px] shrink-0 border-r border-border flex flex-col overflow-y-auto">
        <div className="px-5 py-4 border-b border-border">
          <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-[0.14em]">
            Real Project Records — {financeProjects.length}
          </p>
        </div>
        {financeProjects.map((project) => {
          const active = project.id === selected.id;
          const projectFinance = getProjectFinance(project);
          return (
            <button
              key={project.id}
              onClick={() => setSelectedId(project.id)}
              data-testid={`finance-project-${project.id}`}
              className={`text-left px-5 py-3.5 border-b border-border transition-colors flex items-center justify-between gap-2 ${
                active ? "bg-muted" : "hover:bg-muted/50"
              }`}
              style={active ? { borderLeft: `3px solid ${project.clientAccent}` } : { borderLeft: "3px solid transparent" }}
            >
              <div className="min-w-0">
                <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider truncate">{project.client}</p>
                <p className="text-[12px] font-bold text-foreground tracking-tight truncate mt-0.5">{project.title}</p>
                <p className="text-[10px] text-muted-foreground mt-1">€{projectFinance?.budget.toLocaleString()} total budget</p>
              </div>
              <ChevronRight size={13} className={active ? "text-foreground shrink-0" : "text-muted-foreground shrink-0"} />
            </button>
          );
        })}
      </div>

      {/* ── Real project breakdown ── */}
      <div className="flex-1 min-w-0 overflow-y-auto">
        <div className="px-8 py-5 border-b border-border flex items-center justify-between sticky top-0 bg-white z-10">
          <div>
            <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-[0.14em]">Project Budget Breakdown</p>
            <p className="text-[16px] font-bold text-foreground tracking-tight mt-0.5">{selected.client} — {selected.title}</p>
          </div>
          <div className="flex items-center gap-6">
            <Metric label="Total Budget" value={record.budget} />
            <Metric label="Recorded Costs" value={totalActual} tone={overBudget > 0 ? "warning" : "normal"} />
          </div>
        </div>

        {overBudget > 0 && (
          <div className="mx-8 mt-5 border-2 border-primary bg-primary/10 px-4 py-3 flex items-center gap-3">
            <AlertTriangle size={16} className="text-primary shrink-0" strokeWidth={2.5} />
            <p className="text-[11px] font-bold uppercase tracking-wide text-primary">
              Recorded freelancer costs exceed the project value by €{overBudget.toLocaleString()}
            </p>
          </div>
        )}

        <div className="px-8 pt-6">
          <ProjectFinancialSummary budget={record.budget} totalApproved={totalApproved} totalActual={totalActual} />
        </div>

        <div className="px-8 pt-6">
          <div className="border border-border px-4 py-4">
            <div className="flex items-center gap-2 mb-3">
              <Users size={13} strokeWidth={2.5} className="text-foreground" />
              <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-foreground">Team</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {record.team.map((member) => (
                <div key={member.name} className="border border-border px-3 py-2">
                  <p className="text-[10px] font-bold text-foreground">{member.name}</p>
                  <p className="text-[9px] text-muted-foreground mt-0.5">{member.role}</p>
                </div>
              ))}
            </div>
            {record.note && (
              <p className="text-[10px] font-bold text-muted-foreground mt-3 uppercase tracking-wider">{record.note}</p>
            )}
          </div>
        </div>

        <div className="px-8 py-6 flex flex-col gap-6">
          {costCenters.map((center) => (
            <CostCenterCard key={center.id} center={center} />
          ))}
        </div>
      </div>
    </motion.div>
  );
}

function Metric({ label, value, tone = "normal" }: { label: string; value: number; tone?: "normal" | "warning" }) {
  return (
    <div className="text-right">
      <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider">{label}</p>
      <p className="text-[15px] font-bold" style={{ color: tone === "warning" ? "#BF5700" : "#1a1a1a" }}>
        €{value.toLocaleString()}
      </p>
    </div>
  );
}

function ProjectFinancialSummary({
  budget,
  totalApproved,
  totalActual,
}: {
  budget: number;
  totalApproved: number;
  totalActual: number;
}) {
  const difference = budget - totalActual;
  const differenceLabel = difference >= 0 ? "Budget remaining" : "Over project value";
  const differenceValue = Math.abs(difference);

  return (
    <div data-testid="financial-scope-summary" className="border-2 border-black rounded-none">
      <div className="px-4 py-2.5 bg-black flex items-center justify-between">
        <p className="text-[9px] font-bold text-white uppercase tracking-[0.16em]">Real Project Financials</p>
        <p className="text-[8px] font-bold text-white/60 uppercase tracking-wider">Verified records only</p>
      </div>
      <div className="grid grid-cols-3 divide-x divide-border">
        <SummaryCell label="Total Project Value" value={budget} />
        <SummaryCell label="Recorded Costs" value={totalActual} />
        <SummaryCell
          label={differenceLabel}
          value={differenceValue}
          tone={difference < 0 ? "warning" : "normal"}
        />
      </div>
      {totalApproved !== totalActual && (
        <p className="px-4 py-2 border-t border-border text-[9px] text-muted-foreground">
          Approved cost records: €{totalApproved.toLocaleString()}
        </p>
      )}
    </div>
  );
}

function SummaryCell({
  label,
  value,
  tone = "normal",
}: {
  label: string;
  value: number;
  tone?: "normal" | "warning";
}) {
  return (
    <div className="px-4 py-4">
      <p className="text-[8px] font-bold text-muted-foreground uppercase tracking-[0.14em]">{label}</p>
      <p
        className="text-[22px] font-bold tracking-tight mt-1.5 tabular-nums"
        style={{ color: tone === "warning" ? "#BF5700" : "#1a1a1a" }}
      >
        €{value.toLocaleString()}
      </p>
    </div>
  );
}

function CostCenterCard({ center }: { center: CostCenter }) {
  const totalApproved = center.items.reduce((sum, line) => sum + line.approved, 0);
  const totalActual = center.items.reduce((sum, line) => sum + line.actual, 0);

  return (
    <div className="border border-border">
      <div className="flex items-center justify-between px-4 py-3 bg-muted border-b border-border">
        <div className="flex items-center gap-2">
          <center.icon size={13} strokeWidth={2.5} className="text-foreground" />
          <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-foreground">{center.label}</p>
        </div>
        <p className="text-[10px] font-bold text-muted-foreground">
          €{totalActual.toLocaleString()} <span className="text-muted-foreground/60">/ €{totalApproved.toLocaleString()}</span>
        </p>
      </div>

      <div className="grid grid-cols-[1fr_130px_130px] px-4 py-2 border-b border-border bg-white">
        <p className="text-[8px] font-bold text-muted-foreground uppercase tracking-[0.14em]">Line Item</p>
        <p className="text-[8px] font-bold text-muted-foreground uppercase tracking-[0.14em] text-right">Approved</p>
        <p className="text-[8px] font-bold text-muted-foreground uppercase tracking-[0.14em] text-right">Actual</p>
      </div>

      {center.items.length === 0 ? (
        <p className="px-4 py-3 text-[10px] text-muted-foreground">No costs recorded.</p>
      ) : (
        center.items.map((line) => (
          <div
            key={line.id}
            data-testid={`cost-row-${line.id}`}
            className="grid grid-cols-[1fr_130px_130px] items-center px-4 py-3 border-b border-border last:border-b-0"
          >
            <div className="min-w-0 pr-2">
              <p className="text-[11px] font-medium text-foreground truncate">{line.label}</p>
              {line.detail && <p className="text-[9px] text-muted-foreground truncate">{line.detail}</p>}
            </div>
            <p className="text-[11px] text-muted-foreground text-right tabular-nums">€{line.approved.toLocaleString()}</p>
            <p className="text-[11px] font-bold text-right tabular-nums">€{line.actual.toLocaleString()}</p>
          </div>
        ))
      )}
    </div>
  );
}

// ── Empty sections ───────────────────────────────────────────

function EmptyFinanceTab({ title }: { title: string }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="absolute inset-0 overflow-y-auto"
    >
      <div className="px-8 py-6 border-b border-border">
        <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-[0.14em]">{title}</p>
        <p className="text-[11px] text-muted-foreground mt-1 max-w-2xl">
          Only verified financial records are shown in this workspace.
        </p>
      </div>
      <div className="flex items-center justify-center min-h-[320px] px-8">
        <div className="max-w-sm text-center">
          <CircleDollarSign size={28} className="mx-auto text-muted-foreground/40" strokeWidth={1.5} />
          <p className="text-[12px] font-bold uppercase tracking-wider text-muted-foreground mt-4">
            No verified records yet
          </p>
          <p className="text-[10px] text-muted-foreground mt-2 leading-relaxed">
            No figures, estimates, margins, or summaries have been entered for this section.
          </p>
        </div>
      </div>
    </motion.div>
  );
}