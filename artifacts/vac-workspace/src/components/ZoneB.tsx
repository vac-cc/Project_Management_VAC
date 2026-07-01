import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MousePointer2, Square, Type, Image as ImageIcon,
  ZoomIn, ZoomOut, X, Trash2, FileText, Plus, Upload,
  Video, ExternalLink
} from "lucide-react";

type Tab = "finance" | "timeline" | "canvas";

const tabs: { id: Tab; label: string }[] = [
  { id: "finance",  label: "Financial Ledger"    },
  { id: "timeline", label: "Production Timeline" },
  { id: "canvas",   label: "Creative Canvas"     },
];

interface PendingCost {
  id: number;
  category: string;
  description: string;
  value: number;
  paymentTerms: string;
}

interface ZoneBProps {
  onCostSubmitted: () => void;
}

export default function ZoneB({ onCostSubmitted }: ZoneBProps) {
  const [activeTab, setActiveTab] = useState<Tab>("finance");
  const [overrun, setOverrun] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [pendingCosts, setPendingCosts] = useState<PendingCost[]>([]);

  function handleCostSubmitted(cost: PendingCost) {
    setPendingCosts((prev) => [...prev, cost]);
    setDrawerOpen(false);
    onCostSubmitted();
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className="flex-1 h-full flex flex-col min-w-0 bg-white relative overflow-hidden"
    >
      {/* Tab Bar */}
      <div className="border-b border-border flex items-end px-7 pt-6 shrink-0">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => { setActiveTab(tab.id); setDrawerOpen(false); }}
              data-testid={`tab-${tab.id}`}
              className={`flex items-center gap-1.5 px-4 py-2.5 text-[11px] font-bold uppercase tracking-[0.12em] border-b-2 -mb-px transition-all duration-150 ${
                isActive
                  ? "text-foreground border-b-accent"
                  : "text-muted-foreground border-b-transparent hover:text-foreground"
              }`}
            >
              {isActive && <span className="text-accent font-bold text-sm leading-none">/</span>}
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="flex-1 min-h-0 overflow-hidden relative">
        <AnimatePresence mode="wait">
          {activeTab === "finance" && (
            <FinancePanel
              key="finance"
              overrun={overrun}
              setOverrun={setOverrun}
              drawerOpen={drawerOpen}
              setDrawerOpen={setDrawerOpen}
              pendingCosts={pendingCosts}
              onCostSubmitted={handleCostSubmitted}
            />
          )}
          {activeTab === "timeline" && <TimelinePanel key="timeline" />}
          {activeTab === "canvas"   && <CanvasPanel   key="canvas"   />}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

/* ─── Finance Panel ─────────────────────────────────────── */
interface FinancePanelProps {
  overrun: boolean;
  setOverrun: (v: boolean) => void;
  drawerOpen: boolean;
  setDrawerOpen: (v: boolean) => void;
  pendingCosts: PendingCost[];
  onCostSubmitted: (cost: PendingCost) => void;
}

function FinancePanel({ overrun, setOverrun, drawerOpen, setDrawerOpen, pendingCosts, onCostSubmitted }: FinancePanelProps) {
  const nextId = useRef(Date.now());

  const fixedExpenses = [
    { label: "Production Crew",     allocated: 18000, spent: 14200, pct: 79 },
    { label: "Venue & Logistics",   allocated: 12000, spent: 10800, pct: 90 },
    { label: "Creative & Design",   allocated: 8000,  spent: 4900,  pct: 61 },
    { label: "Contingency Reserve", allocated: 7000,  spent: 1600,  pct: 23 },
  ];

  return (
    <div className="absolute inset-0 flex overflow-hidden">

      {/* ── Main Ledger (always visible) ── */}
      <div className="flex-1 flex flex-col overflow-y-auto min-w-0">

        {/* Report header */}
        <div className="flex items-center justify-between px-7 border-b border-border shrink-0 h-[72px]">
          <div className="flex items-center gap-2">
            <span className="text-accent font-bold text-sm leading-none">/</span>
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.14em]">Project Financial Report</p>
          </div>
          <button
            onClick={() => setOverrun(!overrun)}
            data-testid="button-toggle-overrun"
            className={`px-4 py-2 text-[10px] font-bold uppercase tracking-wider border transition-all duration-150 ${
              overrun
                ? "bg-primary text-white border-primary"
                : "bg-white text-foreground border-border hover:border-foreground"
            }`}
          >
            {overrun ? "Reset State" : "Simulate Overrun"}
          </button>
        </div>

        {/* Budget Matrix */}
        <div className="border-b border-border shrink-0">
          <div className="grid grid-cols-4 border-b border-border bg-muted">
            <ColHeader>Total Client Approved Budget</ColHeader>
            <ColHeader border>Total Estimated Costs</ColHeader>
            <ColHeader border>Realized Costs</ColHeader>
            <ColHeader border>Profit Margin Tracker</ColHeader>
          </div>

          <AnimatePresence mode="wait">
            {overrun ? (
              <motion.div key="overrun" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="bg-primary flex items-center justify-center py-9 px-8">
                <div className="text-center">
                  <p className="text-base font-bold uppercase tracking-widest text-white">Critical: Budget Ceiling Exceeded</p>
                  <p className="text-white/80 text-xs mt-2 tracking-wide">€47,200 realized vs €45,000 approved</p>
                </div>
              </motion.div>
            ) : (
              <motion.div key="normal" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="grid grid-cols-4">
                <DataCell><BigNum>€45,000</BigNum><SubLabel>Approved</SubLabel></DataCell>
                <DataCell border><BigNum muted>€38,200</BigNum><SubLabel>Estimated</SubLabel></DataCell>
                <DataCell border><BigNum>€31,500</BigNum><SubLabel>Realized</SubLabel></DataCell>
                <DataCell border>
                  <div className="flex items-baseline gap-1"><BigNum green>30%</BigNum></div>
                  <div className="w-full h-0.5 bg-border mt-3 mb-1">
                    <div className="h-full bg-accent" style={{ width: "30%" }} />
                  </div>
                  <SubLabel>Healthy margin</SubLabel>
                </DataCell>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Secondary metrics */}
        <div className="grid grid-cols-3 divide-x divide-border border-b border-border shrink-0">
          <MetricCell label="Budget Utilization" value="70%"     sub="€31,500 of €45,000"       accent />
          <MetricCell label="Cost Variance"       value="+€6,700" sub="Estimated vs Realized"            />
          <MetricCell label="Invoiced to Date"    value="€28,000" sub="62% of approved budget"          />
        </div>

        {/* Budget Breakdown */}
        <div className="flex flex-col shrink-0">

          {/* Budget Breakdown label */}
          <div className="px-7 border-b border-border flex items-center gap-2 bg-white h-[72px] shrink-0">
            <span className="text-accent font-bold text-sm leading-none">/</span>
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.14em]">Budget Breakdown</span>
          </div>

          {/* Column headers — "+ Add Cost" embedded in Line Item cell */}
          <div className="grid grid-cols-[1fr_auto_auto_160px] px-7 py-3 border-b border-border bg-muted items-center">
            <div className="flex items-center gap-3">
              <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-[0.14em]">Line Item</p>
              <button
                onClick={() => setDrawerOpen(true)}
                data-testid="button-add-cost"
                className="flex items-center gap-1 px-2 py-0.5 bg-accent text-white text-[9px] font-bold uppercase tracking-wider hover:bg-foreground transition-colors"
              >
                <Plus size={8} />
                Add Cost
              </button>
            </div>
            <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-[0.14em] w-24 text-right">Spent</p>
            <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-[0.14em] w-24 text-right mr-4">Allocated</p>
            <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-[0.14em]">Utilization</p>
          </div>

          {fixedExpenses.map((row) => (
            <ExpenseRow key={row.label} {...row} />
          ))}

          {/* Pending cost rows injected on submit */}
          <AnimatePresence>
            {pendingCosts.map((cost) => (
              <motion.div
                key={cost.id}
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
                className="grid grid-cols-[1fr_auto_auto_160px] items-center px-7 py-3.5 border-b border-border bg-accent/5"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xs font-medium text-foreground">{cost.category} — {cost.description.slice(0, 30)}{cost.description.length > 30 ? "…" : ""}</span>
                  <span className="text-[9px] font-bold text-primary border border-primary px-1.5 py-0.5 uppercase tracking-wider">Pending Approval</span>
                </div>
                <span className="text-xs text-foreground font-medium w-24 text-right">€{cost.value.toLocaleString()}</span>
                <span className="text-xs text-muted-foreground w-24 text-right mr-4">/ —</span>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-0.5 bg-border" />
                  <span className="text-[10px] font-bold text-muted-foreground w-7 text-right">—</span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* ── Slide-over Drawer ── */}
      <AnimatePresence>
        {drawerOpen && (
          <>
            {/* Subtle backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/10 z-10"
              onClick={() => setDrawerOpen(false)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.28, ease: [0.25, 0, 0, 1] }}
              className="absolute top-0 right-0 h-full w-[420px] bg-white border-l border-black/10 z-20 flex flex-col shadow-2xl overflow-hidden"
            >
              <CostForm
                onClose={() => setDrawerOpen(false)}
                onSubmit={(data) => {
                  onCostSubmitted({ ...data, id: nextId.current++ });
                }}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─── Cost Submission Form ─────────────────────────────── */
const CATEGORIES = ["Graphic Design", "Printing", "Web Design", "3D", "Motion", "Illustration", "Art Direction", "Licensing", "Insurance", "Legal", "Other"];
const PAYMENT_TERMS = ["Upfront", "30 days", "60 days", "90 days", "30% advance / 70% on delivery", "40% advance / 60% on delivery"];

interface CostFormData {
  category: string;
  value: number;
  paymentTerms: string;
  description: string;
  notes: string;
}

function CostForm({ onClose, onSubmit }: { onClose: () => void; onSubmit: (data: CostFormData) => void }) {
  const [category, setCategory]         = useState("");
  const [otherCategory, setOtherCategory] = useState("");
  const [costValue, setCostValue]       = useState("");
  const [paymentTerms, setPaymentTerms] = useState("");
  const [description, setDescription]   = useState("");
  const [notes, setNotes]               = useState("");
  const [fileAttached, setFileAttached] = useState(true);
  const [submitted, setSubmitted]       = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!category || !costValue) return;
    setSubmitted(true);
    setTimeout(() => {
      onSubmit({
        category: category === "Other" ? (otherCategory.trim() || "Other") : (category || "Uncategorised"),
        value: parseFloat(costValue) || 0,
        paymentTerms,
        description,
        notes,
      });
    }, 400);
  }

  const inputClass = "w-full border border-black/10 bg-white px-3.5 py-2.5 text-sm text-foreground focus:outline-none focus:border-foreground transition-colors placeholder:text-muted-foreground font-sans";
  const labelClass = "text-[9px] font-bold text-muted-foreground uppercase tracking-[0.14em] mb-1.5 block";

  return (
    <>
      {/* Drawer header */}
      <div className="flex items-center justify-between px-6 py-5 border-b border-black/10 shrink-0">
        <div>
          <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-[0.14em]">Financial Ledger</p>
          <h3 className="text-sm font-bold text-foreground tracking-tight mt-0.5">Submit Cost for Approval</h3>
        </div>
        <button
          onClick={onClose}
          data-testid="button-close-drawer"
          className="w-7 h-7 border border-black/10 flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-foreground transition-colors"
        >
          <X size={13} />
        </button>
      </div>

      {/* Form body */}
      <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto flex flex-col divide-y divide-black/5">

        {/* Category */}
        <div className="px-6 py-5">
          <label className={labelClass}>Type of Cost / Category *</label>
          <div className="relative">
            <select
              value={category}
              onChange={(e) => { setCategory(e.target.value); if (e.target.value !== "Other") setOtherCategory(""); }}
              required
              data-testid="select-cost-category"
              className={`${inputClass} appearance-none cursor-pointer pr-8`}
            >
              <option value="" disabled>Select category…</option>
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground">
              <svg width="10" height="6" viewBox="0 0 10 6" fill="none"><path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square"/></svg>
            </div>
          </div>

          {/* Conditional "Other" free-text field */}
          <AnimatePresence>
            {category === "Other" && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.18 }}
                className="overflow-hidden"
              >
                <div className="mt-3 border-l-2 border-accent pl-3">
                  <label className={`${labelClass} text-accent`}>Specify Cost Type *</label>
                  <input
                    type="text"
                    value={otherCategory}
                    onChange={(e) => setOtherCategory(e.target.value)}
                    placeholder="e.g. Drone Footage, Event Signage…"
                    required={category === "Other"}
                    data-testid="input-other-category"
                    className={inputClass}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Cost value + Payment terms row */}
        <div className="px-6 py-5 grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Cost Value (€) *</label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-muted-foreground">€</span>
              <input
                type="number"
                min="0"
                step="0.01"
                value={costValue}
                onChange={(e) => setCostValue(e.target.value)}
                placeholder="0.00"
                required
                data-testid="input-cost-value"
                className={`${inputClass} pl-7 font-bold text-base`}
              />
            </div>
          </div>
          <div>
            <label className={labelClass}>Payment Terms</label>
            <div className="relative">
              <select
                value={paymentTerms}
                onChange={(e) => setPaymentTerms(e.target.value)}
                data-testid="select-payment-terms"
                className={`${inputClass} appearance-none cursor-pointer pr-8 text-xs`}
              >
                <option value="">Select terms…</option>
                {PAYMENT_TERMS.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground">
                <svg width="10" height="6" viewBox="0 0 10 6" fill="none"><path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square"/></svg>
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="px-6 py-5">
          <label className={labelClass}>Service / Product Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe exactly what this cost covers, its operational purpose, and key deliverables so all team members immediately understand the scope…"
            rows={4}
            data-testid="textarea-description"
            className={`${inputClass} resize-none leading-relaxed`}
          />
        </div>

        {/* Quote Upload */}
        <div className="px-6 py-5">
          <label className={labelClass}>Quote / Orçamento PDF</label>
          {fileAttached ? (
            <div className="border border-black/10 px-4 py-3 flex items-center gap-3 bg-accent/5">
              <FileText size={14} className="text-accent shrink-0" />
              <span className="text-xs font-medium text-foreground flex-1 truncate">orçamento_cenografia_v1.pdf</span>
              <span className="text-[9px] text-accent font-bold uppercase tracking-wider border border-accent/30 px-1.5 py-0.5">Attached</span>
              <button
                type="button"
                onClick={() => setFileAttached(false)}
                data-testid="button-remove-file"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Trash2 size={12} />
              </button>
            </div>
          ) : (
            <label
              data-testid="dropzone-quote"
              className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-black/15 px-4 py-7 cursor-pointer hover:border-foreground hover:bg-muted transition-all"
            >
              <Upload size={16} className="text-muted-foreground" />
              <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Upload Quote PDF</span>
              <span className="text-[10px] text-muted-foreground">Click or drag file here</span>
              <input type="file" accept=".pdf" className="hidden" onChange={() => setFileAttached(true)} />
            </label>
          )}
        </div>

        {/* Additional Notes */}
        <div className="px-6 py-5">
          <label className={labelClass}>Additional Notes</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Delivery dates, technical specs, vendor contacts, special conditions, or any project-critical context…"
            rows={3}
            data-testid="textarea-notes"
            className={`${inputClass} resize-none leading-relaxed`}
          />
        </div>
      </form>

      {/* Drawer footer */}
      <div className="px-6 py-5 border-t border-black/10 shrink-0">
        <button
          onClick={handleSubmit}
          disabled={submitted}
          data-testid="button-submit-cost"
          className={`w-full py-3.5 text-[11px] font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-all duration-200 ${
            submitted
              ? "bg-accent text-white cursor-default"
              : "bg-foreground text-white hover:bg-accent"
          }`}
        >
          {submitted ? (
            <><span className="w-1.5 h-1.5 bg-white animate-pulse" />Submitting…</>
          ) : (
            "Submit for Approval"
          )}
        </button>
        <p className="text-[9px] text-muted-foreground text-center mt-3 uppercase tracking-wider">
          Routed to Catarina Figueiredo · Creative Director
        </p>
      </div>
    </>
  );
}

/* ─── Timeline Panel ─────────────────────────────────────── */
/* ── Timeline data — anchored to Wed 1 Jul 2026 (Lisbon/WEST) ── */

// Assignee color palette — premium tones complementary to VĀC brand
const ASSIGNEE_PALETTE: Record<string, { bg: string; text: string; light: string }> = {
  "Marta":    { bg: "#8B6F5E", text: "#fff", light: "#F5EDE8" },  // cognac
  "Tiago":    { bg: "#4A7B9D", text: "#fff", light: "#E5F0F8" },  // slate blue
  "Catarina": { bg: "#5C8A5E", text: "#fff", light: "#E8F3E9" },  // sage
  "JP":       { bg: "#7B6B9E", text: "#fff", light: "#EEE9F6" },  // dusty violet
  "Miguel":   { bg: "#9E7A3A", text: "#fff", light: "#F6EFE1" },  // warm amber
};

// 15 working days (Mon–Fri × 3 weeks) centred on Jul 1 2026
const TIMELINE_DAYS = [
  { day:"22", dow:"Mon", month:"Jun 2026", isToday:false },
  { day:"23", dow:"Tue", month:"Jun 2026", isToday:false },
  { day:"24", dow:"Wed", month:"Jun 2026", isToday:false },
  { day:"25", dow:"Thu", month:"Jun 2026", isToday:false },
  { day:"26", dow:"Fri", month:"Jun 2026", isToday:false },
  { day:"29", dow:"Mon", month:"Jun 2026", isToday:false },
  { day:"30", dow:"Tue", month:"Jun 2026", isToday:false },
  { day:"1",  dow:"Wed", month:"Jul 2026", isToday:true  }, // ← TODAY
  { day:"2",  dow:"Thu", month:"Jul 2026", isToday:false },
  { day:"3",  dow:"Fri", month:"Jul 2026", isToday:false },
  { day:"6",  dow:"Mon", month:"Jul 2026", isToday:false },
  { day:"7",  dow:"Tue", month:"Jul 2026", isToday:false },
  { day:"8",  dow:"Wed", month:"Jul 2026", isToday:false },
  { day:"9",  dow:"Thu", month:"Jul 2026", isToday:false },
  { day:"10", dow:"Fri", month:"Jul 2026", isToday:false },
];
const TODAY_COL = 7; // Jul 1 = column index 7 (0-based)

const GANTT_TASKS = [
  { task:"Scenography Build",   assignee:"Marta",    start:0,  end:5,  status:"done"     },
  { task:"Copywriting Review",  assignee:"Catarina", start:2,  end:6,  status:"done"     },
  { task:"Print Proofing",      assignee:"Tiago",    start:4,  end:9,  status:"active"   },
  { task:"Photography Session", assignee:"JP",       start:6,  end:11, status:"critical" },
  { task:"Motion Graphics",     assignee:"Tiago",    start:9,  end:13, status:"upcoming" },
  { task:"Client Review",       assignee:"Miguel",   start:11, end:14, status:"upcoming" },
  { task:"Final Export",        assignee:"Marta",    start:13, end:15, status:"upcoming" },
];

function TimelinePanel() {
  const [ganttOpen, setGanttOpen] = useState(false);
  const [ganttHovered, setGanttHovered] = useState(false);
  const [meetingTooltip, setMeetingTooltip] = useState<string | null>(null);

  // TODAY = Wednesday 1 Jul 2026 (Lisbon / WEST)
  // Compact bar spans May 1 – Sep 30 2026 (153 days); Jul 1 = day 61 → 39.9% ≈ 40%
  const TODAY_PCT = 40;

  const phases = [
    { id:"pre",      label:"Pre-production", status:"done",     dates:"May 1 – May 31 2026",  progress: null, meetings:[] },
    {
      id:"prod",     label:"Production",     status:"active",   dates:"Jun 1 – Jul 15 2026",  progress: 62,
      meetings:[{ label:"Weekly Team Sync", date:"Jul 3", href:"#teams" }],
    },
    {
      id:"review",   label:"Review",         status:"upcoming", dates:"Jul 16 – Aug 31 2026", progress: null,
      meetings:[{ label:"Client Alignment Call", date:"Jul 18", href:"#teams" }],
    },
    { id:"delivery", label:"Delivery",       status:"upcoming", dates:"Sep 1 – Sep 30 2026",  progress: null, meetings:[] },
  ];

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
        transition={{ duration: 0.18 }}
        className="absolute inset-0 flex flex-col overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-7 py-5 border-b border-border shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-accent font-bold text-sm leading-none">/</span>
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.14em]">Production Schedule</p>
            </div>
            <p className="text-xs text-foreground font-medium mt-0.5">Beach Pizza Cascais · Active: Production Phase</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-[9px] font-bold text-muted-foreground uppercase tracking-wider border border-border px-2 py-1">
              <span className="w-1.5 h-1.5 bg-foreground" />
              Wed 1 Jul 2026 · Lisbon
            </div>
            <span className="flex items-center gap-1.5 text-[10px] font-bold text-primary uppercase tracking-wider">
              <span className="w-1.5 h-1.5 bg-primary" style={{ animation:"pulse 2s infinite" }} />
              In Production
            </span>
          </div>
        </div>

        {/* ── Phase Status Cards ── */}
        <div className="grid grid-cols-4 divide-x divide-border border-b border-border shrink-0">
          {phases.map((phase) => (
            <div key={phase.id} className={`p-5 ${phase.status==="active" ? "bg-primary/5" : ""}`}>
              <div className="flex items-center gap-1.5 mb-2.5">
                <span className={`w-1.5 h-1.5 ${phase.status==="done"?"bg-accent":phase.status==="active"?"bg-primary":"bg-border"}`} />
                <span className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground">
                  {phase.status==="done"?"Completed":phase.status==="active"?"In Progress":"Upcoming"}
                </span>
              </div>
              <p className={`text-xs font-bold mb-0.5 ${phase.status==="done"?"text-accent":phase.status==="active"?"text-primary":"text-foreground"}`}>
                {phase.label}
              </p>
              <p className="text-[10px] text-muted-foreground mb-3">{phase.dates}</p>
              {phase.progress !== null && (
                <div className="mb-3">
                  <div className="w-full h-0.5 bg-border"><div className="h-full bg-primary" style={{ width:`${phase.progress}%` }} /></div>
                  <p className="text-[9px] text-muted-foreground mt-1">{phase.progress}% complete</p>
                </div>
              )}
              {phase.meetings.map((m) => (
                <div key={m.label} className="relative">
                  <button
                    onMouseEnter={() => setMeetingTooltip(`${phase.id}-${m.label}`)}
                    onMouseLeave={() => setMeetingTooltip(null)}
                    className="flex items-center gap-1.5 w-full text-left group hover:bg-white transition-colors px-2 py-1.5 -mx-2 border border-transparent hover:border-border"
                  >
                    <Video size={10} className="text-muted-foreground group-hover:text-primary shrink-0 transition-colors" />
                    <span className="text-[10px] font-medium text-muted-foreground group-hover:text-foreground transition-colors truncate">{m.label}</span>
                    <ExternalLink size={8} className="text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity ml-auto shrink-0" />
                  </button>
                  <AnimatePresence>
                    {meetingTooltip === `${phase.id}-${m.label}` && (
                      <motion.div
                        initial={{ opacity:0, y:4 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:4 }}
                        transition={{ duration:0.12 }}
                        className="absolute bottom-full left-0 mb-2 z-50 pointer-events-none"
                      >
                        <div className="bg-foreground text-white text-[9px] font-bold px-3 py-2 whitespace-nowrap shadow-lg uppercase tracking-wider">
                          Redirecting to Microsoft Teams
                        </div>
                        <div className="text-[9px] text-white/70 bg-foreground px-3 pb-2 -mt-1 whitespace-nowrap">
                          {m.date} · Calendar Invite Link →
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* ── Compact Timeline bar ── */}
        <div className="px-7 py-5 border-b border-border shrink-0">
          {/* Title row — "/ Timeline" label + Expand View inline */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="text-accent font-bold text-sm leading-none">/</span>
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.14em]">Timeline</span>
            </div>
            <button
              onClick={() => setGanttOpen(true)}
              className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-widest border border-border px-2.5 py-1 hover:bg-foreground hover:text-white hover:border-foreground transition-all"
            >
              Expand View
              <ExternalLink size={8} />
            </button>
          </div>

          {/* Month markers — May → Sep 2026 */}
          <div className="flex text-[9px] text-muted-foreground font-bold uppercase tracking-wider mb-1.5">
            {["May 2026","Jun 2026","Jul 2026","Aug 2026","Sep 2026"].map((m) => (
              <div key={m} className="flex-1 border-l border-border pl-1.5">{m}</div>
            ))}
          </div>

          {/* Bar area — phase blocks + TODAY marker */}
          <div
            className="relative h-10 bg-muted border border-black/10 overflow-hidden cursor-pointer group"
            onMouseEnter={() => setGanttHovered(true)}
            onMouseLeave={() => setGanttHovered(false)}
            onClick={() => setGanttOpen(true)}
          >
            {/* Phase segments — positions as % of May 1–Sep 30 */}
            {[
              { id:"pre",  label:"Pre-prod",   left:0,  width:20, status:"done"     },
              { id:"prod", label:"Production", left:20, width:48, status:"active",  progress: 62 },
              { id:"rev",  label:"Review",     left:68, width:20, status:"upcoming" },
              { id:"del",  label:"Delivery",   left:88, width:12, status:"upcoming" },
            ].map((seg) => (
              <div
                key={seg.id}
                className={`absolute top-0 h-full flex items-center px-2 border-r border-black/10 group-hover:opacity-60 transition-opacity ${
                  seg.status==="done" ? "bg-accent/15" : seg.status==="active" ? "bg-primary/10" : ""
                }`}
                style={{ left:`${seg.left}%`, width:`${seg.width}%` }}
              >
                {"progress" in seg && seg.status==="active" && (
                  <div className="absolute left-0 top-0 h-full bg-primary/20 border-r border-primary/30"
                    style={{ width:`${seg.progress}%` }} />
                )}
                <span className={`relative z-10 text-[9px] font-bold uppercase tracking-wider truncate ${
                  seg.status==="done"?"text-accent":seg.status==="active"?"text-primary":"text-muted-foreground"
                }`}>{seg.label}</span>
              </div>
            ))}

            {/* TODAY vertical marker at 40% */}
            <div
              className="absolute top-0 h-full z-20 flex flex-col items-center"
              style={{ left:`${TODAY_PCT}%` }}
            >
              <div className="w-px h-full bg-foreground" />
              <div className="absolute top-0 -translate-x-1/2 bg-foreground text-white text-[8px] font-bold px-1 py-0.5 uppercase tracking-wider whitespace-nowrap">
                Today
              </div>
              {/* Square tick at bottom */}
              <div className="absolute bottom-0 -translate-x-1/2 w-2 h-2 bg-foreground" />
            </div>

            {/* Hover overlay */}
            <AnimatePresence>
              {ganttHovered && (
                <motion.div
                  initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
                  transition={{ duration:0.1 }}
                  className="absolute inset-0 flex items-center justify-center bg-foreground/75 z-30"
                >
                  <span className="text-white text-[10px] font-bold uppercase tracking-widest">
                    Click to expand detailed Timeline
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Milestones */}
        <div>
          <div className="px-7 py-3 border-b border-border bg-muted">
            <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-[0.14em]">Key Milestones</p>
          </div>
          {[
            { label:"Creative brief approved",  date:"May 15 2026", done:true  },
            { label:"Venue confirmed & booked", date:"May 28 2026", done:true  },
            { label:"Sponsor deck delivery",    date:"Jun 20 2026", done:true  },
            { label:"Production wrap",          date:"Jul 15 2026", done:false, active:true },
            { label:"Client review session",    date:"Aug 5 2026",  done:false },
            { label:"Final delivery package",   date:"Sep 12 2026", done:false },
          ].map((m) => (
            <div key={m.label} className={`flex items-center gap-4 px-7 py-3.5 border-b border-border ${m.active?"bg-primary/5":""}`}>
              <span className={`w-1.5 h-1.5 shrink-0 ${m.done?"bg-accent":m.active?"bg-primary":"bg-border"}`} />
              <span className={`text-xs flex-1 ${m.done?"text-muted-foreground line-through":m.active?"text-foreground font-bold":"text-foreground"}`}>{m.label}</span>
              <span className={`text-[10px] font-medium ${m.active?"text-primary font-bold":"text-muted-foreground"}`}>{m.date}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* ── Expanded Timeline Modal ── */}
      <AnimatePresence>
        {ganttOpen && (
          <motion.div
            initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
            transition={{ duration:0.18 }}
            className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-6"
          >
            <motion.div
              initial={{ opacity:0, scale:0.97, y:12 }}
              animate={{ opacity:1, scale:1, y:0 }}
              exit={{ opacity:0, scale:0.97, y:12 }}
              transition={{ duration:0.2 }}
              className="bg-white w-full max-w-6xl max-h-[88vh] flex flex-col border border-black/10 shadow-2xl overflow-hidden"
            >
              {/* Modal header */}
              <div className="flex items-center justify-between px-8 py-5 border-b border-black/10 shrink-0">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-accent font-bold text-sm leading-none">/</span>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.14em]">Detailed Production Timeline</p>
                  </div>
                  <h2 className="text-sm font-bold text-foreground tracking-tight mt-0.5">
                    Beach Pizza Cascais · Jun 22 – Jul 10 2026
                    <span className="ml-3 text-[9px] font-bold text-primary uppercase tracking-wider border border-primary/30 px-1.5 py-0.5">
                      Today: Wed 1 Jul 2026
                    </span>
                  </h2>
                </div>
                <div className="flex items-center gap-6">
                  {/* Assignee legend */}
                  <div className="flex items-center gap-3 flex-wrap">
                    {Object.entries(ASSIGNEE_PALETTE).map(([name, c]) => (
                      <span key={name} className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-wider text-muted-foreground">
                        <span className="w-2.5 h-2.5" style={{ background: c.bg }} />
                        {name}
                      </span>
                    ))}
                  </div>
                  <button
                    onClick={() => setGanttOpen(false)}
                    data-testid="button-close-gantt"
                    className="w-8 h-8 border border-black/10 flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-foreground transition-colors shrink-0"
                  >
                    <X size={14} />
                  </button>
                </div>
              </div>

              {/* Timeline grid */}
              <div className="overflow-auto flex-1">
                <table className="border-collapse" style={{ width: "100%", minWidth: "900px" }}>
                  <thead>
                    {/* Row 1: Month groups */}
                    <tr className="bg-muted">
                      <th className="px-5 py-2 border-b border-r border-black/10 w-36 sticky left-0 bg-muted z-20" />
                      <th className="px-4 py-2 border-b border-r border-black/10 w-28 sticky left-36 bg-muted z-20" />
                      {/* Jun 2026 spans cols 0–6, Jul 2026 spans cols 7–14 */}
                      <th colSpan={7} className="px-3 py-2 text-[9px] font-bold text-muted-foreground uppercase tracking-[0.14em] border-b border-r border-black/10 text-left">
                        Jun 2026
                      </th>
                      <th colSpan={8} className="px-3 py-2 text-[9px] font-bold text-primary uppercase tracking-[0.14em] border-b border-r border-black/10 text-left">
                        Jul 2026
                      </th>
                    </tr>
                    {/* Row 2: Day numbers */}
                    <tr className="bg-muted">
                      <th className="text-left px-5 py-2 text-[9px] font-bold text-muted-foreground uppercase tracking-[0.14em] border-b border-r border-black/10 sticky left-0 bg-muted z-20">
                        Task
                      </th>
                      <th className="text-left px-4 py-2 text-[9px] font-bold text-muted-foreground uppercase tracking-[0.14em] border-b border-r border-black/10 sticky left-36 bg-muted z-20">
                        Assignee
                      </th>
                      {TIMELINE_DAYS.map((d, i) => (
                        <th
                          key={i}
                          className={`px-0 py-2 text-[10px] font-bold border-b border-r border-black/10 text-center min-w-[52px] ${
                            d.isToday ? "bg-foreground text-white" : "text-foreground"
                          }`}
                        >
                          {d.day}
                        </th>
                      ))}
                    </tr>
                    {/* Row 3: Day of week */}
                    <tr className="bg-white">
                      <th className="border-b border-r border-black/10 sticky left-0 bg-white z-20" />
                      <th className="border-b border-r border-black/10 sticky left-36 bg-white z-20" />
                      {TIMELINE_DAYS.map((d, i) => (
                        <th
                          key={i}
                          className={`py-1.5 text-[9px] font-bold border-b border-r border-black/10 text-center uppercase tracking-wider ${
                            d.isToday ? "text-foreground" : "text-muted-foreground"
                          }`}
                        >
                          {d.dow}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {GANTT_TASKS.map((row, ri) => {
                      const palette = ASSIGNEE_PALETTE[row.assignee] ?? { bg:"#ccc", text:"#000", light:"#f5f5f5" };
                      return (
                        <tr key={row.task} className={`border-b border-black/10 ${ri % 2 === 0 ? "bg-white" : "bg-muted/30"}`}>
                          <td className="px-5 py-3 text-xs font-medium text-foreground border-r border-black/10 sticky left-0 bg-inherit z-10 whitespace-nowrap w-36">
                            {row.task}
                          </td>
                          <td className="px-4 py-3 border-r border-black/10 sticky left-36 bg-inherit z-10 w-28">
                            <div className="flex items-center gap-2">
                              <span
                                className="w-5 h-5 flex items-center justify-center text-[9px] font-bold shrink-0"
                                style={{ background: palette.bg, color: palette.text }}
                              >
                                {row.assignee.slice(0,1)}
                              </span>
                              <span className="text-[10px] font-medium text-muted-foreground">{row.assignee}</span>
                            </div>
                          </td>
                          {TIMELINE_DAYS.map((d, wi) => {
                            const inBar = wi >= row.start && wi < row.end;
                            const isStart = wi === row.start;
                            const isEnd = wi === row.end - 1;
                            const bgColor = row.status === "done"
                              ? "rgba(0,0,0,0.18)"
                              : row.status === "upcoming"
                              ? palette.light
                              : palette.bg;
                            const isTodayCol = d.isToday;
                            return (
                              <td
                                key={wi}
                                className={`border-r border-black/10 px-0.5 py-3 ${isTodayCol ? "bg-foreground/5" : ""}`}
                              >
                                {inBar && (
                                  <div
                                    className={`h-5 ${isStart ? "ml-1" : ""} ${isEnd ? "mr-1" : ""}`}
                                    style={{
                                      background: bgColor,
                                      border: row.status === "upcoming" ? `1px solid ${palette.bg}` : "none",
                                    }}
                                  />
                                )}
                                {/* TODAY column marker line */}
                                {isTodayCol && !inBar && (
                                  <div className="h-5 flex items-center justify-center">
                                    <div className="w-px h-full bg-foreground/20" />
                                  </div>
                                )}
                              </td>
                            );
                          })}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Modal footer */}
              <div className="px-8 py-4 border-t border-black/10 shrink-0 flex items-center justify-between bg-muted/40">
                <div className="flex items-center gap-4 text-[9px] font-bold uppercase tracking-wider text-muted-foreground">
                  <span>7 Tasks · 5 Assignees · Jun 22 – Jul 10 2026</span>
                  <span className="flex items-center gap-1.5 text-foreground">
                    <span className="w-2 h-2 bg-foreground" />
                    Today: Wed 1 Jul 2026 · Lisbon
                  </span>
                </div>
                <button
                  onClick={() => setGanttOpen(false)}
                  className="text-[10px] font-bold text-foreground uppercase tracking-widest border border-black/10 px-4 py-2 hover:bg-foreground hover:text-white hover:border-foreground transition-all"
                >
                  Close View
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

/* ─── Canvas Panel ─────────────────────────────────────── */
function CanvasPanel() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
      transition={{ duration: 0.18 }}
      className="absolute inset-0 bg-dot-pattern bg-white flex flex-col overflow-hidden"
    >
      <div className="absolute top-4 left-1/2 -translate-x-1/2 flex items-center gap-0 border border-border bg-white z-20 shadow-sm">
        <ToolButton icon={MousePointer2} active /><ToolButton icon={Square} /><ToolButton icon={Type} /><ToolButton icon={ImageIcon} />
        <div className="w-px h-5 bg-border" />
        <ToolButton icon={ZoomIn} /><ToolButton icon={ZoomOut} />
      </div>
      <div className="absolute top-4 left-6 z-20 flex items-center gap-1.5">
        <span className="text-accent font-bold text-sm leading-none">/</span>
        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Creative Moodboard</span>
      </div>
      <div className="relative flex-1 w-full h-full">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl h-72">
          <div className="absolute top-0 left-10 w-52 h-36 border border-border bg-white p-1.5 shadow-md -rotate-6 transition-transform hover:rotate-0 hover:z-30 hover:scale-105 cursor-pointer duration-300">
            <div className="w-full h-full bg-[url('https://images.unsplash.com/photo-1557683316-973673baf926?w=400&q=80')] bg-cover bg-center" />
          </div>
          <div className="absolute top-10 right-16 w-40 h-52 border border-border bg-white p-1.5 shadow-md rotate-3 transition-transform hover:rotate-0 hover:z-30 hover:scale-105 cursor-pointer duration-300">
            <div className="w-full h-full bg-[url('https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&q=80')] bg-cover bg-center" />
          </div>
          <div className="absolute bottom-0 left-1/3 w-60 h-40 border border-border bg-white p-1.5 shadow-md rotate-2 transition-transform hover:rotate-0 hover:z-30 hover:scale-105 cursor-pointer duration-300">
            <div className="w-full h-full bg-[url('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&q=80')] bg-cover bg-center" />
          </div>
          <div className="absolute -top-8 left-56 bg-[#FFF9C4] border border-[#e8e099] p-3 w-32 shadow-md rotate-2 z-20">
            <p className="font-sans font-semibold text-xs leading-snug text-black">Color Direction: Sunset to Twilight</p>
          </div>
          <div className="absolute bottom-4 right-[28%] bg-[#E1BEE7] border border-[#c9a8d4] p-3 w-32 shadow-md -rotate-2 z-20">
            <p className="font-sans font-semibold text-xs leading-snug text-black">Typography Ref: Bold & Condensed</p>
          </div>
          <div className="absolute top-24 left-4 bg-[#B2EBF2] border border-[#8dd5de] p-3 w-28 shadow-md rotate-1 z-20">
            <p className="font-sans font-semibold text-xs leading-snug text-black">Art Direction: Earthy + Coastal</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Shared sub-components ─────────────────────────────── */
function ColHeader({ children, border=false }: { children: React.ReactNode; border?: boolean }) {
  return <div className={`px-6 py-3.5 text-[9px] font-bold text-muted-foreground uppercase tracking-[0.12em] leading-snug ${border?"border-l border-border":""}`}>{children}</div>;
}
function DataCell({ children, border=false }: { children: React.ReactNode; border?: boolean }) {
  return <div className={`px-6 py-6 ${border?"border-l border-border":""}`}>{children}</div>;
}
function BigNum({ children, muted=false, green=false }: { children: React.ReactNode; muted?: boolean; green?: boolean }) {
  return <p className={`text-3xl font-bold tracking-tight ${muted?"text-muted-foreground":green?"text-accent":"text-foreground"}`}>{children}</p>;
}
function SubLabel({ children }: { children: React.ReactNode }) {
  return <p className="text-[9px] text-muted-foreground uppercase tracking-wider mt-1.5 font-medium">{children}</p>;
}
function MetricCell({ label, value, sub, accent=false }: { label: string; value: string; sub: string; accent?: boolean }) {
  return (
    <div className="px-6 py-5">
      <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-[0.12em] mb-2">{label}</p>
      <p className={`text-xl font-bold tracking-tight ${accent?"text-accent":"text-foreground"}`}>{value}</p>
      <p className="text-[10px] text-muted-foreground mt-1">{sub}</p>
    </div>
  );
}
function ExpenseRow({ label, allocated, spent, pct }: { label: string; allocated: number; spent: number; pct: number }) {
  const isHigh = pct >= 85;
  return (
    <div className="grid grid-cols-[1fr_auto_auto_160px] items-center px-7 py-3.5 border-b border-border hover:bg-muted transition-colors">
      <span className="text-xs font-medium text-foreground">{label}</span>
      <span className="text-xs text-foreground font-medium w-24 text-right">€{spent.toLocaleString()}</span>
      <span className="text-xs text-muted-foreground w-24 text-right mr-4">/ €{allocated.toLocaleString()}</span>
      <div className="flex items-center gap-2">
        <div className="flex-1 h-0.5 bg-border">
          <div className={`h-full transition-all duration-500 ${isHigh?"bg-primary":"bg-accent"}`} style={{ width:`${pct}%` }} />
        </div>
        <span className={`text-[10px] font-bold w-7 text-right ${isHigh?"text-primary":"text-accent"}`}>{pct}%</span>
      </div>
    </div>
  );
}
function ToolButton({ icon: Icon, active=false }: { icon: any; active?: boolean }) {
  return (
    <button className={`w-8 h-8 flex items-center justify-center transition-colors ${active?"bg-muted text-foreground":"text-muted-foreground hover:bg-muted hover:text-foreground"}`}>
      <Icon size={13} />
    </button>
  );
}
