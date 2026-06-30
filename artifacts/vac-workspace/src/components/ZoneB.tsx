import React, { useState } from "react";
import { motion } from "framer-motion";
import { MousePointer2, Square, Type, Image as ImageIcon, ZoomIn, ZoomOut } from "lucide-react";

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-accent font-bold text-sm leading-none">/</span>
      <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-[0.12em]">{children}</span>
    </div>
  );
}

export default function ZoneB() {
  const [overrun, setOverrun] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="flex-1 h-full flex flex-col min-w-0"
    >
      {/* Top Half: Financial Ledger */}
      <div className="h-[55%] border-b border-border flex flex-col bg-background">
        <div className="p-7 flex-1 flex flex-col gap-5">

          <div className="flex items-center justify-between">
            <SectionLabel>Financial Ledger</SectionLabel>
            <button
              onClick={() => setOverrun(!overrun)}
              data-testid="button-toggle-overrun"
              className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider border transition-all duration-200 ${
                overrun
                  ? "bg-primary text-white border-primary"
                  : "bg-transparent text-muted-foreground border-[#1e1e1e] hover:border-[#333] hover:text-foreground"
              }`}
            >
              {overrun ? "Reset" : "Toggle Overrun"}
            </button>
          </div>

          {/* Budget Matrix */}
          <div className="bg-card border border-[#1a1a1a] rounded-xl overflow-hidden">
            <div className="grid grid-cols-4 border-b border-[#1a1a1a]">
              <ColHeader>Client Approved</ColHeader>
              <ColHeader>Estimated Costs</ColHeader>
              <ColHeader border>Realized Costs</ColHeader>
              <ColHeader border>Profit Margin</ColHeader>
            </div>

            {overrun ? (
              <div className="bg-primary p-5 flex items-center justify-center">
                <p className="text-sm font-bold uppercase tracking-widest text-white text-center">
                  Critical — Budget Ceiling Exceeded · €47,200 vs €45,000
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-4 items-center">
                <div className="p-5 text-2xl font-bold tracking-tight">€45,000</div>
                <div className="p-5 text-2xl font-bold tracking-tight text-muted-foreground">€38,200</div>
                <div className="p-5 text-2xl font-bold tracking-tight border-l border-[#1a1a1a]">€31,500</div>
                <div className="p-5 border-l border-[#1a1a1a]">
                  <span className="text-2xl font-bold tracking-tight text-accent">30%</span>
                  <div className="w-full h-1 bg-[#1a1a1a] rounded-full overflow-hidden mt-3">
                    <div className="h-full bg-accent rounded-full w-[30%] shadow-[0_0_8px_rgba(120,190,0,0.5)]" />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Gantt Timeline */}
          <div className="mt-auto">
            <SectionLabel>Production Timeline</SectionLabel>
            <div className="flex gap-2 h-11 mt-3">
              <div className="flex-1 bg-accent/10 border border-accent/30 rounded-xl relative overflow-hidden flex items-center px-3">
                <span className="text-[10px] font-bold text-accent uppercase tracking-wider">Pre-production</span>
              </div>
              <div className="flex-[1.5] border border-primary/50 rounded-xl relative overflow-hidden flex items-center px-3">
                <div className="absolute left-0 top-0 bottom-0 w-[40%] bg-primary/10 border-r border-primary/20" />
                <span className="relative z-10 text-[10px] font-bold text-primary uppercase tracking-wider flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                  Production
                </span>
              </div>
              <div className="flex-1 border border-[#1e1e1e] border-dashed rounded-xl flex items-center px-3">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Review</span>
              </div>
              <div className="flex-[0.8] border border-[#1e1e1e] border-dashed rounded-xl flex items-center px-3">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Delivery</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom Half: Media Canvas */}
      <div className="h-[45%] relative bg-dot-pattern flex flex-col overflow-hidden bg-[#020202]">
        {/* Subtle top fade */}
        <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-background/60 to-transparent pointer-events-none z-10" />

        {/* Label */}
        <div className="absolute top-4 left-6 z-20">
          <span className="flex items-center gap-1.5 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
            <span className="text-accent font-bold text-sm leading-none">/</span>
            Creative Moodboard
          </span>
        </div>

        {/* Toolbar */}
        <div className="absolute top-3 left-1/2 -translate-x-1/2 flex items-center gap-0.5 p-1 bg-[#111] border border-[#1e1e1e] rounded-xl shadow-xl z-20">
          <ToolButton icon={MousePointer2} active />
          <ToolButton icon={Square} />
          <ToolButton icon={Type} />
          <ToolButton icon={ImageIcon} />
          <div className="w-px h-3.5 bg-[#222] mx-0.5" />
          <ToolButton icon={ZoomIn} />
          <ToolButton icon={ZoomOut} />
        </div>

        {/* Canvas Content */}
        <div className="relative flex-1 w-full h-full">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl h-56">

            <div className="absolute top-0 left-10 w-48 h-32 bg-[#111] border border-[#1e1e1e] p-1.5 rounded-xl shadow-2xl -rotate-6 transition-transform hover:rotate-0 hover:z-30 cursor-pointer">
              <div className="w-full h-full rounded-lg bg-[url('https://images.unsplash.com/photo-1557683316-973673baf926?w=400&q=80')] bg-cover bg-center" />
            </div>

            <div className="absolute top-8 right-20 w-36 h-44 bg-[#111] border border-[#1e1e1e] p-1.5 rounded-xl shadow-2xl rotate-3 transition-transform hover:rotate-0 hover:z-30 cursor-pointer">
              <div className="w-full h-full rounded-lg bg-[url('https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&q=80')] bg-cover bg-center" />
            </div>

            <div className="absolute bottom-2 left-1/3 w-52 h-36 bg-[#111] border border-[#1e1e1e] p-1.5 rounded-xl shadow-2xl rotate-2 transition-transform hover:rotate-0 hover:z-30 cursor-pointer">
              <div className="w-full h-full rounded-lg bg-[url('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&q=80')] bg-cover bg-center" />
            </div>

            {/* Sticky Notes */}
            <div className="absolute -top-6 left-52 bg-[#FFF9C4] text-black p-2.5 w-28 shadow-lg rotate-2 z-20 rounded-sm">
              <p className="font-sans font-semibold text-xs leading-snug">Color Direction: Sunset to Twilight</p>
            </div>
            <div className="absolute bottom-6 right-[30%] bg-[#E1BEE7] text-black p-2.5 w-28 shadow-lg -rotate-2 z-20 rounded-sm">
              <p className="font-sans font-semibold text-xs leading-snug">Typography Ref: Bold & Condensed</p>
            </div>

          </div>
        </div>
      </div>
    </motion.div>
  );
}

function ColHeader({ children, border = false }: { children: React.ReactNode; border?: boolean }) {
  return (
    <div className={`p-4 text-[10px] font-semibold text-muted-foreground uppercase tracking-[0.1em] ${border ? "border-l border-[#1a1a1a]" : ""}`}>
      {children}
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
