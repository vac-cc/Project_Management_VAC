import React, { useState } from "react";
import { motion } from "framer-motion";
import { Globe, Link as LinkIcon, FileText, Shield, Building2, MapPin, CircleDashed } from "lucide-react";

export default function ZoneA() {
  const [approvalRequested, setApprovalRequested] = useState(false);

  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="w-[320px] h-full border-r border-border flex flex-col p-8 bg-background shrink-0"
    >
      <div className="mb-10">
        <h2 className="text-2xl font-bold uppercase tracking-wide">Beach Pizza Cascais</h2>
        <div className="flex items-center gap-2 mt-2">
          <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
          <p className="text-sm text-muted-foreground font-semibold">Active Project · Brand Strategy</p>
        </div>
        
        <div className="flex gap-3 mt-6">
          <a href="#" className="w-10 h-10 rounded-xl bg-card border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-muted-foreground transition-all duration-200">
            <Globe size={18} />
          </a>
          <a href="#" className="w-10 h-10 rounded-xl bg-card border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-muted-foreground transition-all duration-200">
            <LinkIcon size={18} />
          </a>
        </div>
      </div>

      <div className="mb-10">
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">Strategic Presence</h3>
        <div className="flex gap-3">
          {['CF', 'MS', 'JP', 'AL'].map((initials, i) => (
            <div key={i} className="w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center text-sm font-bold relative">
              {initials}
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-accent border-2 border-background animate-pulse" />
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1">
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">Production Vault</h3>
        <div className="grid grid-cols-2 gap-3">
          <VaultCard icon={FileText} title="Client Contract" />
          <VaultCard icon={Shield} title="NDA Agreement" />
          <VaultCard icon={Building2} title="CML License" />
          <VaultCard icon={MapPin} title="EMEL Parking" />
        </div>
      </div>

      <div className="mt-8 pt-8 border-t border-border">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Approval Flow</h3>
          {approvalRequested ? (
            <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-1 rounded-md uppercase tracking-wider animate-pulse flex items-center gap-1.5">
              <CircleDashed size={10} className="animate-spin" />
              Awaiting Catarina
            </span>
          ) : (
            <span className="text-[10px] font-bold text-muted-foreground bg-muted/20 px-2 py-1 rounded-md uppercase tracking-wider">
              Draft
            </span>
          )}
        </div>
        <button 
          onClick={() => setApprovalRequested(true)}
          className={`w-full py-3.5 rounded-xl font-bold uppercase tracking-wider text-sm transition-all duration-300 ${
            approvalRequested 
              ? "bg-card text-muted-foreground border border-border cursor-default" 
              : "bg-primary text-primary-foreground hover:bg-primary/90 hover:-translate-y-0.5 shadow-lg shadow-primary/20"
          }`}
          disabled={approvalRequested}
        >
          {approvalRequested ? "Approval Requested" : "Request Approval"}
        </button>
      </div>
    </motion.div>
  );
}

function VaultCard({ icon: Icon, title }: { icon: any, title: string }) {
  return (
    <div className="bg-card border border-border rounded-xl p-4 flex flex-col items-start gap-3 hover:-translate-y-1 hover:border-muted-foreground transition-all duration-200 cursor-pointer group">
      <div className="w-8 h-8 rounded-lg bg-background border border-border flex items-center justify-center text-muted-foreground group-hover:text-foreground transition-colors">
        <Icon size={16} />
      </div>
      <div>
        <p className="text-xs font-semibold leading-tight">{title}</p>
        <p className="text-[10px] text-muted-foreground mt-1 uppercase tracking-wider font-bold">View →</p>
      </div>
    </div>
  );
}
