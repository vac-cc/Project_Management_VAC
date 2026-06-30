import React, { useState } from "react";
import { motion } from "framer-motion";
import { MousePointer2, Square, Type, Image as ImageIcon, ZoomIn, ZoomOut } from "lucide-react";

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
      <div className="h-[55%] border-b border-border flex flex-col bg-background relative">
        <div className="p-8 flex-1 flex flex-col">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold uppercase tracking-wide">Financial Ledger</h2>
            <button 
              onClick={() => setOverrun(!overrun)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider border transition-colors ${
                overrun ? "bg-primary text-white border-primary" : "bg-card text-muted-foreground border-border hover:text-foreground"
              }`}
            >
              Toggle Overrun
            </button>
          </div>

          <div className="bg-card border border-border rounded-xl overflow-hidden mb-8">
            <div className="grid grid-cols-4 border-b border-border bg-black/40">
              <div className="p-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Client Approved</div>
              <div className="p-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Estimated Costs</div>
              <div className="p-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider border-l border-border">Realized Costs</div>
              <div className="p-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider border-l border-border">Profit Margin</div>
            </div>
            
            {overrun ? (
              <div className="grid grid-cols-1 bg-primary text-white p-6 items-center justify-center animate-pulse">
                <p className="text-lg font-bold uppercase tracking-widest text-center">
                  CRITICAL: Budget Ceiling Exceeded — €47,200 vs €45,000
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-4 items-center">
                <div className="p-6 text-2xl font-bold">€45,000</div>
                <div className="p-6 text-2xl font-bold text-muted-foreground">€38,200</div>
                <div className="p-6 text-2xl font-bold border-l border-border">€31,500</div>
                <div className="p-6 border-l border-border">
                  <div className="flex items-end justify-between mb-2">
                    <span className="text-2xl font-bold text-accent">30%</span>
                  </div>
                  <div className="w-full h-1.5 bg-background rounded-full overflow-hidden">
                    <div className="h-full bg-accent rounded-full w-[30%] shadow-[0_0_10px_rgba(153,204,51,0.5)]" />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Gantt Timeline */}
          <div className="mt-auto">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">Production Timeline</h3>
            <div className="flex gap-2 h-12">
              <div className="flex-1 bg-accent/20 border border-accent/50 rounded-xl relative overflow-hidden flex items-center px-4">
                <div className="absolute inset-0 bg-accent opacity-20" />
                <span className="relative z-10 text-xs font-bold text-accent uppercase tracking-wider">Pre-production</span>
              </div>
              
              <div className="flex-[1.5] border border-primary rounded-xl relative overflow-hidden flex items-center px-4">
                <div className="absolute left-0 top-0 bottom-0 w-[40%] bg-primary/20 border-r border-primary/50" />
                <span className="relative z-10 text-xs font-bold text-primary uppercase tracking-wider flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                  Production
                </span>
              </div>

              <div className="flex-1 border border-border border-dashed rounded-xl flex items-center px-4 bg-card/50">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Review</span>
              </div>

              <div className="flex-[0.8] border border-border border-dashed rounded-xl flex items-center px-4 bg-card/50">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Delivery</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Half: Media Canvas */}
      <div className="h-[45%] relative bg-dot-pattern flex flex-col overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 to-transparent pointer-events-none" />
        
        {/* Toolbar */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 flex items-center gap-1 p-1 bg-card border border-border rounded-xl shadow-xl z-20">
          <ToolButton icon={MousePointer2} active />
          <ToolButton icon={Square} />
          <ToolButton icon={Type} />
          <ToolButton icon={ImageIcon} />
          <div className="w-px h-4 bg-border mx-1" />
          <ToolButton icon={ZoomIn} />
          <ToolButton icon={ZoomOut} />
        </div>

        <div className="absolute top-6 left-8 z-10">
          <span className="px-3 py-1.5 bg-background border border-border rounded-lg text-xs font-bold uppercase tracking-wider shadow-sm">
            Creative Moodboard
          </span>
        </div>

        {/* Canvas Content */}
        <div className="relative flex-1 w-full h-full">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl h-64">
            
            <div className="absolute top-0 left-10 w-48 h-32 bg-card border border-border p-2 rounded-xl shadow-2xl -rotate-6 transition-transform hover:rotate-0 hover:z-30 cursor-pointer">
              <div className="w-full h-full bg-muted rounded-lg object-cover bg-[url('https://images.unsplash.com/photo-1557683316-973673baf926?w=400&q=80')] bg-cover bg-center" />
            </div>

            <div className="absolute top-10 right-20 w-40 h-48 bg-card border border-border p-2 rounded-xl shadow-2xl rotate-3 transition-transform hover:rotate-0 hover:z-30 cursor-pointer">
              <div className="w-full h-full bg-muted rounded-lg bg-[url('https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&q=80')] bg-cover bg-center" />
            </div>

            <div className="absolute bottom-4 left-1/3 w-56 h-40 bg-card border border-border p-2 rounded-xl shadow-2xl rotate-2 transition-transform hover:rotate-0 hover:z-30 cursor-pointer">
              <div className="w-full h-full bg-muted rounded-lg bg-[url('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&q=80')] bg-cover bg-center" />
            </div>

            {/* Sticky Notes */}
            <div className="absolute -top-4 left-48 bg-[#FFF9C4] text-black p-3 w-32 shadow-lg rotate-3 z-20">
              <p className="font-sans font-semibold text-sm leading-tight">Color Direction: Sunset to Twilight</p>
            </div>

            <div className="absolute bottom-10 right-1/3 bg-[#E1BEE7] text-black p-3 w-32 shadow-lg -rotate-2 z-20">
              <p className="font-sans font-semibold text-sm leading-tight">Typography Ref: Bold & Condensed</p>
            </div>

          </div>
        </div>

      </div>
    </motion.div>
  );
}

function ToolButton({ icon: Icon, active = false }: { icon: any, active?: boolean }) {
  return (
    <button className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
      active ? "bg-muted text-foreground" : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
    }`}>
      <Icon size={16} />
    </button>
  );
}
