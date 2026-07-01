import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  { initials: "CF", name: "Catarina F.", bg: "bg-accent text-white",      message: "The event layout is confirmed for the 24th.",          isSelf: false },
  { initials: "MS", name: "Miguel S.",   bg: "bg-primary text-white",     message: "Great. I'll have the sponsor decks ready by EOD.",    isSelf: false },
  { initials: "You", name: "You",        bg: "bg-foreground text-white",  message: "Copy. Sending the venue brief now.",                   isSelf: true  },
  { initials: "CF", name: "Catarina F.", bg: "bg-accent text-white",      message: "Perfect, thanks!",                                    isSelf: false },
];

interface ZoneCProps {
  pendingCount: number;
}

export default function ZoneC({ pendingCount }: ZoneCProps) {
  const [approvalRequested, setApprovalRequested] = useState(false);
  const [localMessages, setLocalMessages] = useState(messages);
  const [inputValue, setInputValue] = useState("");

  // When a pending cost arrives, auto-inject a system notification message
  const prevCount = React.useRef(pendingCount);
  React.useEffect(() => {
    if (pendingCount > prevCount.current) {
      setLocalMessages((prev) => [
        ...prev,
        {
          initials: "OS",
          name: "VĀC OS",
          bg: "bg-foreground text-white",
          message: `Cost submission received. Routing to Catarina Figueiredo for approval. (#${String(pendingCount).padStart(3, "0")})`,
          isSelf: false,
        },
      ]);
      prevCount.current = pendingCount;
    }
  }, [pendingCount]);

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
        <div className="px-5 py-4 border-b border-border flex items-center justify-between shrink-0">
          <SectionLabel>Project Chat</SectionLabel>
          <div className="flex items-center gap-2">
            {/* Notification badge */}
            <AnimatePresence>
              {pendingCount > 0 && (
                <motion.span
                  key="badge"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 400, damping: 20 }}
                  className="flex items-center gap-1 bg-primary text-white text-[9px] font-bold px-1.5 py-0.5 uppercase tracking-wider"
                  data-testid="badge-pending-count"
                >
                  <CircleDashed size={8} className="animate-spin" />
                  {pendingCount} pending
                </motion.span>
              )}
            </AnimatePresence>
            <div className="flex -space-x-1">
              <div className="w-5 h-5 bg-accent border border-white flex items-center justify-center text-[8px] font-bold text-white">CF</div>
              <div className="w-5 h-5 bg-primary border border-white flex items-center justify-center text-[8px] font-bold text-white">MS</div>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto flex flex-col divide-y divide-border">
          <AnimatePresence initial={false}>
            {localMessages.map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
              >
                <MessageRow {...msg} isSystem={msg.initials === "OS"} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Input */}
        <div className="border-t border-border p-4 shrink-0">
          <div className="flex border border-border">
            <input
              type="text"
              placeholder="Type message…"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
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
      <div className="flex flex-col divide-y divide-border shrink-0">
        <div className="px-5 py-4 flex items-center justify-between">
          <SectionLabel>Approval Request</SectionLabel>
          {approvalRequested ? (
            <span className="text-[9px] font-bold text-primary uppercase tracking-wider flex items-center gap-1">
              <CircleDashed size={8} className="animate-spin" />Pending
            </span>
          ) : (
            <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider border border-border px-2 py-0.5">Draft</span>
          )}
        </div>

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
            {approvalRequested
              ? <><CheckCircle2 size={12} /> Approval Requested</>
              : "Request Approval"
            }
          </button>
        </div>
      </div>
    </motion.div>
  );
}

function MessageRow({ initials, name, message, bg, isSelf, isSystem = false }: {
  initials: string; name: string; message: string; bg: string; isSelf: boolean; isSystem?: boolean;
}) {
  return (
    <div className={`px-5 py-3.5 flex gap-3 ${isSelf ? "bg-muted/60 flex-row-reverse" : isSystem ? "bg-primary/5 border-l-2 border-l-primary" : "bg-white"}`}>
      <div className={`w-6 h-6 ${bg} flex items-center justify-center text-[9px] font-bold shrink-0`}>
        {initials}
      </div>
      <div className={`flex flex-col flex-1 ${isSelf ? "items-end" : "items-start"}`}>
        <span className={`text-[9px] font-bold uppercase tracking-wider mb-1 ${isSystem ? "text-primary" : "text-muted-foreground"}`}>{name}</span>
        <p className={`text-xs leading-relaxed ${isSystem ? "text-primary font-medium" : "text-foreground"}`}>{message}</p>
      </div>
    </div>
  );
}
