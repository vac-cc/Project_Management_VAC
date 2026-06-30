import React, { useState } from "react";
import { motion } from "framer-motion";
import { Send, CircleDashed, CheckCircle2 } from "lucide-react";

export default function ZoneC() {
  const [approvalRequested, setApprovalRequested] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="w-[300px] h-full border-l border-border bg-sidebar flex flex-col shrink-0"
    >
      {/* Top: Project Chat */}
      <div className="flex-1 flex flex-col min-h-0 border-b border-border">
        <div className="p-5 pb-4 border-b border-border/50 flex items-center justify-between">
          <h2 className="text-base font-bold uppercase tracking-wide">Project Chat</h2>
          <div className="flex -space-x-2">
            <div className="w-6 h-6 rounded-full bg-accent border border-sidebar flex items-center justify-center text-[10px] font-bold text-black">CF</div>
            <div className="w-6 h-6 rounded-full bg-primary border border-sidebar flex items-center justify-center text-[10px] font-bold text-white">MS</div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-4">
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
            color="bg-muted text-foreground"
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

        <div className="p-4 border-t border-border/50 bg-background/50">
          <div className="relative">
            <input
              type="text"
              placeholder="Type message..."
              data-testid="input-chat-message"
              className="w-full bg-card border border-border rounded-xl py-3 pl-4 pr-12 text-sm focus:outline-none focus:border-primary transition-colors font-sans"
            />
            <button
              data-testid="button-send-message"
              className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg bg-primary text-white flex items-center justify-center hover:bg-primary/90 transition-colors"
            >
              <Send size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Bottom: Approval Flow (relocated from Zone A) */}
      <div className="p-5 bg-background flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold uppercase tracking-wide">Approval Request</h2>
          {approvalRequested ? (
            <span className="text-[10px] font-bold text-primary bg-primary/10 px-2.5 py-1 rounded-lg uppercase tracking-wider animate-pulse flex items-center gap-1.5">
              <CircleDashed size={10} className="animate-spin" />
              Awaiting
            </span>
          ) : (
            <span className="text-[10px] font-bold text-muted-foreground bg-muted/20 px-2.5 py-1 rounded-lg uppercase tracking-wider">
              Draft
            </span>
          )}
        </div>

        {approvalRequested ? (
          <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 flex items-start gap-3">
            <CircleDashed size={16} className="text-primary animate-spin shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold text-primary uppercase tracking-wider">Awaiting Catarina's Approval</p>
              <p className="text-[10px] text-muted-foreground mt-1">Sent · Beach Pizza Cascais — Brand Strategy</p>
            </div>
          </div>
        ) : (
          <div className="bg-card border border-border rounded-xl p-4">
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              Send this project proposal to <span className="text-foreground font-semibold">Catarina Figueiredo</span> for final sign-off before production begins.
            </p>
          </div>
        )}

        <button
          onClick={() => setApprovalRequested(true)}
          disabled={approvalRequested}
          data-testid="button-request-approval"
          className={`w-full py-3 rounded-xl font-bold uppercase tracking-wider text-sm transition-all duration-300 flex items-center justify-center gap-2 ${
            approvalRequested
              ? "bg-card text-muted-foreground border border-border cursor-default"
              : "bg-primary text-primary-foreground hover:bg-primary/90 hover:-translate-y-0.5 shadow-lg shadow-primary/20"
          }`}
        >
          {approvalRequested ? (
            <>
              <CheckCircle2 size={15} />
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
    <div className={`flex gap-3 ${isSelf ? "flex-row-reverse" : ""}`}>
      <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${color}`}>
        {initials}
      </div>
      <div className={`flex flex-col ${isSelf ? "items-end" : "items-start"}`}>
        <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold mb-1">{name}</span>
        <div className={`px-3.5 py-2 rounded-2xl text-xs leading-relaxed max-w-[190px] ${
          isSelf
            ? "bg-primary text-white rounded-tr-sm"
            : "bg-card border border-border rounded-tl-sm text-foreground"
        }`}>
          {message}
        </div>
      </div>
    </div>
  );
}
