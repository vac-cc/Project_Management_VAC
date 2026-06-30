import React from "react";
import { motion } from "framer-motion";
import { Folder, Type, Video, Send } from "lucide-react";

export default function ZoneC() {
  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="w-[300px] h-full border-l border-border bg-sidebar flex flex-col shrink-0"
    >
      {/* Top: Chat */}
      <div className="flex-1 flex flex-col min-h-0 border-b border-border">
        <div className="p-6 pb-4 border-b border-border/50 flex items-center justify-between">
          <h2 className="text-lg font-bold uppercase tracking-wide">Project Chat</h2>
          <div className="flex -space-x-2">
            <div className="w-6 h-6 rounded-full bg-accent border border-sidebar flex items-center justify-center text-[10px] font-bold text-black">CF</div>
            <div className="w-6 h-6 rounded-full bg-primary border border-sidebar flex items-center justify-center text-[10px] font-bold text-white">MS</div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4">
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
              className="w-full bg-card border border-border rounded-xl py-3 pl-4 pr-12 text-sm focus:outline-none focus:border-primary transition-colors font-sans"
            />
            <button className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg bg-primary text-white flex items-center justify-center hover:bg-primary/90 transition-colors">
              <Send size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Bottom: Drive */}
      <div className="p-6 h-[45%] flex flex-col bg-background">
        <h2 className="text-lg font-bold uppercase tracking-wide mb-6">Asset Library</h2>
        
        <div className="flex flex-col gap-3 flex-1 overflow-y-auto">
          <FolderCard icon={Folder} title="Logos & Icons" count="24 files" />
          <FolderCard icon={Type} title="Typography" count="8 files" />
          <FolderCard icon={Video} title="Raw Video Footage" count="12 files" />
        </div>
      </div>
    </motion.div>
  );
}

function ChatMessage({ initials, color, message, name, isSelf = false }: { initials: string, color: string, message: string, name: string, isSelf?: boolean }) {
  return (
    <div className={`flex gap-3 ${isSelf ? "flex-row-reverse" : ""}`}>
      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${color}`}>
        {initials}
      </div>
      <div className={`flex flex-col ${isSelf ? "items-end" : "items-start"}`}>
        <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold mb-1">{name}</span>
        <div className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed max-w-[200px] ${
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

function FolderCard({ icon: Icon, title, count }: { icon: any, title: string, count: string }) {
  return (
    <div className="bg-card border border-border rounded-xl p-4 flex items-center gap-4 hover:border-muted-foreground transition-colors cursor-pointer group">
      <div className="w-10 h-10 rounded-lg bg-background flex items-center justify-center text-muted-foreground group-hover:text-foreground transition-colors shrink-0 border border-border/50">
        <Icon size={20} />
      </div>
      <div className="min-w-0 flex-1">
        <h3 className="font-semibold text-sm truncate">{title}</h3>
        <p className="text-xs text-muted-foreground mt-0.5">{count}</p>
      </div>
    </div>
  );
}
