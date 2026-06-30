import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MousePointer2, Square, Type, Image as ImageIcon, ZoomIn, ZoomOut } from "lucide-react";

type Tab = "finance" | "timeline" | "canvas";

const tabs: { id: Tab; label: string }[] = [
  { id: "finance",  label: "Financial Ledger"    },
  { id: "timeline", label: "Production Timeline" },
  { id: "canvas",   label: "Creative Canvas"     },
];

export default function ZoneB() {
  const [activeTab, setActiveTab] = useState<Tab>("finance");
  const [overrun, setOverrun] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className="flex-1 h-full flex flex-col min-w-0 bg-white"
    >
      {/* Tab Bar */}
      <div className="border-b border-border flex items-end px-7 pt-6 shrink-0">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
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
          {activeTab === "finance"  && <FinancePanel  key="finance"  overrun={overrun} setOverrun={setOverrun} />}
          {activeTab === "timeline" && <TimelinePanel key="timeline" />}
          {activeTab === "canvas"   && <CanvasPanel   key="canvas"   />}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

/* ─── Finance Panel ─────────────────────────────────────── */
function FinancePanel({ overrun, setOverrun }: { overrun: boolean; setOverrun: (v: boolean) => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={{ duration: 0.18 }}
      className="absolute inset-0 flex flex-col overflow-y-auto"
    >
      {/* Report header */}
      <div className="flex items-center justify-between px-7 py-5 border-b border-border">
        <div>
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.14em]">Project Financial Report</p>
          <p className="text-xs text-foreground font-medium mt-0.5">Beach Pizza Cascais · Brand Strategy & Events</p>
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

      {/* Budget Matrix — full-width architectural grid */}
      <div className="border-b border-border">
        {/* Column headers */}
        <div className="grid grid-cols-4 border-b border-border bg-muted">
          <ColHeader>Total Client Approved Budget</ColHeader>
          <ColHeader border>Total Estimated Costs</ColHeader>
          <ColHeader border>Realized Costs</ColHeader>
          <ColHeader border>Profit Margin Tracker</ColHeader>
        </div>

        {/* Data row */}
        <AnimatePresence mode="wait">
          {overrun ? (
            <motion.div
              key="overrun"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="bg-primary flex items-center justify-center py-9 px-8"
            >
              <div className="text-center">
                <p className="text-base font-bold uppercase tracking-widest text-white">Critical: Budget Ceiling Exceeded</p>
                <p className="text-white/80 text-xs mt-2 tracking-wide">€47,200 realized vs €45,000 approved</p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="normal"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-4"
            >
              <DataCell>
                <BigNum>€45,000</BigNum>
                <SubLabel>Approved</SubLabel>
              </DataCell>
              <DataCell border>
                <BigNum muted>€38,200</BigNum>
                <SubLabel>Estimated</SubLabel>
              </DataCell>
              <DataCell border>
                <BigNum>€31,500</BigNum>
                <SubLabel>Realized</SubLabel>
              </DataCell>
              <DataCell border>
                <div className="flex items-baseline gap-1">
                  <BigNum green>30%</BigNum>
                </div>
                <div className="w-full h-1 bg-border mt-3 mb-1">
                  <div className="h-full bg-accent" style={{ width: "30%" }} />
                </div>
                <SubLabel>Healthy margin</SubLabel>
              </DataCell>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Secondary metrics */}
      <div className="grid grid-cols-3 divide-x divide-border border-b border-border">
        <MetricCell label="Budget Utilization" value="70%" sub="€31,500 of €45,000" accent />
        <MetricCell label="Cost Variance"       value="+€6,700" sub="Estimated vs Realized" />
        <MetricCell label="Invoiced to Date"    value="€28,000" sub="62% of approved budget" />
      </div>

      {/* Expense Breakdown */}
      <div className="flex flex-col">
        <div className="grid grid-cols-[1fr_auto_auto_160px] px-7 py-3 border-b border-border bg-muted">
          <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-[0.14em]">Line Item</p>
          <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-[0.14em] w-24 text-right">Spent</p>
          <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-[0.14em] w-24 text-right mr-4">Allocated</p>
          <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-[0.14em]">Utilization</p>
        </div>
        {[
          { label: "Production Crew",      allocated: 18000, spent: 14200, pct: 79 },
          { label: "Venue & Logistics",    allocated: 12000, spent: 10800, pct: 90 },
          { label: "Creative & Design",    allocated: 8000,  spent: 4900,  pct: 61 },
          { label: "Contingency Reserve",  allocated: 7000,  spent: 1600,  pct: 23 },
        ].map((row) => (
          <ExpenseRow key={row.label} {...row} />
        ))}
      </div>
    </motion.div>
  );
}

/* ─── Timeline Panel ─────────────────────────────────────── */
function TimelinePanel() {
  const phases = [
    { id: "pre",      label: "Pre-production", start: 0,  width: 20,   status: "done",     dates: "Mar 1 – Mar 21"  },
    { id: "prod",     label: "Production",     start: 20, width: 38,   status: "active",   dates: "Mar 22 – May 2", progress: 40 },
    { id: "review",   label: "Review",         start: 58, width: 24,   status: "upcoming", dates: "May 3 – May 24"  },
    { id: "delivery", label: "Delivery",       start: 82, width: 18,   status: "upcoming", dates: "May 25 – Jun 8"  },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={{ duration: 0.18 }}
      className="absolute inset-0 flex flex-col overflow-y-auto"
    >
      <div className="flex items-center justify-between px-7 py-5 border-b border-border">
        <div>
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.14em]">Production Schedule</p>
          <p className="text-xs text-foreground font-medium mt-0.5">Beach Pizza Cascais · Active: Production Phase</p>
        </div>
        <span className="flex items-center gap-1.5 text-[10px] font-bold text-primary uppercase tracking-wider">
          <span className="w-1.5 h-1.5 bg-primary" style={{ animation: "pulse 2s infinite" }} />
          In Production
        </span>
      </div>

      {/* Gantt */}
      <div className="px-7 py-6 border-b border-border">
        <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-[0.14em] mb-4">Gantt — Q1/Q2 2025</p>
        <div className="flex text-[9px] text-muted-foreground font-bold uppercase tracking-wider mb-2">
          {["Mar", "Apr", "May", "Jun"].map((m) => (
            <div key={m} className="flex-1 border-l border-border pl-2">{m}</div>
          ))}
        </div>
        <div className="relative h-9 bg-muted border border-border overflow-hidden">
          {phases.map((phase) => (
            <div
              key={phase.id}
              className={`absolute top-0 h-full flex items-center px-2.5 border-r border-border ${
                phase.status === "done"   ? "bg-accent/15" :
                phase.status === "active" ? "bg-primary/10" : ""
              }`}
              style={{ left: `${phase.start}%`, width: `${phase.width}%` }}
            >
              {phase.status === "active" && "progress" in phase && (
                <div className="absolute left-0 top-0 h-full bg-primary/20 border-r border-primary/40"
                  style={{ width: `${phase.progress}%` }} />
              )}
              <span className={`relative z-10 text-[9px] font-bold uppercase tracking-wider ${
                phase.status === "done" ? "text-accent" :
                phase.status === "active" ? "text-primary" :
                "text-muted-foreground"
              }`}>
                {phase.status === "active" && (
                  <span className="inline-block w-1.5 h-1.5 bg-primary mr-1 align-middle" style={{ animation: "pulse 2s infinite" }} />
                )}
                {phase.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Phase cards */}
      <div className="grid grid-cols-4 divide-x divide-border border-b border-border">
        {phases.map((phase) => (
          <div key={phase.id} className="p-5">
            <div className="flex items-center gap-1.5 mb-3">
              <span className={`w-1.5 h-1.5 ${
                phase.status === "done" ? "bg-accent" :
                phase.status === "active" ? "bg-primary" : "bg-border"
              }`} />
              <span className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground">
                {phase.status === "done" ? "Completed" : phase.status === "active" ? "In Progress" : "Upcoming"}
              </span>
            </div>
            <p className={`text-xs font-bold mb-1 ${
              phase.status === "done" ? "text-accent" :
              phase.status === "active" ? "text-primary" :
              "text-foreground"
            }`}>{phase.label}</p>
            <p className="text-[10px] text-muted-foreground">{phase.dates}</p>
            {"progress" in phase && phase.status === "active" && (
              <div className="mt-3">
                <div className="w-full h-0.5 bg-border">
                  <div className="h-full bg-primary" style={{ width: `${phase.progress}%` }} />
                </div>
                <p className="text-[9px] text-muted-foreground mt-1">{phase.progress}% complete</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Milestones */}
      <div>
        <div className="px-7 py-3 border-b border-border bg-muted">
          <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-[0.14em]">Key Milestones</p>
        </div>
        {[
          { label: "Creative brief approved",   date: "Mar 21", done: true  },
          { label: "Venue confirmed & booked",  date: "Mar 29", done: true  },
          { label: "Sponsor deck delivery",     date: "Apr 18", done: true  },
          { label: "Production wrap",           date: "May 2",  done: false, active: true },
          { label: "Client review session",     date: "May 12", done: false },
          { label: "Final delivery package",    date: "Jun 8",  done: false },
        ].map((m, i) => (
          <div key={m.label} className={`flex items-center gap-4 px-7 py-3.5 border-b border-border ${m.active ? "bg-primary/5" : ""}`}>
            <span className={`w-1.5 h-1.5 shrink-0 ${m.done ? "bg-accent" : m.active ? "bg-primary" : "bg-border"}`} />
            <span className={`text-xs flex-1 ${m.done ? "text-muted-foreground line-through" : m.active ? "text-foreground font-bold" : "text-foreground"}`}>
              {m.label}
            </span>
            <span className={`text-[10px] font-medium ${m.active ? "text-primary font-bold" : "text-muted-foreground"}`}>{m.date}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

/* ─── Canvas Panel ─────────────────────────────────────── */
function CanvasPanel() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={{ duration: 0.18 }}
      className="absolute inset-0 bg-dot-pattern bg-white flex flex-col overflow-hidden"
    >
      {/* Toolbar */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 flex items-center gap-0 border border-border bg-white z-20 shadow-sm">
        <ToolButton icon={MousePointer2} active />
        <ToolButton icon={Square} />
        <ToolButton icon={Type} />
        <ToolButton icon={ImageIcon} />
        <div className="w-px h-5 bg-border mx-0" />
        <ToolButton icon={ZoomIn} />
        <ToolButton icon={ZoomOut} />
      </div>

      {/* Label */}
      <div className="absolute top-4 left-6 z-20 flex items-center gap-1.5">
        <span className="text-accent font-bold text-sm leading-none">/</span>
        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Creative Moodboard</span>
      </div>

      {/* Canvas */}
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

          {/* Sticky notes */}
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
function ColHeader({ children, border = false }: { children: React.ReactNode; border?: boolean }) {
  return (
    <div className={`px-6 py-3.5 text-[9px] font-bold text-muted-foreground uppercase tracking-[0.12em] leading-snug ${border ? "border-l border-border" : ""}`}>
      {children}
    </div>
  );
}

function DataCell({ children, border = false }: { children: React.ReactNode; border?: boolean }) {
  return (
    <div className={`px-6 py-6 ${border ? "border-l border-border" : ""}`}>
      {children}
    </div>
  );
}

function BigNum({ children, muted = false, green = false }: { children: React.ReactNode; muted?: boolean; green?: boolean }) {
  return (
    <p className={`text-3xl font-bold tracking-tight ${muted ? "text-muted-foreground" : green ? "text-accent" : "text-foreground"}`}>
      {children}
    </p>
  );
}

function SubLabel({ children }: { children: React.ReactNode }) {
  return <p className="text-[9px] text-muted-foreground uppercase tracking-wider mt-1.5 font-medium">{children}</p>;
}

function MetricCell({ label, value, sub, accent = false }: { label: string; value: string; sub: string; accent?: boolean }) {
  return (
    <div className="px-6 py-5">
      <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-[0.12em] mb-2">{label}</p>
      <p className={`text-xl font-bold tracking-tight ${accent ? "text-accent" : "text-foreground"}`}>{value}</p>
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
          <div
            className={`h-full transition-all duration-500 ${isHigh ? "bg-primary" : "bg-accent"}`}
            style={{ width: `${pct}%` }}
          />
        </div>
        <span className={`text-[10px] font-bold w-7 text-right ${isHigh ? "text-primary" : "text-accent"}`}>{pct}%</span>
      </div>
    </div>
  );
}

function ToolButton({ icon: Icon, active = false }: { icon: any; active?: boolean }) {
  return (
    <button className={`w-8 h-8 flex items-center justify-center transition-colors ${
      active ? "bg-muted text-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground"
    }`}>
      <Icon size={13} />
    </button>
  );
}
