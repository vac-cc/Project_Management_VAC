import React, { useState } from "react";
import { motion } from "framer-motion";
import { Send, CircleDashed, CheckCircle2 } from "lucide-react";

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-accent font-bold text-sm leading-none">/</span>
      <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.14em]">{children}</span>
    </div>
  );
}

const messages = [
  { initials: "CF", name: "Catarina F.", bg: "bg-accent text-white", message: "The event layout is confirmed for the 24th.", isSelf: false },
  { initials: "MS", name: "Miguel S.",   bg: "bg-primary text-white", message: "Great. I'll have the sponsor decks ready by EOD.", isSelf: false },
  { initials: "You", name: "You",        bg: "bg-foreground text-white", message: "Copy. Sending the venue brief now.", isSelf: true  },
  { initials: "CF", name: "Catarina F.", bg: "bg-accent text-white", message: "Perfect, thanks!", isSelf: false },
];

export default function ZoneC() {
  const [approvalRequested, setApprovalRequested] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay: 0.3 }}
      className="w-[300px] h-full border-l border-border bg-background flex flex-col shrink-0"
    >
      {/* Project Chat */}
      <div className="flex-1 flex flex-col min-h-0 border-b border-border">
        {/* Header */}
        <div className="px-5 py-4 border-b border-border flex items-center justify-between">
          <SectionLabel>Project Chat</SectionLabel>
          <div className="flex -space-x-1">
            <div className="w-5 h-5 bg-accent border border-white flex items-center justify-center text-[8px] font-bold text-white">CF</div>
            <div className="w-5 h-5 bg-primary border border-white flex items-center justify-center text-[8px] font-bold text-white">MS</div>
          </div>
        </div>

        {/* Messages — rectangular blocks with dividers, no bubbles */}
        <div className="flex-1 overflow-y-auto flex flex-col divide-y divide-border">
          {messages.map((msg, i) => (
            <MessageRow key={i} {...msg} />
          ))}
        </div>

        {/* Input */}
        <div className="border-t border-border p-4">
          <div className="flex border border-border">
            <input
              type="text"
              placeholder="Type message..."
              data-testid="input-chat-message"
              className="flex-1 bg-white px-3 py-2.5 text-xs focus:outline-none placeholder:text-muted-foreground font-sans text-foreground"
            />
            <button
              data-testid="button-send-message"
              className="w-10 bg-foreground text-white flex items-center justify-center hover:bg-accent transition-colors"
            >
              <Send size={12} />
            </button>
          </div>
        </div>
      </div>

      {/* Approval Request */}
      <div className="flex flex-col divide-y divide-border">
        {/* Header */}
        <div className="px-5 py-4 flex items-center justify-between">
          <SectionLabel>Approval Request</SectionLabel>
          {approvalRequested ? (
            <span className="text-[9px] font-bold text-primary uppercase tracking-wider flex items-center gap-1">
              <CircleDashed size={8} className="animate-spin" />
              Pending
            </span>
          ) : (
            <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider border border-border px-2 py-0.5">Draft</span>
          )}
        </div>

        {/* Status block */}
        {approvalRequested ? (
          <div className="px-5 py-4 bg-primary/5 border-l-2 border-l-primary">
            <div className="flex items-start gap-2.5">
              <CircleDashed size={13} className="text-primary animate-spin shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-primary">Awaiting Catarina's Approval</p>
                <p className="text-[10px] text-muted-foreground mt-1">Beach Pizza Cascais · Brand Strategy</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="px-5 py-4 bg-muted">
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              Send to <span className="text-foreground font-semibold">Catarina Figueiredo</span> for sign-off before production begins.
            </p>
          </div>
        )}

        {/* CTA */}
        <div className="px-5 py-4">
          <button
            onClick={() => setApprovalRequested(true)}
            disabled={approvalRequested}
            data-testid="button-request-approval"
            className={`w-full py-3 text-[11px] font-bold uppercase tracking-widest flex items-center justify-center gap-2 border transition-all duration-150 ${
              approvalRequested
                ? "bg-muted text-muted-foreground border-border cursor-default"
                : "bg-foreground text-white border-foreground hover:bg-accent hover:border-accent"
            }`}
          >
            {approvalRequested ? (
              <><CheckCircle2 size={12} /> Approval Requested</>
            ) : (
              "Request Approval"
            )}
          </button>
        </div>
      </div>
    </motion.div>
  );
}

function MessageRow({ initials, name, message, bg, isSelf }: {
  initials: string; name: string; message: string; bg: string; isSelf: boolean;
}) {
  return (
    <div className={`px-5 py-3.5 flex gap-3 ${isSelf ? "bg-muted/60 flex-row-reverse" : "bg-white"}`}>
      <div className={`w-6 h-6 ${bg} flex items-center justify-center text-[9px] font-bold shrink-0`}>
        {initials}
      </div>
      <div className={`flex flex-col flex-1 ${isSelf ? "items-end" : "items-start"}`}>
        <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider mb-1">{name}</span>
        <p className="text-xs text-foreground leading-relaxed">{message}</p>
      </div>
    </div>
  );
}
