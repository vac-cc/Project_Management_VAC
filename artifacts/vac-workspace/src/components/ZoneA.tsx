import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Globe, FileText, Shield, Building2, MapPin, X, Folder, Type, Video } from "lucide-react";
import { SiInstagram, SiTiktok, SiGoogle } from "react-icons/si";

const collaborators = [
  { initials: "CF", name: "Catarina Figueiredo", role: "Creative Director", email: "catarina@vac-cc.com", color: "bg-accent text-black" },
  { initials: "MS", name: "Miguel Santos", role: "Strategy Lead", email: "miguel@vac-cc.com", color: "bg-primary text-white" },
  { initials: "JP", name: "João Pereira", role: "Art Director", email: "joao@vac-cc.com", color: "bg-muted text-foreground" },
  { initials: "AL", name: "Ana Lima", role: "Account Manager", email: "ana@vac-cc.com", color: "bg-card text-foreground border border-border" },
];

export default function ZoneA() {
  const [activeCollaborator, setActiveCollaborator] = useState<typeof collaborators[0] | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        setActiveCollaborator(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="w-[320px] h-full border-r border-border flex flex-col bg-background shrink-0 overflow-y-auto"
    >
      <div className="p-6 pb-0">
        {/* Client Header */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold uppercase tracking-wide">Beach Pizza Cascais</h2>
          <div className="flex items-center gap-2 mt-1.5">
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            <p className="text-xs text-muted-foreground font-semibold">Active Project · Brand Strategy</p>
          </div>

          {/* Social quick-access icons */}
          <div className="flex gap-2 mt-4 flex-wrap">
            <SocialIcon icon={Globe} label="Website" />
            <SocialIcon icon={SiInstagram} label="Instagram" />
            <SocialIcon icon={SiTiktok} label="TikTok" />
            <SocialIcon icon={SiGoogle} label="Google" />
          </div>
        </div>

        {/* Collaborators */}
        <div className="mb-6">
          <h3 className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-3">Collaborators</h3>
          <div className="flex gap-2.5">
            {collaborators.map((c, i) => (
              <CollaboratorAvatar
                key={i}
                collaborator={c}
                onClick={() => setActiveCollaborator(c)}
              />
            ))}
          </div>
        </div>

        {/* Agreements (formerly Production Vault) */}
        <div className="mb-6">
          <h3 className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-3">Agreements</h3>
          <div className="grid grid-cols-2 gap-2.5">
            <VaultCard icon={FileText} title="Client Contract" />
            <VaultCard icon={Shield} title="NDA Agreement" />
            <VaultCard icon={Building2} title="CML License" />
            <VaultCard icon={MapPin} title="EMEL Parking" />
          </div>
        </div>

        {/* Asset Library (relocated from Zone C) */}
        <div className="mb-6">
          <h3 className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-3">Asset Library</h3>
          <div className="flex flex-col gap-2">
            <FolderCard icon={Folder} title="Logos & Icons" count="24 files" />
            <FolderCard icon={Type} title="Typography" count="8 files" />
            <FolderCard icon={Video} title="Raw Video Footage" count="12 files" />
          </div>
        </div>
      </div>

      {/* Collaborator Modal */}
      <AnimatePresence>
        {activeCollaborator && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              ref={modalRef}
              initial={{ opacity: 0, scale: 0.92, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 8 }}
              transition={{ duration: 0.2 }}
              className="bg-[#121212] border border-border rounded-2xl p-8 w-[320px] relative shadow-2xl"
            >
              <button
                onClick={() => setActiveCollaborator(null)}
                className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
                data-testid="button-close-collaborator-modal"
              >
                <X size={16} />
              </button>

              <div className={`w-14 h-14 rounded-full ${activeCollaborator.color} flex items-center justify-center text-xl font-bold mb-5`}>
                {activeCollaborator.initials}
              </div>

              <h3 className="text-lg font-bold uppercase tracking-wide">{activeCollaborator.name}</h3>
              <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mt-1 mb-4">{activeCollaborator.role}</p>

              <div className="border-t border-border pt-4">
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold mb-1">Email</p>
                <p className="text-sm font-medium">{activeCollaborator.email}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function SocialIcon({ icon: Icon, label }: { icon: any; label: string }) {
  return (
    <a
      href="#"
      title={label}
      data-testid={`link-social-${label.toLowerCase()}`}
      className="w-9 h-9 rounded-xl bg-card border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-muted-foreground transition-all duration-200"
    >
      <Icon size={15} />
    </a>
  );
}

function CollaboratorAvatar({ collaborator, onClick }: { collaborator: typeof collaborators[0]; onClick: () => void }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div className="relative" onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
      <button
        onClick={onClick}
        data-testid={`avatar-collaborator-${collaborator.initials}`}
        className={`w-9 h-9 rounded-full ${collaborator.color} flex items-center justify-center text-xs font-bold relative hover:ring-2 hover:ring-white/20 transition-all duration-200 cursor-pointer`}
      >
        {collaborator.initials}
        <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-accent border-2 border-background animate-pulse" />
      </button>

      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.15 }}
            className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50 pointer-events-none"
          >
            <div className="bg-[#1a1a1a] border border-border text-white text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1.5 rounded-lg whitespace-nowrap shadow-xl">
              {collaborator.name}
            </div>
            <div className="w-2 h-2 bg-[#1a1a1a] border-r border-b border-border rotate-45 mx-auto -mt-1" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function VaultCard({ icon: Icon, title }: { icon: any; title: string }) {
  return (
    <div className="bg-card border border-border rounded-xl p-3.5 flex flex-col items-start gap-2.5 hover:-translate-y-1 hover:border-muted-foreground transition-all duration-200 cursor-pointer group">
      <div className="w-7 h-7 rounded-lg bg-background border border-border flex items-center justify-center text-muted-foreground group-hover:text-foreground transition-colors">
        <Icon size={14} />
      </div>
      <div>
        <p className="text-[11px] font-semibold leading-tight">{title}</p>
        <p className="text-[9px] text-muted-foreground mt-1 uppercase tracking-wider font-bold">View →</p>
      </div>
    </div>
  );
}

function FolderCard({ icon: Icon, title, count }: { icon: any; title: string; count: string }) {
  return (
    <div className="bg-card border border-border rounded-xl p-3.5 flex items-center gap-3 hover:border-muted-foreground transition-colors cursor-pointer group">
      <div className="w-8 h-8 rounded-lg bg-background flex items-center justify-center text-muted-foreground group-hover:text-foreground transition-colors shrink-0 border border-border/50">
        <Icon size={16} />
      </div>
      <div className="min-w-0 flex-1">
        <h3 className="font-semibold text-xs truncate">{title}</h3>
        <p className="text-[10px] text-muted-foreground mt-0.5">{count}</p>
      </div>
    </div>
  );
}
