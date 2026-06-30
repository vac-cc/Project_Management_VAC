import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MousePointer2, Square, Type, Image as ImageIcon, ZoomIn, ZoomOut } from "lucide-react";

type Tab = "finance" | "timeline" | "canvas";

const tabs: { id: Tab; label: string }[] = [
  { id: "finance", label: "Financial Ledger" },
  { id: "timeline", label: "Production Timeline" },
  { id: "canvas", label: "Creative Canvas" },
];

export default function ZoneB() {
  const [activeTab, setActiveTab] = useState<Tab>("finance");
  const [overrun, setOverrun] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="flex-1 h-full flex flex-col min-w-0 bg-background"
    >
      {/* Tab Bar */}
      <div className="border-b border-[#1a1a1a] flex items-end gap-0 px-7 pt-5 shrink-0">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              data-testid={`tab-${tab.id}`}
              className={`relative flex items-center gap-2 px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.1em] transition-all duration-200 border-b-2 -mb-px ${
                isActive
                  ? "text-foreground border-accent"
                  : "text-muted-foreground border-transparent hover:text-foreground hover:border-[#333]"
              }`}
            >
              {isActive && (
                <span className="text-accent font-bold text-sm leading-none">/</span>
              )}
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="flex-1 min-h-0 overflow-hidden relative">
        <AnimatePresence mode="wait">
          {activeTab === "finance" && (
            <FinancePanel key="finance" overrun={overrun} setOverrun={setOverrun} />
          )}
          {activeTab === "timeline" && (
            <TimelinePanel key="timeline" />
          )}
          {activeTab === "canvas" && (
            <CanvasPanel key="canvas" />
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

/* ─── Finance Panel ─────────────────────────────────────── */
function FinancePanel({ overrun, setOverrun }: { overrun: boolean; setOverrun: (v: boolean) => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.2 }}
      className="absolute inset-0 p-7 flex flex-col gap-6 overflow-y-auto"
    >
      <div className="flex items-center justify-between">
        <p className="text-xs text-muted-foreground font-medium">
          Beach Pizza Cascais · Brand Strategy & Events
        </p>
        <button
          onClick={() => setOverrun(!overrun)}
          data-testid="button-toggle-overrun"
          className={`px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider border transition-all duration-200 ${
            overrun
              ? "bg-primary text-white border-primary"
              : "bg-transparent text-muted-foreground border-[#1e1e1e] hover:border-[#333] hover:text-foreground"
          }`}
        >
          {overrun ? "Reset State" : "Simulate Overrun"}
        </button>
      </div>

      {/* Budget Matrix */}
      <div className="bg-[#080808] border border-[#1a1a1a] rounded-2xl overflow-hidden">
        {/* Column Headers */}
        <div className="grid grid-cols-4 border-b border-[#1a1a1a]">
          <ColHeader>Total Client Approved Budget</ColHeader>
          <ColHeader>Total Estimated Costs</ColHeader>
          <ColHeader border>Realized Costs</ColHeader>
          <ColHeader border>Profit Margin Tracker</ColHeader>
        </div>

        {/* Data Row */}
        <AnimatePresence mode="wait">
          {overrun ? (
            <motion.div
              key="overrun"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="bg-primary flex items-center justify-center py-8 px-6"
            >
              <p className="text-sm font-bold uppercase tracking-widest text-white text-center leading-relaxed">
                Critical: Budget Ceiling Exceeded<br />
                <span className="text-white/80 font-medium normal-case tracking-normal text-xs mt-1 block">
                  €47,200 realized vs €45,000 approved
                </span>
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="normal"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="grid grid-cols-4 items-center"
            >
              <div className="p-6">
                <p className="text-3xl font-bold tracking-tight">€45,000</p>
                <p className="text-[10px] text-muted-foreground mt-1.5 uppercase tracking-wider">Approved</p>
              </div>
              <div className="p-6">
                <p className="text-3xl font-bold tracking-tight text-muted-foreground">€38,200</p>
                <p className="text-[10px] text-muted-foreground mt-1.5 uppercase tracking-wider">Estimated</p>
              </div>
              <div className="p-6 border-l border-[#1a1a1a]">
                <p className="text-3xl font-bold tracking-tight">€31,500</p>
                <p className="text-[10px] text-muted-foreground mt-1.5 uppercase tracking-wider">Realized</p>
              </div>
              <div className="p-6 border-l border-[#1a1a1a]">
                <div className="flex items-baseline gap-1.5">
                  <span className="text-3xl font-bold tracking-tight text-accent">30%</span>
                  <span className="text-xs text-accent font-medium">margin</span>
                </div>
                <div className="w-full h-1.5 bg-[#1a1a1a] rounded-full overflow-hidden mt-3">
                  <div
                    className="h-full bg-accent rounded-full transition-all duration-700"
                    style={{ width: "30%", boxShadow: "0 0 8px rgba(120,190,0,0.5)" }}
                  />
                </div>
                <p className="text-[10px] text-muted-foreground mt-2 uppercase tracking-wider">Healthy</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Secondary Metrics Row */}
      <div className="grid grid-cols-3 gap-3">
        <MetricCard label="Budget Utilization" value="70%" sub="€31,500 of €45,000" accent />
        <MetricCard label="Cost Variance" value="+€6,700" sub="Estimated vs Realized" />
        <MetricCard label="Invoiced to Date" value="€28,000" sub="62% of approved budget" />
      </div>

      {/* Expense Breakdown */}
      <div className="bg-[#080808] border border-[#1a1a1a] rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-[#1a1a1a]">
          <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-[0.12em]">Expense Breakdown</p>
        </div>
        <div className="divide-y divide-[#111]">
          {[
            { label: "Production Crew", allocated: 18000, spent: 14200, pct: 79 },
            { label: "Venue & Logistics", allocated: 12000, spent: 10800, pct: 90 },
            { label: "Creative & Design", allocated: 8000, spent: 4900, pct: 61 },
            { label: "Contingency Reserve", allocated: 7000, spent: 1600, pct: 23 },
          ].map((row) => (
            <ExpenseRow key={row.label} {...row} />
          ))}
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Timeline Panel ─────────────────────────────────────── */
function TimelinePanel() {
  const phases = [
    { id: "pre", label: "Pre-production", start: 0, width: 20, status: "done", dates: "Mar 1 – Mar 21" },
    { id: "prod", label: "Production", start: 20, width: 38, status: "active", dates: "Mar 22 – May 2", progress: 40 },
    { id: "review", label: "Review", start: 58, width: 24, status: "upcoming", dates: "May 3 – May 24" },
    { id: "delivery", label: "Delivery", start: 82, width: 18, status: "upcoming", dates: "May 25 – Jun 8" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.2 }}
      className="absolute inset-0 p-7 flex flex-col gap-6 overflow-y-auto"
    >
      <p className="text-xs text-muted-foreground">
        Beach Pizza Cascais · Brand Strategy & Events · <span className="text-foreground font-medium">Active: Production Phase</span>
      </p>

      {/* Horizontal Gantt Bar */}
      <div className="bg-[#080808] border border-[#1a1a1a] rounded-2xl p-6">
        <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-[0.12em] mb-5">Project Gantt — Q1/Q2 2025</p>

        {/* Month ruler */}
        <div className="relative flex mb-3 text-[9px] text-muted-foreground font-medium uppercase tracking-wider">
          {["Mar", "Apr", "May", "Jun"].map((m, i) => (
            <div key={m} className="flex-1 border-l border-[#1e1e1e] pl-1">{m}</div>
          ))}
        </div>

        {/* Phase bars */}
        <div className="relative h-10 bg-[#0d0d0d] rounded-xl overflow-hidden border border-[#1a1a1a]">
          {phases.map((phase) => (
            <div
              key={phase.id}
              className={`absolute top-0 h-full flex items-center px-3 ${
                phase.status === "done"
                  ? "bg-accent/20 border-r border-accent/30"
                  : phase.status === "active"
                  ? "border-r border-primary/30"
                  : "border-r border-[#1e1e1e]"
              }`}
              style={{ left: `${phase.start}%`, width: `${phase.width}%` }}
            >
              {phase.status === "active" && (
                <div
                  className="absolute left-0 top-0 h-full bg-primary/15 border-r border-primary/30"
                  style={{ width: `${phase.progress}%` }}
                />
              )}
              <span className={`relative z-10 text-[10px] font-bold uppercase tracking-wider whitespace-nowrap ${
                phase.status === "done" ? "text-accent" :
                phase.status === "active" ? "text-primary" :
                "text-muted-foreground"
              }`}>
                {phase.status === "active" && (
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary animate-pulse mr-1.5 align-middle" />
                )}
                {phase.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Phase detail cards */}
      <div className="grid grid-cols-4 gap-3">
        {phases.map((phase) => (
          <div
            key={phase.id}
            className={`bg-[#080808] border rounded-xl p-4 ${
              phase.status === "active"
                ? "border-primary/30"
                : phase.status === "done"
                ? "border-accent/20"
                : "border-[#1a1a1a]"
            }`}
          >
            <div className="flex items-center gap-1.5 mb-3">
              <span className={`w-1.5 h-1.5 rounded-full ${
                phase.status === "done" ? "bg-accent" :
                phase.status === "active" ? "bg-primary animate-pulse" :
                "bg-[#333]"
              }`} />
              <span className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground">
                {phase.status === "done" ? "Completed" : phase.status === "active" ? "In Progress" : "Upcoming"}
              </span>
            </div>
            <p className={`text-xs font-bold mb-1 ${
              phase.status === "done" ? "text-accent" :
              phase.status === "active" ? "text-primary" :
              "text-foreground"
            }`}>
              {phase.label}
            </p>
            <p className="text-[10px] text-muted-foreground">{phase.dates}</p>
            {phase.status === "active" && (
              <div className="mt-3">
                <div className="w-full h-1 bg-[#1a1a1a] rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full" style={{ width: `${phase.progress}%` }} />
                </div>
                <p className="text-[9px] text-muted-foreground mt-1">{phase.progress}% complete</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Milestone list */}
      <div className="bg-[#080808] border border-[#1a1a1a] rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-[#1a1a1a]">
          <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-[0.12em]">Key Milestones</p>
        </div>
        <div className="divide-y divide-[#111]">
          {[
            { label: "Creative brief approved", date: "Mar 21", done: true },
            { label: "Venue confirmed & booked", date: "Mar 29", done: true },
            { label: "Sponsor deck delivery", date: "Apr 18", done: true },
            { label: "Production wrap", date: "May 2", done: false, active: true },
            { label: "Client review session", date: "May 12", done: false },
            { label: "Final delivery package", date: "Jun 8", done: false },
          ].map((m) => (
            <div key={m.label} className="flex items-center gap-4 px-6 py-3.5">
              <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${m.done ? "bg-accent" : m.active ? "bg-primary animate-pulse" : "bg-[#333]"}`} />
              <span className={`text-xs flex-1 ${m.done ? "text-muted-foreground line-through" : m.active ? "text-foreground font-semibold" : "text-muted-foreground"}`}>
                {m.label}
              </span>
              <span className={`text-[10px] font-medium ${m.active ? "text-primary" : "text-muted-foreground"}`}>{m.date}</span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Canvas Panel ─────────────────────────────────────── */
function CanvasPanel() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.2 }}
      className="absolute inset-0 bg-dot-pattern bg-[#020202] flex flex-col overflow-hidden"
    >
      {/* Top fade */}
      <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-[#020202]/80 to-transparent pointer-events-none z-10" />

      {/* Toolbar */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 flex items-center gap-0.5 p-1 bg-[#111] border border-[#1e1e1e] rounded-xl shadow-xl z-20">
        <ToolButton icon={MousePointer2} active />
        <ToolButton icon={Square} />
        <ToolButton icon={Type} />
        <ToolButton icon={ImageIcon} />
        <div className="w-px h-3.5 bg-[#222] mx-0.5" />
        <ToolButton icon={ZoomIn} />
        <ToolButton icon={ZoomOut} />
      </div>

      {/* Label */}
      <div className="absolute top-4 left-6 z-20 flex items-center gap-1.5">
        <span className="text-accent font-bold text-sm leading-none">/</span>
        <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Creative Moodboard</span>
      </div>

      {/* Canvas Content */}
      <div className="relative flex-1 w-full h-full">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl h-72">

          <div className="absolute top-0 left-10 w-52 h-36 bg-[#111] border border-[#1e1e1e] p-1.5 rounded-xl shadow-2xl -rotate-6 transition-transform hover:rotate-0 hover:z-30 hover:scale-105 cursor-pointer duration-300">
            <div className="w-full h-full rounded-lg bg-[url('https://images.unsplash.com/photo-1557683316-973673baf926?w=400&q=80')] bg-cover bg-center" />
          </div>

          <div className="absolute top-10 right-16 w-40 h-52 bg-[#111] border border-[#1e1e1e] p-1.5 rounded-xl shadow-2xl rotate-3 transition-transform hover:rotate-0 hover:z-30 hover:scale-105 cursor-pointer duration-300">
            <div className="w-full h-full rounded-lg bg-[url('https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&q=80')] bg-cover bg-center" />
          </div>

          <div className="absolute bottom-0 left-1/3 w-60 h-40 bg-[#111] border border-[#1e1e1e] p-1.5 rounded-xl shadow-2xl rotate-2 transition-transform hover:rotate-0 hover:z-30 hover:scale-105 cursor-pointer duration-300">
            <div className="w-full h-full rounded-lg bg-[url('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&q=80')] bg-cover bg-center" />
          </div>

          {/* Sticky Notes */}
          <div className="absolute -top-8 left-56 bg-[#FFF9C4] text-black p-3 w-32 shadow-xl rotate-2 z-20 rounded-sm">
            <p className="font-sans font-semibold text-xs leading-snug">Color Direction: Sunset to Twilight</p>
          </div>
          <div className="absolute bottom-4 right-[28%] bg-[#E1BEE7] text-black p-3 w-32 shadow-xl -rotate-2 z-20 rounded-sm">
            <p className="font-sans font-semibold text-xs leading-snug">Typography Ref: Bold & Condensed</p>
          </div>
          <div className="absolute top-24 left-4 bg-[#B2EBF2] text-black p-3 w-28 shadow-xl rotate-1 z-20 rounded-sm">
            <p className="font-sans font-semibold text-xs leading-snug">Art Direction: Earthy + Coastal</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Shared sub-components ─────────────────────────────── */
function ColHeader({ children, border = false }: { children: React.ReactNode; border?: boolean }) {
  return (
    <div className={`px-6 py-4 text-[10px] font-semibold text-muted-foreground uppercase tracking-[0.1em] leading-tight ${border ? "border-l border-[#1a1a1a]" : ""}`}>
      {children}
    </div>
  );
}

function MetricCard({ label, value, sub, accent = false }: { label: string; value: string; sub: string; accent?: boolean }) {
  return (
    <div className="bg-[#080808] border border-[#1a1a1a] rounded-xl p-5">
      <p className="text-[9px] font-semibold text-muted-foreground uppercase tracking-[0.12em] mb-2">{label}</p>
      <p className={`text-xl font-bold tracking-tight ${accent ? "text-accent" : "text-foreground"}`}>{value}</p>
      <p className="text-[10px] text-muted-foreground mt-1">{sub}</p>
    </div>
  );
}

function ExpenseRow({ label, allocated, spent, pct }: { label: string; allocated: number; spent: number; pct: number }) {
  const isHigh = pct >= 85;
  return (
    <div className="flex items-center gap-4 px-6 py-4">
      <span className="text-xs flex-1 font-medium">{label}</span>
      <span className="text-xs text-muted-foreground w-20 text-right">€{spent.toLocaleString()}</span>
      <span className="text-xs text-muted-foreground w-20 text-right">/ €{allocated.toLocaleString()}</span>
      <div className="w-28 flex items-center gap-2">
        <div className="flex-1 h-1 bg-[#1a1a1a] rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${isHigh ? "bg-primary" : "bg-accent"}`}
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
    <button className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${
      active ? "bg-[#222] text-foreground" : "text-muted-foreground hover:bg-[#1a1a1a] hover:text-foreground"
    }`}>
      <Icon size={13} />
    </button>
  );
}
