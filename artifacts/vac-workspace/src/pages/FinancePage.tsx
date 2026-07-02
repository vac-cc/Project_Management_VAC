import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Eye, Download, Check, AlertTriangle, X, FileText,
  Users, HardHat, Film, Stamp, ChevronRight,
} from "lucide-react";
import { PROJECTS, type Project } from "./ProjectsPage";

// ── Tabs ─────────────────────────────────────────────────────

type FinanceTab = "projects" | "fiscal" | "agency";

const FINANCE_TABS: { id: FinanceTab; label: string }[] = [
  { id: "projects", label: "Project Management" },
  { id: "fiscal", label: "Financial Management" },
  { id: "agency", label: "Agency Management" },
];

export default function FinancePage() {
  const [tab, setTab] = useState<FinanceTab>("projects");

  return (
    <div className="flex-1 h-full flex flex-col min-w-0 bg-white overflow-hidden">
      {/* ── Page header ── */}
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

      {/* ── Tab content ── */}
      <div className="flex-1 min-h-0 overflow-hidden relative">
        <AnimatePresence mode="wait">
          {tab === "projects" && <ProjectManagementTab key="projects" />}
          {tab === "fiscal" && <FiscalManagementTab key="fiscal" />}
          {tab === "agency" && <AgencyManagementTab key="agency" />}
        </AnimatePresence>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
// TAB 1 — PROJECT MANAGEMENT (Dynamic Operational Ledger)
// ══════════════════════════════════════════════════════════════

interface InvoiceRef {
  vendor: string;
  number: string;
  amount: number;
}

export interface CostLine {
  id: string;
  label: string;
  approved: number;
  actual: number;
  approvedSwitch: boolean;
  invoice: InvoiceRef | null;
}

export interface CostCenter {
  id: string;
  label: string;
  icon: React.ComponentType<{ size?: number; strokeWidth?: number; className?: string }>;
  items: CostLine[];
}

// Deterministic hash → stable pseudo-random 0..1, seeded by string
function seedFrom(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (h << 5) - h + str.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h % 1000) / 1000;
}

const CENTER_TEMPLATES: { id: string; label: string; icon: CostCenter["icon"]; items: string[] }[] = [
  { id: "hr", label: "Human Resources — Freelance Fees", icon: Users, items: ["Freelance Creative Director", "Freelance Copywriter", "Freelance Photographer", "Freelance Videographer"] },
  { id: "prod", label: "Production — Scenography, Logistics, Materials", icon: HardHat, items: ["Set Design & Scenography", "On-site Logistics", "Production Materials", "Equipment Rental"] },
  { id: "post", label: "Post-Production — Editing, Processing", icon: Film, items: ["Video Editing & Colour Grade", "Photo Retouching", "Motion Graphics"] },
  { id: "lic", label: "Licensing & Public Space Occupation", icon: Stamp, items: ["Municipal Filming License (CML)", "EMEL Parking Reservation", "Music Licensing (SPA)"] },
];

export function buildCostCenters(project: Project, forceOverrun: boolean): CostCenter[] {
  return CENTER_TEMPLATES.map((tpl) => {
    const itemCount = 2 + Math.round(seedFrom(project.id + tpl.id) * 2); // 2-3 items
    const items: CostLine[] = tpl.items.slice(0, itemCount).map((label, idx) => {
      const seed = seedFrom(project.id + tpl.id + label);
      const approved = Math.round((600 + seed * 3200) / 10) * 10;
      let variance = 0.7 + seedFrom(label + tpl.id + project.id + "v") * 0.55; // 0.70 - 1.25
      // Deliberately push one line item over budget on the flagship project for the compliance demo
      if (forceOverrun && tpl.id === "prod" && idx === 0) variance = 1.34;
      const actual = Math.round((approved * variance) / 10) * 10;
      const hasInvoice = seedFrom(label + "inv") > 0.35;
      return {
        id: `${project.id}-${tpl.id}-${idx}`,
        label,
        approved,
        actual,
        approvedSwitch: seedFrom(label + "sw") > 0.4,
        invoice: hasInvoice
          ? {
              vendor: label.split(" ").slice(-2).join(" "),
              number: `INV-${project.id}-${tpl.id.toUpperCase()}-${idx + 1}`,
              amount: actual,
            }
          : null,
      };
    });
    return { id: tpl.id, label: tpl.label, icon: tpl.icon, items };
  });
}

// Approved master agreement values, keyed by project id
export const MASTER_AGREEMENT: Record<string, number> = {
  "BPC-001": 42000,
};

function parseBudget(budget: string): number {
  return Number(budget.replace(/[^0-9]/g, "")) || 0;
}

export interface ProjectFinancials {
  grossRevenue: number;
  cogs: number;
  grossProfit: number;
  netProfit: number;
}

// Deterministic full-lifecycle financial snapshot for a single project — reuses the
// same cost-center generator, revenue derivation, and overhead allocation rate as
// Tab 1's ledger so every number in the agency-wide rollup (Tab 3) traces back to the
// same source of truth. Mirrors ProjectManagementTab's masterBudget formula exactly:
// projects without an explicit master agreement derive revenue from their own approved
// cost total (+8% margin), never from the unrelated display-only `budget` label.
export function computeProjectFinancials(project: Project): ProjectFinancials {
  const costCenters = buildCostCenters(project, project.id === "BPC-001");
  const totalApproved = costCenters.reduce((s, c) => s + c.items.reduce((s2, i) => s2 + i.approved, 0), 0);
  const cogs = costCenters.reduce((s, c) => s + c.items.reduce((s2, i) => s2 + i.actual, 0), 0);
  const grossRevenue = MASTER_AGREEMENT[project.id] ?? Math.round(totalApproved * 1.08);
  const grossProfit = grossRevenue - cogs;
  const netProfit = grossProfit - grossProfit * OVERHEAD_ALLOCATION_RATE;
  return { grossRevenue, cogs, grossProfit, netProfit };
}

function ProjectManagementTab() {
  const activeProjects = useMemo(() => PROJECTS.filter((p) => p.status === "active"), []);
  const [selectedId, setSelectedId] = useState(activeProjects[0]?.id ?? "");
  const selected = activeProjects.find((p) => p.id === selectedId) ?? activeProjects[0];

  const costCenters = useMemo(
    () => (selected ? buildCostCenters(selected, selected.id === "BPC-001") : []),
    [selected]
  );

  const [approvals, setApprovals] = useState<Record<string, boolean>>({});
  const isApproved = (line: CostLine) => approvals[line.id] ?? line.approvedSwitch;

  const [previewInvoice, setPreviewInvoice] = useState<{ invoice: InvoiceRef; project: Project; line: string } | null>(null);

  const totalApproved = costCenters.reduce((s, c) => s + c.items.reduce((s2, i) => s2 + i.approved, 0), 0);
  const totalActual = costCenters.reduce((s, c) => s + c.items.reduce((s2, i) => s2 + i.actual, 0), 0);
  const masterBudget = selected ? MASTER_AGREEMENT[selected.id] ?? Math.round(totalApproved * 1.08) : 0;
  const overMaster = totalActual > masterBudget;

  function downloadInvoice(invoice: InvoiceRef, project: Project, lineLabel: string) {
    const content = [
      "VĀC CONSCIOUS COMMUNICATION",
      "─────────────────────────────────────────",
      `INVOICE ${invoice.number}`,
      "",
      `Project:      ${project.client} — ${project.title}`,
      `Line Item:    ${lineLabel}`,
      `Vendor:       ${invoice.vendor}`,
      `Amount Due:   €${invoice.amount.toLocaleString()}`,
      `Status:       Pending Payment`,
      "",
      "─────────────────────────────────────────",
      "This document was generated by the VĀC Operating System.",
    ].join("\n");
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${invoice.number}.txt`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  if (!selected) return null;

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
          <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-[0.14em]">Active Projects — {activeProjects.length}</p>
        </div>
        {activeProjects.map((p) => {
          const active = p.id === selected.id;
          return (
            <button
              key={p.id}
              onClick={() => setSelectedId(p.id)}
              data-testid={`finance-project-${p.id}`}
              className={`text-left px-5 py-3.5 border-b border-border transition-colors flex items-center justify-between gap-2 ${
                active ? "bg-muted" : "hover:bg-muted/50"
              }`}
              style={active ? { borderLeft: `3px solid ${p.clientAccent}` } : { borderLeft: "3px solid transparent" }}
            >
              <div className="min-w-0">
                <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider truncate">{p.client}</p>
                <p className="text-[12px] font-bold text-foreground tracking-tight truncate mt-0.5">{p.title}</p>
                <p className="text-[10px] text-muted-foreground mt-1">{p.budget} budget</p>
              </div>
              <ChevronRight size={13} className={active ? "text-foreground shrink-0" : "text-muted-foreground shrink-0"} />
            </button>
          );
        })}
      </div>

      {/* ── Budget breakdown engine ── */}
      <div className="flex-1 min-w-0 overflow-y-auto">
        {/* Report header */}
        <div className="px-8 py-5 border-b border-border flex items-center justify-between sticky top-0 bg-white z-10">
          <div>
            <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-[0.14em]">Project Budget Breakdown</p>
            <p className="text-[16px] font-bold text-foreground tracking-tight mt-0.5">{selected.client} — {selected.title}</p>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-right">
              <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider">Master Agreement</p>
              <p className="text-[15px] font-bold text-foreground">€{masterBudget.toLocaleString()}</p>
            </div>
            <div className="text-right">
              <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider">Total Actual</p>
              <p className="text-[15px] font-bold" style={{ color: overMaster ? "#BF5700" : "#1a1a1a" }}>€{totalActual.toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* Master agreement alert */}
        {overMaster && (
          <div className="mx-8 mt-5 border-2 border-primary bg-primary/10 px-4 py-3 flex items-center gap-3">
            <AlertTriangle size={16} className="text-primary shrink-0" strokeWidth={2.5} />
            <p className="text-[11px] font-bold uppercase tracking-wide text-primary">
              Actual costs (€{totalActual.toLocaleString()}) exceed the agreed master client budget (€{masterBudget.toLocaleString()}) by €{(totalActual - masterBudget).toLocaleString()}
            </p>
          </div>
        )}

        {/* Total Project Financial Scope — executive dashboard header */}
        <div className="px-8 pt-6">
          <FinancialScopeSummary masterBudget={masterBudget} totalOperationalCosts={totalActual} />
        </div>

        {/* Cost centers */}
        <div className="px-8 py-6 flex flex-col gap-8">
          {costCenters.map((center) => {
            const centerApproved = center.items.reduce((s, i) => s + i.approved, 0);
            const centerActual = center.items.reduce((s, i) => s + i.actual, 0);
            return (
              <div key={center.id} className="border border-border">
                {/* Center header */}
                <div className="flex items-center justify-between px-4 py-3 bg-muted border-b border-border">
                  <div className="flex items-center gap-2">
                    <center.icon size={13} strokeWidth={2.5} className="text-foreground" />
                    <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-foreground">{center.label}</p>
                  </div>
                  <p className="text-[10px] font-bold text-muted-foreground">
                    €{centerActual.toLocaleString()} <span className="text-muted-foreground/60">/ €{centerApproved.toLocaleString()}</span>
                  </p>
                </div>

                {/* Grid header */}
                <div className="grid grid-cols-[1fr_110px_110px_100px_170px] px-4 py-2 border-b border-border bg-white">
                  <p className="text-[8px] font-bold text-muted-foreground uppercase tracking-[0.14em]">Line Item</p>
                  <p className="text-[8px] font-bold text-muted-foreground uppercase tracking-[0.14em] text-right">Approved</p>
                  <p className="text-[8px] font-bold text-muted-foreground uppercase tracking-[0.14em] text-right">Actual</p>
                  <p className="text-[8px] font-bold text-muted-foreground uppercase tracking-[0.14em] text-center">Approval</p>
                  <p className="text-[8px] font-bold text-muted-foreground uppercase tracking-[0.14em] text-right">Invoice</p>
                </div>

                {/* Rows */}
                {center.items.map((line) => {
                  const over = line.actual > line.approved;
                  const approved = isApproved(line);
                  return (
                    <div
                      key={line.id}
                      data-testid={`cost-row-${line.id}`}
                      className="grid grid-cols-[1fr_110px_110px_100px_170px] items-center px-4 py-3 border-b border-border last:border-b-0"
                    >
                      <p className="text-[11px] font-medium text-foreground truncate pr-2">{line.label}</p>
                      <p className="text-[11px] text-muted-foreground text-right tabular-nums">€{line.approved.toLocaleString()}</p>
                      <p
                        className="text-[11px] font-bold text-right tabular-nums flex items-center justify-end gap-1"
                        style={{ color: over ? "#BF5700" : "#1a1a1a" }}
                      >
                        {over && <AlertTriangle size={10} strokeWidth={2.5} />}
                        €{line.actual.toLocaleString()}
                      </p>

                      {/* Approval switch */}
                      <div className="flex justify-center">
                        <button
                          onClick={() => setApprovals((prev) => ({ ...prev, [line.id]: !approved }))}
                          data-testid={`switch-approve-${line.id}`}
                          title={approved ? "Cost Approved" : "Pending Approval"}
                          className={`w-9 h-4 border transition-colors relative shrink-0 ${
                            approved ? "bg-accent border-accent" : "bg-white border-border"
                          }`}
                        >
                          <span
                            className="absolute top-0.5 w-3 h-3 bg-white border border-black/20 transition-all"
                            style={{ left: approved ? "20px" : "2px" }}
                          />
                        </button>
                      </div>

                      {/* Invoice actions */}
                      <div className="flex items-center justify-end gap-3">
                        {line.invoice ? (
                          <>
                            <span className="text-[9px] font-bold text-primary border border-primary px-1.5 py-0.5 uppercase tracking-wider whitespace-nowrap">Pending</span>
                            <button
                              onClick={() => setPreviewInvoice({ invoice: line.invoice!, project: selected, line: line.label })}
                              data-testid={`button-preview-invoice-${line.id}`}
                              className="text-muted-foreground hover:text-foreground transition-colors"
                              title="Preview invoice"
                            >
                              <Eye size={13} strokeWidth={2.25} />
                            </button>
                            <button
                              onClick={() => downloadInvoice(line.invoice!, selected, line.label)}
                              data-testid={`button-download-invoice-${line.id}`}
                              className="text-muted-foreground hover:text-foreground transition-colors"
                              title="Download invoice"
                            >
                              <Download size={13} strokeWidth={2.25} />
                            </button>
                          </>
                        ) : (
                          <span className="text-[10px] text-muted-foreground/50">—</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Inline invoice preview panel ── */}
      <AnimatePresence>
        {previewInvoice && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/20 z-20"
              onClick={() => setPreviewInvoice(null)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.26, ease: [0.25, 0, 0, 1] }}
              className="absolute top-0 right-0 h-full w-[420px] bg-white border-l border-black/10 z-30 flex flex-col shadow-2xl overflow-hidden"
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-border shrink-0">
                <div className="flex items-center gap-2">
                  <FileText size={14} className="text-accent" strokeWidth={2.5} />
                  <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground">Invoice Preview</p>
                </div>
                <button onClick={() => setPreviewInvoice(null)} className="text-muted-foreground hover:text-foreground" data-testid="button-close-invoice-preview">
                  <X size={16} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6">
                <div className="border border-border p-6 font-mono text-[11px] leading-relaxed">
                  <p className="font-bold text-[13px] tracking-tight mb-1">VĀC CONSCIOUS COMMUNICATION</p>
                  <div className="h-px bg-border my-3" />
                  <p className="font-bold">INVOICE {previewInvoice.invoice.number}</p>
                  <div className="mt-4 flex flex-col gap-2">
                    <div className="flex justify-between"><span className="text-muted-foreground">Project</span><span className="text-right">{previewInvoice.project.client}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Line Item</span><span className="text-right">{previewInvoice.line}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Vendor</span><span className="text-right">{previewInvoice.invoice.vendor}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Status</span><span className="text-right text-primary font-bold uppercase">Pending Payment</span></div>
                  </div>
                  <div className="h-px bg-border my-4" />
                  <div className="flex justify-between items-baseline">
                    <span className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground">Amount Due</span>
                    <span className="text-[20px] font-bold">€{previewInvoice.invoice.amount.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div className="shrink-0 p-6 border-t border-border">
                <button
                  onClick={() => downloadInvoice(previewInvoice.invoice, previewInvoice.project, previewInvoice.line)}
                  data-testid="button-download-invoice-from-preview"
                  className="w-full flex items-center justify-center gap-2 py-3 bg-accent text-white text-[11px] font-bold uppercase tracking-wider hover:bg-foreground transition-colors"
                >
                  <Download size={13} strokeWidth={2.5} />Download Invoice
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ─── Total Project Financial Scope — executive audit ledger ─── */

// Combined independent-worker tax retention + corporate overhead allocation
// deducted from Gross Profit to reach true agency Net Profit.
export const OVERHEAD_ALLOCATION_RATE = 0.222;
const NET_MARGIN_HEALTHY_THRESHOLD = 20; // %

function FinancialScopeSummary({ masterBudget, totalOperationalCosts }: { masterBudget: number; totalOperationalCosts: number }) {
  const grossProfit = masterBudget - totalOperationalCosts;
  const grossMarginPct = masterBudget > 0 ? (grossProfit / masterBudget) * 100 : 0;
  const overheadAllocation = grossProfit * OVERHEAD_ALLOCATION_RATE;
  const netProfit = grossProfit - overheadAllocation;
  const netMarginPct = masterBudget > 0 ? (netProfit / masterBudget) * 100 : 0;
  const isHealthy = netMarginPct >= NET_MARGIN_HEALTHY_THRESHOLD;

  return (
    <div data-testid="financial-scope-summary" className="border-2 border-black rounded-none">
      <div className="px-4 py-2.5 bg-black flex items-center justify-between">
        <p className="text-[9px] font-bold text-white uppercase tracking-[0.16em]">Total Project Financial Scope</p>
        <p className="text-[8px] font-bold text-white/60 uppercase tracking-wider">Executive Summary</p>
      </div>

      <div className="grid grid-cols-4 divide-x divide-border">
        <ScopeCell
          label="Total Gross Revenue"
          sub="Valor Bruto Contratado (MSA)"
          value={masterBudget}
        />
        <ScopeCell
          label="Total Operational Costs"
          sub="COGS — all cost centers"
          value={totalOperationalCosts}
        />
        <ScopeCell
          label="Gross Profit"
          sub={`Agency Gross Margin ${grossMarginPct.toFixed(1)}%`}
          value={grossProfit}
          tone={grossMarginPct >= NET_MARGIN_HEALTHY_THRESHOLD ? "green" : "terracotta"}
        />
        <ScopeCell
          label="Net Profit"
          sub={`Agency Net Margin ${netMarginPct.toFixed(1)}%`}
          value={netProfit}
          tone={isHealthy ? "green" : "terracotta"}
          emphasize
          testId="scope-net-profit"
        />
      </div>

      {!isHealthy && (
        <div data-testid="scope-net-margin-alert" className="px-4 py-2.5 bg-primary/10 border-t border-primary flex items-center gap-2.5">
          <AlertTriangle size={13} className="text-primary shrink-0" strokeWidth={2.5} />
          <p className="text-[10px] font-bold uppercase tracking-wide text-primary">
            Net margin ({netMarginPct.toFixed(1)}%) is below the {NET_MARGIN_HEALTHY_THRESHOLD}% agency threshold — review overhead allocation or renegotiate scope
          </p>
        </div>
      )}

      <div className="px-4 py-2 border-t border-border bg-muted">
        <p className="text-[8px] text-muted-foreground leading-relaxed">
          Net Profit deducts a {(OVERHEAD_ALLOCATION_RATE * 100).toFixed(1)}% allocation for independent-worker tax retention &amp; corporate overhead from Gross Profit to reveal true liquid cash retained by the agency.
        </p>
      </div>
    </div>
  );
}

function ScopeCell({
  label,
  sub,
  value,
  tone,
  emphasize,
  testId,
}: {
  label: string;
  sub: string;
  value: number;
  tone?: "green" | "terracotta";
  emphasize?: boolean;
  testId?: string;
}) {
  const color = tone === "green" ? "#99CC33" : tone === "terracotta" ? "#BF5700" : "#1a1a1a";
  return (
    <div className={`px-4 py-4 ${emphasize ? "bg-black/[0.03]" : ""}`} data-testid={testId}>
      <p className="text-[8px] font-bold text-muted-foreground uppercase tracking-[0.14em]">{label}</p>
      <p
        className={`font-bold tracking-tight mt-1.5 tabular-nums ${emphasize ? "text-[22px]" : "text-[18px]"}`}
        style={{ color }}
      >
        {value < 0 ? "-€" : "€"}{Math.abs(value).toLocaleString(undefined, { maximumFractionDigits: 0 })}
      </p>
      <p className="text-[9px] font-bold uppercase tracking-wide mt-1" style={{ color: tone ? color : "#6b6b6b" }}>{sub}</p>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
// TAB 2 — FINANCIAL MANAGEMENT (Portuguese Independent Tax Engine)
// ══════════════════════════════════════════════════════════════

function computeIRS(taxableIncome: number): number {
  // Simplified 2024/2025 IRS progressive brackets (mainland Portugal)
  const brackets: [number, number][] = [
    [7703, 0.13],
    [11623, 0.165],
    [16472, 0.22],
    [21321, 0.25],
    [27146, 0.32],
    [39791, 0.355],
    [51997, 0.435],
    [81199, 0.45],
    [Infinity, 0.48],
  ];
  let tax = 0;
  let lower = 0;
  for (const [upper, rate] of brackets) {
    if (taxableIncome <= lower) break;
    const slice = Math.min(taxableIncome, upper) - lower;
    tax += slice * rate;
    lower = upper;
    if (taxableIncome <= upper) break;
  }
  return tax;
}

function FiscalManagementTab() {
  const [quarterlyRevenue, setQuarterlyRevenue] = useState(45850);
  const [deductibleExpenses, setDeductibleExpenses] = useState(8200);
  const [retentionRegime, setRetentionRegime] = useState<"standard25" | "exempt101B">("standard25");

  const ivaRate = 0.23;
  const ivaLiquidado = quarterlyRevenue * ivaRate;
  const ivaDedutivel = deductibleExpenses * ivaRate;
  const ivaNetDue = ivaLiquidado - ivaDedutivel;

  const ssRelevantIncome = quarterlyRevenue * 0.70;
  const ssMonthlyBase = ssRelevantIncome / 3;
  const ssMonthlyContribution = ssMonthlyBase * 0.214;

  const annualRevenue = quarterlyRevenue * 4;
  const coefficient = 0.75;
  const taxableIncome = annualRevenue * coefficient;
  const irsDue = computeIRS(taxableIncome);
  const retentionWithheld = retentionRegime === "standard25" ? annualRevenue * 0.25 : 0;
  const irsBalance = irsDue - retentionWithheld;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="absolute inset-0 overflow-y-auto"
    >
      <div className="px-8 py-6 border-b border-border">
        <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-[0.14em]">Trabalhador Independente — Fiscal Simulation Engine</p>
        <p className="text-[11px] text-muted-foreground mt-1 max-w-2xl">
          Estimates only, based on the simplified regime. Figures update live from the invoicing inputs below — confirm all filings with your accountant (contabilista certificado).
        </p>
      </div>

      {/* Shared inputs */}
      <div className="px-8 py-5 border-b border-border grid grid-cols-2 gap-6 max-w-2xl">
        <FiscalInput
          label="Quarterly Invoicing (Revenue)"
          value={quarterlyRevenue}
          onChange={setQuarterlyRevenue}
          testId="input-quarterly-revenue"
        />
        <FiscalInput
          label="Deductible Business Expenses (Quarter)"
          value={deductibleExpenses}
          onChange={setDeductibleExpenses}
          testId="input-deductible-expenses"
        />
      </div>

      {/* Three data blocks */}
      <div className="grid grid-cols-3 divide-x divide-border">
        {/* IVA */}
        <div className="flex flex-col">
          <div className="h-1.5 bg-foreground" />
          <div className="px-6 py-5 flex flex-col gap-4">
            <div>
              <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-[0.14em]">IVA — Imposto sobre o Valor Acrescentado</p>
              <p className="text-[10px] text-muted-foreground mt-1">Standard rate 23% · Declaração Trimestral</p>
            </div>

            <FiscalRow label="IVA Liquidado" sub="Collected from clients" value={ivaLiquidado} />
            <FiscalRow label="IVA Dedutível" sub="Paid on business expenses" value={ivaDedutivel} negative />

            <div className="h-px bg-border" />

            <div>
              <p className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground">Net Balance Due to AT</p>
              <p className="text-[24px] font-bold tracking-tight mt-1" style={{ color: ivaNetDue >= 0 ? "#1a1a1a" : "#99CC33" }}>
                {ivaNetDue >= 0 ? "€" : "-€"}{Math.abs(ivaNetDue).toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </p>
              <p className="text-[10px] text-muted-foreground mt-1">{ivaNetDue >= 0 ? "Payable" : "Refundable credit"}</p>
            </div>

            <div className="mt-auto border border-border px-3 py-2.5">
              <p className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground">Declaration Deadline</p>
              <p className="text-[12px] font-bold text-foreground mt-0.5">20 August 2026 · Q2 2026</p>
            </div>
          </div>
        </div>

        {/* Segurança Social */}
        <div className="flex flex-col">
          <div className="h-1.5 bg-accent" />
          <div className="px-6 py-5 flex flex-col gap-4">
            <div>
              <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-[0.14em]">Segurança Social — Regime Simplificado</p>
              <p className="text-[10px] text-muted-foreground mt-1">70% relevant income · 21.4% contribution rate</p>
            </div>

            <FiscalRow label="Rendimento Relevante (Trimestral)" sub="70% of quarterly invoicing" value={ssRelevantIncome} />
            <FiscalRow label="Base Mensal de Incidência" sub="Relevant income ÷ 3" value={ssMonthlyBase} />

            <div className="h-px bg-border" />

            <div>
              <p className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground">Estimated Monthly Payment</p>
              <p className="text-[24px] font-bold tracking-tight mt-1 text-foreground">
                €{ssMonthlyContribution.toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </p>
              <p className="text-[10px] text-muted-foreground mt-1">Applies to Aug · Sep · Oct 2026</p>
            </div>

            <div className="mt-auto border border-border px-3 py-2.5">
              <p className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground">Quarterly Declaration Window</p>
              <p className="text-[12px] font-bold text-foreground mt-0.5">15 – 20 August 2026</p>
            </div>
          </div>
        </div>

        {/* IRS */}
        <div className="flex flex-col">
          <div className="h-1.5 bg-primary" />
          <div className="px-6 py-5 flex flex-col gap-4">
            <div>
              <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-[0.14em]">IRS — Rendimento de Pessoas Singulares</p>
              <p className="text-[10px] text-muted-foreground mt-1">Coeficiente 0.75 · Regime Simplificado</p>
            </div>

            {/* Retention toggle */}
            <div>
              <p className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground mb-1.5">Retenção na Fonte</p>
              <div className="flex flex-col gap-1.5">
                <RetentionOption
                  active={retentionRegime === "standard25"}
                  onClick={() => setRetentionRegime("standard25")}
                  label="Standard — 25%"
                  testId="retention-standard"
                />
                <RetentionOption
                  active={retentionRegime === "exempt101B"}
                  onClick={() => setRetentionRegime("exempt101B")}
                  label="Exempt — Art. 101º-B, nº1, al. a) CIRS"
                  testId="retention-exempt"
                />
              </div>
            </div>

            <div className="h-px bg-border" />

            <FiscalRow label="Rendimento Coletável (Anual)" sub={`€${annualRevenue.toLocaleString()} × 0.75`} value={taxableIncome} />
            <FiscalRow label="Retenção Retida (YTD est.)" sub={retentionRegime === "standard25" ? "25% withheld per invoice" : "No withholding applied"} value={retentionWithheld} negative />

            <div>
              <p className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground">Est. Balance at Annual Filing</p>
              <p className="text-[24px] font-bold tracking-tight mt-1" style={{ color: irsBalance >= 0 ? "#BF5700" : "#99CC33" }}>
                {irsBalance >= 0 ? "€" : "-€"}{Math.abs(irsBalance).toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </p>
              <p className="text-[10px] text-muted-foreground mt-1">{irsBalance >= 0 ? "Additional tax owed" : "Refund expected"}</p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function FiscalInput({ label, value, onChange, testId }: { label: string; value: number; onChange: (v: number) => void; testId: string }) {
  return (
    <div>
      <label className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground block mb-1.5">{label}</label>
      <div className="flex items-center border border-border focus-within:border-foreground transition-colors">
        <span className="pl-3 text-[12px] text-muted-foreground font-bold">€</span>
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
          data-testid={testId}
          className="w-full px-2 py-2 text-[13px] font-bold text-foreground outline-none bg-transparent"
        />
      </div>
    </div>
  );
}

function FiscalRow({ label, sub, value, negative }: { label: string; sub: string; value: number; negative?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div className="min-w-0">
        <p className="text-[11px] font-bold text-foreground truncate">{label}</p>
        <p className="text-[9px] text-muted-foreground truncate">{sub}</p>
      </div>
      <p className="text-[13px] font-bold text-foreground whitespace-nowrap tabular-nums">
        {negative ? "−" : ""}€{value.toLocaleString(undefined, { maximumFractionDigits: 0 })}
      </p>
    </div>
  );
}

function RetentionOption({ active, onClick, label, testId }: { active: boolean; onClick: () => void; label: string; testId: string }) {
  return (
    <button
      onClick={onClick}
      data-testid={testId}
      className={`flex items-center gap-2 px-2.5 py-2 border text-left transition-colors ${
        active ? "border-foreground bg-muted" : "border-border hover:border-foreground/40"
      }`}
    >
      <span className={`w-3.5 h-3.5 border shrink-0 flex items-center justify-center ${active ? "bg-foreground border-foreground" : "border-border"}`}>
        {active && <Check size={9} className="text-white" strokeWidth={3} />}
      </span>
      <span className="text-[10px] font-bold text-foreground leading-tight">{label}</span>
    </button>
  );
}

// ══════════════════════════════════════════════════════════════
// TAB 3 — AGENCY MANAGEMENT (C-Suite Executive Dashboard)
// ══════════════════════════════════════════════════════════════

export const RUNWAY_SAFE_THRESHOLD_MONTHS = 3;

// Default fixed monthly burn — mirrors AgencyManagementTab's initial burn-input
// state (software + co-working + accounting + Segurança Social baseline) so the
// Dashboard's runway snapshot always agrees with Tab 3 on first load.
export const DEFAULT_MONTHLY_BURN = 180 + 220 + 90 + 220;

export interface AgencyGlobals {
  grossRevenue: number;
  cogs: number;
  grossProfit: number;
  netProfit: number;
  activeCount: number;
  pastCount: number;
}

// Same aggregation AgencyManagementTab uses for its top-row KPIs — kept here as
// a standalone export so other pages (e.g. the Dashboard) can read the agency-wide
// rollup without duplicating the per-project financial derivation.
export function computeAgencyGlobals(): AgencyGlobals {
  let grossRevenue = 0;
  let cogs = 0;
  let netProfit = 0;
  for (const p of PROJECTS) {
    const f = computeProjectFinancials(p);
    grossRevenue += f.grossRevenue;
    cogs += f.cogs;
    netProfit += f.netProfit;
  }
  return {
    grossRevenue,
    cogs,
    netProfit,
    grossProfit: grossRevenue - cogs,
    activeCount: PROJECTS.filter((p) => p.status === "active").length,
    pastCount: PROJECTS.filter((p) => p.status === "past").length,
  };
}

export interface TaxDeadline {
  id: string;
  label: string;
  sub: string;
  date: Date;
}

// Mirrors the two Portuguese fiscal deadlines shown in Tab 2 (Financial Management).
export const TAX_DEADLINES: TaxDeadline[] = [
  { id: "iva", label: "IVA Declaration", sub: "Q2 2026 · Declaração Trimestral", date: new Date(2026, 7, 20) },
  { id: "ss", label: "Segurança Social", sub: "Quarterly Declaration Window Opens", date: new Date(2026, 7, 15) },
];

function AgencyManagementTab() {
  const globals = useMemo(() => {
    let grossRevenue = 0;
    let cogs = 0;
    let netProfit = 0;
    for (const p of PROJECTS) {
      const f = computeProjectFinancials(p);
      grossRevenue += f.grossRevenue;
      cogs += f.cogs;
      netProfit += f.netProfit;
    }
    return {
      grossRevenue,
      cogs,
      netProfit,
      grossProfit: grossRevenue - cogs,
      activeCount: PROJECTS.filter((p) => p.status === "active").length,
      pastCount: PROJECTS.filter((p) => p.status === "past").length,
    };
  }, []);

  // ── Burn rate tracker (editable fixed monthly costs of the solo entrepreneurship) ──
  const [softwareLicenses, setSoftwareLicenses] = useState(180);
  const [coworkingSpace, setCoworkingSpace] = useState(220);
  const [accountingFees, setAccountingFees] = useState(90);
  const [ssBaseline, setSsBaseline] = useState(220);
  const monthlyBurn = softwareLicenses + coworkingSpace + accountingFees + ssBaseline;

  const runwayMonths = monthlyBurn > 0 ? globals.netProfit / monthlyBurn : Infinity;
  const runwayHealthy = runwayMonths >= RUNWAY_SAFE_THRESHOLD_MONTHS;

  // ── Initial investment payback ──
  const [initialInvestment, setInitialInvestment] = useState(15000);
  const paybackPct = initialInvestment > 0 ? Math.min(100, Math.max(0, (globals.netProfit / initialInvestment) * 100)) : 0;
  const paybackComplete = paybackPct >= 100;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="absolute inset-0 overflow-y-auto"
    >
      <div className="px-8 py-6 border-b border-border">
        <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-[0.14em]">Global Agency Financial Command Center</p>
        <p className="text-[11px] text-muted-foreground mt-1 max-w-2xl">
          Aggregates every active and past project into a single C-suite view of the agency's liquidity, growth runway, and capital recovery.
        </p>
      </div>

      {/* ── Macro Revenue Consolidation Grid (Master Ledger) ── */}
      <div className="px-8 pt-6">
        <div data-testid="macro-revenue-grid" className="border-2 border-black rounded-none">
          <div className="px-4 py-2.5 bg-black flex items-center justify-between">
            <p className="text-[9px] font-bold text-white uppercase tracking-[0.16em]">Macro Revenue Consolidation — Master Ledger</p>
            <p className="text-[8px] font-bold text-white/60 uppercase tracking-wider">
              {globals.activeCount} Active · {globals.pastCount} Past · {globals.activeCount + globals.pastCount} Total Projects
            </p>
          </div>
          <div className="grid grid-cols-3 divide-x divide-border">
            <ScopeCell
              label="Global Gross Revenue"
              sub="All projects, agency lifetime"
              value={globals.grossRevenue}
              testId="global-gross-revenue"
            />
            <ScopeCell
              label="Global Operational Costs"
              sub="Combined HR, Production &amp; Licensing COGS"
              value={globals.cogs}
              testId="global-cogs"
            />
            <ScopeCell
              label="Global Net Liquid Cash"
              sub={`Post-tax, ${(OVERHEAD_ALLOCATION_RATE * 100).toFixed(1)}% overhead allocated`}
              value={globals.netProfit}
              tone={globals.netProfit >= 0 ? "green" : "terracotta"}
              emphasize
              testId="global-net-liquid-cash"
            />
          </div>
        </div>
      </div>

      {/* ── Agency Lifeline & Capital Efficiency ── */}
      <div className="px-8 py-6">
        <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-[0.14em] mb-3">Agency Lifeline &amp; Capital Efficiency</p>

        <div className="border border-black rounded-none grid grid-cols-3 divide-x divide-black">
          {/* Burn Rate Tracker */}
          <div className="px-5 py-5 flex flex-col gap-4">
            <div>
              <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-[0.14em]">Agency Burn Rate Tracker</p>
              <p className="text-[9px] text-muted-foreground mt-1">Fixed monthly cost of running the solo entrepreneurship</p>
            </div>

            <div className="flex flex-col gap-2.5">
              <BurnInput label="Software Licenses" value={softwareLicenses} onChange={setSoftwareLicenses} testId="input-burn-software" />
              <BurnInput label="Co-working Space" value={coworkingSpace} onChange={setCoworkingSpace} testId="input-burn-coworking" />
              <BurnInput label="Accounting Fees" value={accountingFees} onChange={setAccountingFees} testId="input-burn-accounting" />
              <BurnInput label="Segurança Social Baseline" value={ssBaseline} onChange={setSsBaseline} testId="input-burn-ss" />
            </div>

            <div className="h-px bg-border mt-1" />

            <div>
              <p className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground">Total Monthly Burn</p>
              <p className="text-[20px] font-bold text-foreground tracking-tight mt-1 tabular-nums" data-testid="total-monthly-burn">
                €{monthlyBurn.toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </p>
            </div>
          </div>

          {/* Liquidity Runway */}
          <div className="px-5 py-5 flex flex-col gap-4">
            <div>
              <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-[0.14em]">Liquidity Runway</p>
              <p className="text-[9px] text-muted-foreground mt-1">Global Net Liquid Cash ÷ Monthly Burn Rate</p>
            </div>

            <div className="flex-1 flex flex-col items-start justify-center py-2">
              <p
                className="font-bold tracking-tight tabular-nums text-[40px] leading-none"
                style={{ color: runwayHealthy ? "#99CC33" : "#BF5700" }}
                data-testid="liquidity-runway-months"
              >
                {Number.isFinite(runwayMonths) ? runwayMonths.toFixed(1) : "∞"}
              </p>
              <p className="text-[10px] font-bold uppercase tracking-wide mt-1" style={{ color: runwayHealthy ? "#99CC33" : "#BF5700" }}>
                Months of Runway
              </p>
            </div>

            {!runwayHealthy && (
              <div data-testid="runway-alert" className="px-3 py-2.5 bg-primary/10 border border-primary flex items-start gap-2">
                <AlertTriangle size={13} className="text-primary shrink-0 mt-0.5" strokeWidth={2.5} />
                <p className="text-[9px] font-bold uppercase tracking-wide text-primary leading-snug">
                  Runway is below the {RUNWAY_SAFE_THRESHOLD_MONTHS}-month safety threshold — reduce burn or accelerate collections
                </p>
              </div>
            )}
          </div>

          {/* Initial Investment Payback Progress */}
          <div className="px-5 py-5 flex flex-col gap-4">
            <div>
              <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-[0.14em]">Initial Investment Payback</p>
              <p className="text-[9px] text-muted-foreground mt-1">Net Profit accumulated vs. launch capital</p>
            </div>

            <div className="max-w-[220px]">
              <BurnInput label="Initial Investment Capital" value={initialInvestment} onChange={setInitialInvestment} testId="input-initial-investment" />
            </div>

            <div>
              <div className="flex items-baseline justify-between mb-1.5">
                <p
                  className="font-bold tracking-tight tabular-nums text-[22px]"
                  style={{ color: paybackComplete ? "#99CC33" : "#1a1a1a" }}
                  data-testid="payback-percentage"
                >
                  {paybackPct.toFixed(1)}%
                </p>
                <p className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground">Recovered</p>
              </div>
              <div className="h-3 border border-black w-full" data-testid="payback-progress-bar">
                <div
                  className="h-full transition-all duration-300"
                  style={{ width: `${paybackPct}%`, backgroundColor: paybackComplete ? "#99CC33" : "#BF5700" }}
                />
              </div>
              <p className="text-[9px] text-muted-foreground mt-1.5">
                €{Math.max(0, globals.netProfit).toLocaleString(undefined, { maximumFractionDigits: 0 })} of €{initialInvestment.toLocaleString()} recovered
                {paybackComplete && <span className="font-bold" style={{ color: "#99CC33" }}> — fully paid back</span>}
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function BurnInput({ label, value, onChange, testId }: { label: string; value: number; onChange: (v: number) => void; testId: string }) {
  return (
    <div>
      <label className="text-[8px] font-bold uppercase tracking-wider text-muted-foreground block mb-1">{label}</label>
      <div className="flex items-center border border-border focus-within:border-foreground transition-colors">
        <span className="pl-2.5 text-[11px] text-muted-foreground font-bold">€</span>
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
          data-testid={testId}
          className="w-full px-2 py-1.5 text-[12px] font-bold text-foreground outline-none bg-transparent"
        />
      </div>
    </div>
  );
}
