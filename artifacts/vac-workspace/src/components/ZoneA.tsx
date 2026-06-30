import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Globe, FileText, Shield, Building2, MapPin, X, Folder, Type, Video } from "lucide-react";
import { SiInstagram, SiTiktok, SiGoogle } from "react-icons/si";

const collaborators = [
  { initials: "CF", name: "Catarina Figueiredo", role: "Creative Director", email: "catarina@vac-cc.com", bg: "bg-accent text-white" },
  { initials: "MS", name: "Miguel Santos",       role: "Strategy Lead",       email: "miguel@vac-cc.com",   bg: "bg-primary text-white" },
  { initials: "JP", name: "João Pereira",        role: "Art Director",        email: "joao@vac-cc.com",     bg: "bg-foreground text-white" },
  { initials: "AL", name: "Ana Lima",            role: "Account Manager",     email: "ana@vac-cc.com",      bg: "bg-muted text-foreground border border-border" },
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
      transition={{ duration: 0.4, delay: 0.1 }}
      className="w-[300px] h-full border-r border-border flex flex-col bg-background shrink-0 overflow-y-auto"
    >
      <div className="flex flex-col divide-y divide-border">

        {/* Client Header */}
        <div className="px-6 py-6">
          <h2 className="text-xl font-bold tracking-tight leading-tight text-foreground">Beach Pizza Cascais</h2>
          <div className="flex items-center gap-2 mt-1.5">
            <span className="w-1.5 h-1.5 bg-accent" style={{ animation: "pulse 2s infinite" }} />
            <p className="text-xs text-muted-foreground font-medium">Active · Brand Strategy</p>
          </div>
          <div className="flex gap-1.5 mt-4">
            <SocialIcon icon={Globe}        label="Website"   />
            <SocialIcon icon={SiInstagram}  label="Instagram" />
            <SocialIcon icon={SiTiktok}     label="TikTok"    />
            <SocialIcon icon={SiGoogle}     label="Google"    />
          </div>
        </div>

        {/* Collaborators */}
        <div className="px-6 py-5">
          <SectionLabel>Collaborators</SectionLabel>
          <div className="flex gap-2 mt-4">
            {collaborators.map((c, i) => (
              <CollaboratorAvatar key={i} collaborator={c} onClick={() => setActiveCollaborator(c)} />
            ))}
          </div>
        </div>

        {/* Agreements */}
        <div className="px-6 py-5">
          <SectionLabel>Agreements</SectionLabel>
          <div className="grid grid-cols-2 gap-px mt-4 border border-border">
            <VaultCard icon={FileText}  title="Client Contract" />
            <VaultCard icon={Shield}    title="NDA Agreement"   />
            <VaultCard icon={Building2} title="CML License"     />
            <VaultCard icon={MapPin}    title="EMEL Parking"    />
          </div>
        </div>

        {/* Asset Library */}
        <div className="px-6 py-5">
          <SectionLabel>Asset Library</SectionLabel>
          <div className="flex flex-col border border-border divide-y divide-border mt-4">
            <FolderCard icon={Folder} title="Logos & Icons"      count="24 files" />
            <FolderCard icon={Type}   title="Typography"          count="8 files"  />
            <FolderCard icon={Video}  title="Raw Video Footage"   count="12 files" />
          </div>
        </div>

      </div>

      {/* Collaborator Modal */}
      <AnimatePresence>
        {activeCollaborator && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/30"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              ref={modalRef}
              initial={{ opacity: 0, scale: 0.96, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 8 }}
              transition={{ duration: 0.18 }}
              className="bg-white border border-border p-8 w-[300px] relative shadow-xl"
            >
              <button
                onClick={() => setActiveCollaborator(null)}
                className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
                data-testid="button-close-collaborator-modal"
              >
                <X size={14} />
              </button>

              <div className={`w-12 h-12 ${activeCollaborator.bg} flex items-center justify-center text-base font-bold mb-5`}>
                {activeCollaborator.initials}
              </div>

              <h3 className="text-sm font-bold tracking-tight text-foreground">{activeCollaborator.name}</h3>
              <p className="text-xs text-muted-foreground mt-1 mb-5">{activeCollaborator.role}</p>

              <div className="border-t border-border pt-4">
                <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider mb-1.5">Email</p>
                <p className="text-sm font-medium text-foreground">{activeCollaborator.email}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-accent font-bold text-sm leading-none">/</span>
      <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.14em]">{children}</span>
    </div>
  );
}

function SocialIcon({ icon: Icon, label }: { icon: any; label: string }) {
  return (
    <a
      href="#"
      title={label}
      data-testid={`link-social-${label.toLowerCase()}`}
      className="w-8 h-8 border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-foreground transition-all duration-150"
    >
      <Icon size={13} />
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
        className={`w-9 h-9 ${collaborator.bg} flex items-center justify-center text-xs font-bold cursor-pointer relative hover:opacity-80 transition-opacity`}
      >
        {collaborator.initials}
        <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 bg-accent border border-background" />
      </button>

      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.12 }}
            className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50 pointer-events-none"
          >
            <div className="bg-foreground text-white text-[10px] font-semibold px-2.5 py-1.5 whitespace-nowrap shadow-lg">
              {collaborator.name}
            </div>
            <div className="w-2 h-2 bg-foreground rotate-45 mx-auto -mt-1" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function VaultCard({ icon: Icon, title }: { icon: any; title: string }) {
  return (
    <div className="bg-white p-4 flex flex-col gap-3 hover:bg-muted transition-colors cursor-pointer group border-r border-b border-border last:border-r-0">
      <Icon size={13} className="text-muted-foreground group-hover:text-foreground transition-colors" />
      <div>
        <p className="text-[11px] font-bold leading-tight text-foreground">{title}</p>
        <p className="text-[9px] text-accent mt-1 font-bold tracking-wider uppercase">View →</p>
      </div>
    </div>
  );
}

function FolderCard({ icon: Icon, title, count }: { icon: any; title: string; count: string }) {
  return (
    <div className="bg-white p-3.5 flex items-center gap-3 hover:bg-muted transition-colors cursor-pointer group">
      <Icon size={13} className="text-muted-foreground group-hover:text-foreground transition-colors shrink-0" />
      <div className="min-w-0 flex-1">
        <h3 className="font-bold text-xs truncate text-foreground">{title}</h3>
        <p className="text-[10px] text-muted-foreground mt-0.5">{count}</p>
      </div>
    </div>
  );
}
