import React, { useState } from "react";
import { motion } from "framer-motion";
import { Send, CircleDashed, CheckCircle2 } from "lucide-react";

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-accent font-bold text-sm leading-none">/</span>
      <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-[0.12em]">{children}</span>
    </div>
  );
}

export default function ZoneC() {
  const [approvalRequested, setApprovalRequested] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="w-[300px] h-full border-l border-border bg-sidebar flex flex-col shrink-0"
    >
      {/* Project Chat */}
      <div className="flex-1 flex flex-col min-h-0 border-b border-border">
        <div className="px-5 pt-5 pb-4 border-b border-[#1a1a1a] flex items-center justify-between">
          <SectionLabel>Project Chat</SectionLabel>
          <div className="flex -space-x-2">
            <div className="w-6 h-6 rounded-full bg-accent text-black border-2 border-sidebar flex items-center justify-center text-[9px] font-bold">CF</div>
            <div className="w-6 h-6 rounded-full bg-primary text-white border-2 border-sidebar flex items-center justify-center text-[9px] font-bold">MS</div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-4">
          <ChatMessage
            initials="CF"
            color="bg-accent text-black"
            message="The event layout is confirmed for the 24th."
            name="Catarina F."
          />
          <ChatMessage
            initials="MS"
            color="bg-primary text-white"
            message="Great. I'll have the sponsor decks ready by EOD."
            name="Miguel S."
          />
          <ChatMessage
            initials="You"
            color="bg-[#1e1e1e] text-foreground"
            message="Copy. Sending the venue brief now."
            name="You"
            isSelf
          />
          <ChatMessage
            initials="CF"
            color="bg-accent text-black"
            message="Perfect, thanks!"
            name="Catarina F."
          />
        </div>

        <div className="px-4 py-3 border-t border-[#1a1a1a]">
          <div className="relative">
            <input
              type="text"
              placeholder="Type message..."
              data-testid="input-chat-message"
              className="w-full bg-[#111] border border-[#1e1e1e] rounded-xl py-2.5 pl-4 pr-11 text-xs focus:outline-none focus:border-[#333] transition-colors font-sans placeholder:text-muted-foreground/50"
            />
            <button
              data-testid="button-send-message"
              className="absolute right-1.5 top-1/2 -translate-y-1/2 w-7 h-7 rounded-lg bg-primary text-white flex items-center justify-center hover:bg-primary/90 transition-colors"
            >
              <Send size={12} />
            </button>
          </div>
        </div>
      </div>

      {/* Approval Request */}
      <div className="p-5 bg-background flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <SectionLabel>Approval Request</SectionLabel>
          {approvalRequested ? (
            <span className="text-[9px] font-bold text-primary bg-primary/10 px-2 py-1 rounded-md uppercase tracking-wider animate-pulse flex items-center gap-1">
              <CircleDashed size={8} className="animate-spin" />
              Pending
            </span>
          ) : (
            <span className="text-[9px] font-bold text-muted-foreground bg-[#111] border border-[#1e1e1e] px-2 py-1 rounded-md uppercase tracking-wider">
              Draft
            </span>
          )}
        </div>

        {approvalRequested ? (
          <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 flex items-start gap-3">
            <CircleDashed size={14} className="text-primary animate-spin shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold text-primary">Awaiting Catarina's Approval</p>
              <p className="text-[10px] text-muted-foreground mt-1">Beach Pizza Cascais · Brand Strategy</p>
            </div>
          </div>
        ) : (
          <div className="bg-[#0d0d0d] border border-[#1a1a1a] rounded-xl p-4">
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              Send to <span className="text-foreground font-semibold">Catarina Figueiredo</span> for sign-off before production begins.
            </p>
          </div>
        )}

        <button
          onClick={() => setApprovalRequested(true)}
          disabled={approvalRequested}
          data-testid="button-request-approval"
          className={`w-full py-3 rounded-xl font-bold uppercase tracking-wider text-xs transition-all duration-300 flex items-center justify-center gap-2 ${
            approvalRequested
              ? "bg-[#111] text-muted-foreground border border-[#1e1e1e] cursor-default"
              : "bg-primary text-white hover:bg-primary/90 hover:-translate-y-0.5 shadow-lg shadow-primary/10"
          }`}
        >
          {approvalRequested ? (
            <>
              <CheckCircle2 size={13} />
              Approval Requested
            </>
          ) : (
            "Request Approval"
          )}
        </button>
      </div>
    </motion.div>
  );
}

function ChatMessage({ initials, color, message, name, isSelf = false }: {
  initials: string;
  color: string;
  message: string;
  name: string;
  isSelf?: boolean;
}) {
  return (
    <div className={`flex gap-2.5 ${isSelf ? "flex-row-reverse" : ""}`}>
      <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[9px] font-bold shrink-0 ${color}`}>
        {initials}
      </div>
      <div className={`flex flex-col ${isSelf ? "items-end" : "items-start"}`}>
        <span className="text-[9px] text-muted-foreground uppercase tracking-wider font-semibold mb-1">{name}</span>
        <div className={`px-3 py-2 rounded-2xl text-xs leading-relaxed max-w-[185px] ${
          isSelf
            ? "bg-primary text-white rounded-tr-sm"
            : "bg-[#111] border border-[#1e1e1e] rounded-tl-sm text-foreground"
        }`}>
          {message}
        </div>
      </div>
    </div>
  );
}
