import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, CircleDashed, CheckCircle2, Paperclip, X } from "lucide-react";

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-accent font-bold text-sm leading-none">/</span>
      <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.14em]">{children}</span>
    </div>
  );
}

// Collaborator list — synced with Zone A
const MENTION_LIST = [
  { initials: "CF", name: "Catarina" },
  { initials: "MS", name: "Miguel"   },
  { initials: "JP", name: "JP"       },
  { initials: "AL", name: "Ana"      },
  { initials: "MT", name: "Marta"    },
  { initials: "TG", name: "Tiago"    },
];

const SEED_MESSAGES = [
  { initials: "CF", name: "Catarina F.", bg: "bg-accent text-white",     message: "The event layout is confirmed for the 24th.",       isSelf: false },
  { initials: "MS", name: "Miguel S.",   bg: "bg-primary text-white",    message: "Great. I'll have the sponsor decks ready by EOD.", isSelf: false },
  { initials: "You", name: "You",        bg: "bg-foreground text-white", message: "Copy. Sending the venue brief now.",                isSelf: true  },
  { initials: "CF", name: "Catarina F.", bg: "bg-accent text-white",     message: "Perfect, thanks!",                                 isSelf: false },
];

interface ZoneCProps {
  pendingCount: number;
}

export default function ZoneC({ pendingCount }: ZoneCProps) {
  const [approvalRequested, setApprovalRequested] = useState(false);
  const [localMessages, setLocalMessages]         = useState(SEED_MESSAGES);
  const [inputValue, setInputValue]               = useState("");
  const [mentionQuery, setMentionQuery]           = useState<string | null>(null);
  const [attachedFile, setAttachedFile]           = useState<File | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef   = useRef<HTMLInputElement>(null);
  const inputRef       = useRef<HTMLInputElement>(null);

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [localMessages]);

  // System notification on new pending cost
  const prevCount = useRef(pendingCount);
  useEffect(() => {
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

  // ── @mention logic ───────────────────────────────────────────
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInputValue(val);
    const atIdx = val.lastIndexOf("@");
    if (atIdx !== -1) {
      const fragment = val.slice(atIdx + 1);
      if (!fragment.includes(" ")) {
        setMentionQuery(fragment);
        return;
      }
    }
    setMentionQuery(null);
  };

  const handleMentionSelect = (name: string) => {
    const atIdx = inputValue.lastIndexOf("@");
    const next = inputValue.slice(0, atIdx) + "@" + name + " ";
    setInputValue(next);
    setMentionQuery(null);
    inputRef.current?.focus();
  };

  const filteredMentions = mentionQuery === null
    ? []
    : MENTION_LIST.filter((m) =>
        m.name.toLowerCase().startsWith(mentionQuery.toLowerCase())
      );

  // ── Send logic ───────────────────────────────────────────────
  const handleSend = () => {
    const text = inputValue.trim();
    if (!text && !attachedFile) return;
    const msgText = attachedFile
      ? text
        ? `${text} [📎 ${attachedFile.name}]`
        : `[📎 ${attachedFile.name}]`
      : text;
    setLocalMessages((prev) => [
      ...prev,
      { initials: "You", name: "You", bg: "bg-foreground text-white", message: msgText, isSelf: true },
    ]);
    setInputValue("");
    setAttachedFile(null);
    setMentionQuery(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") { e.preventDefault(); handleSend(); }
    if (e.key === "Escape") setMentionQuery(null);
  };

  // ── File attachment ──────────────────────────────────────────
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setAttachedFile(file);
    e.target.value = "";
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay: 0.3 }}
      className="w-[300px] h-full border-l border-border bg-background flex flex-col shrink-0"
    >
      {/* ── Project Chat — capped at 1/3 viewport height ── */}
      <div className="flex flex-col border-b border-border" style={{ maxHeight: "33vh", minHeight: 0 }}>

        {/* Header */}
        <div className="px-5 py-4 border-b border-border flex items-center justify-between shrink-0">
          <SectionLabel>Project Chat</SectionLabel>
          <div className="flex items-center gap-2">
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

        {/* Message feed — scrollable */}
        <div className="flex-1 overflow-y-auto flex flex-col divide-y divide-border min-h-0">
          <AnimatePresence initial={false}>
            {localMessages.map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.18 }}
              >
                <MessageRow {...msg} isSystem={msg.initials === "OS"} />
              </motion.div>
            ))}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </div>

        {/* Input zone */}
        <div className="border-t border-border px-4 pt-3 pb-3 shrink-0">

          {/* File attachment badge */}
          <AnimatePresence>
            {attachedFile && (
              <motion.div
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 4 }}
                transition={{ duration: 0.14 }}
                className="flex items-center gap-1.5 border border-black/10 px-2 py-1 mb-2 bg-muted w-fit max-w-full"
              >
                <Paperclip size={9} className="text-muted-foreground shrink-0" />
                <span className="text-[9px] font-bold text-foreground truncate max-w-[180px]">
                  {attachedFile.name}
                </span>
                <button
                  onClick={() => setAttachedFile(null)}
                  className="text-muted-foreground hover:text-foreground transition-colors ml-0.5 shrink-0"
                >
                  <X size={9} />
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* @mention dropdown */}
          <div className="relative">
            {mentionQuery !== null && filteredMentions.length > 0 && (
              <div className="absolute bottom-full left-0 right-0 mb-1 border border-black/10 bg-white z-50 shadow-lg">
                {filteredMentions.map((m) => (
                  <button
                    key={m.name}
                    onMouseDown={(e) => { e.preventDefault(); handleMentionSelect(m.name); }}
                    className="w-full flex items-center gap-2 px-3 py-2 hover:bg-muted text-left border-b border-black/6 last:border-0 transition-colors"
                  >
                    <span className="w-5 h-5 bg-foreground text-white text-[8px] font-bold flex items-center justify-center shrink-0">
                      {m.initials}
                    </span>
                    <span className="text-[11px] font-bold text-foreground">@{m.name}</span>
                  </button>
                ))}
              </div>
            )}

            {/* Input row */}
            <div className="flex border border-border">
              {/* Hidden file input */}
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                onChange={handleFileSelect}
              />
              {/* Paperclip button */}
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-9 border-r border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors shrink-0"
                title="Attach file"
              >
                <Paperclip size={11} />
              </button>
              {/* Text input */}
              <input
                ref={inputRef}
                type="text"
                placeholder="Type message… or @mention"
                value={inputValue}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                data-testid="input-chat-message"
                className="flex-1 bg-white px-3 py-2.5 text-xs focus:outline-none placeholder:text-muted-foreground font-sans text-foreground min-w-0"
              />
              {/* Send button */}
              <button
                onClick={handleSend}
                data-testid="button-send-message"
                className="w-9 bg-foreground text-white flex items-center justify-center hover:bg-accent transition-colors shrink-0"
              >
                <Send size={11} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Approval Request — grows to fill remaining space ── */}
      <div className="flex flex-col divide-y divide-border flex-1 min-h-0">
        <div className="px-5 py-4 flex items-center justify-between shrink-0">
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
          <div className="px-5 py-4 bg-primary/5 border-l-2 border-l-primary shrink-0">
            <div className="flex items-start gap-2.5">
              <CircleDashed size={13} className="text-primary animate-spin shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-primary">Awaiting Catarina's Approval</p>
                <p className="text-[10px] text-muted-foreground mt-1">Beach Pizza Cascais · Brand Strategy</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="px-5 py-4 bg-muted shrink-0">
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              Send to <span className="text-foreground font-semibold">Catarina Figueiredo</span> for sign-off before production begins.
            </p>
          </div>
        )}

        <div className="px-5 py-4 shrink-0">
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
    <div className={`px-5 py-3 flex gap-2.5 ${isSelf ? "bg-muted/60 flex-row-reverse" : isSystem ? "bg-primary/5 border-l-2 border-l-primary" : "bg-white"}`}>
      <div className={`w-6 h-6 ${bg} flex items-center justify-center text-[9px] font-bold shrink-0`}>
        {initials}
      </div>
      <div className={`flex flex-col flex-1 min-w-0 ${isSelf ? "items-end" : "items-start"}`}>
        <span className={`text-[9px] font-bold uppercase tracking-wider mb-0.5 ${isSystem ? "text-primary" : "text-muted-foreground"}`}>{name}</span>
        <p className={`text-xs leading-relaxed break-words ${isSystem ? "text-primary font-medium" : "text-foreground"}`}>{message}</p>
      </div>
    </div>
  );
}
