import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Globe, FileText, Shield, Building2, MapPin,
  X, Folder, Type, Video, Download, ExternalLink,
} from "lucide-react";
import { SiInstagram, SiTiktok, SiGoogle } from "react-icons/si";
import { PATTERN_BANK, ASSIGNEE_PALETTE, type PatternEntry } from "../data/assigneePalette";

// Zone A palette: inherits ZoneB's ASSIGNEE_PALETTE + adds Ana Lima (P6 Crosshatch)
const ZONE_A_PALETTE: Record<string, PatternEntry> = {
  ...ASSIGNEE_PALETTE,
  AL: PATTERN_BANK.crosshatchTerracotta,
};

const COLLABORATORS = [
  { initials: "CF", name: "Catarina Figueiredo", role: "Creative Director", email: "catarina@vac-cc.com", key: "Catarina" },
  { initials: "MS", name: "Miguel Santos",       role: "Strategy Lead",     email: "miguel@vac-cc.com",   key: "Miguel"   },
  { initials: "JP", name: "João Pereira",        role: "Art Director",      email: "joao@vac-cc.com",     key: "JP"       },
  { initials: "AL", name: "Ana Lima",            role: "Account Manager",   email: "ana@vac-cc.com",      key: "AL"       },
];

const BRIEF_ITEMS = [
  "Brand Identity Layout",
  "Visual Language System",
  "Packaging Specifications",
  "Social Media Templates",
  "Campaign Brief — Summer 2026",
];

const AGREEMENT_ITEMS = [
  { icon: FileText,  title: "Client Contract" },
  { icon: Shield,    title: "NDA Agreement"   },
  { icon: Building2, title: "CML License"     },
  { icon: MapPin,    title: "EMEL Parking"    },
];

type ActiveCollaborator = typeof COLLABORATORS[0];
type DocModal = { title: string };

export default function ZoneA() {
  const [activeCollaborator, setActiveCollaborator] = useState<ActiveCollaborator | null>(null);
  const [docModal, setDocModal] = useState<DocModal | null>(null);
  const collaboratorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onOutside(e: MouseEvent) {
      if (collaboratorRef.current && !collaboratorRef.current.contains(e.target as Node)) {
        setActiveCollaborator(null);
      }
    }
    document.addEventListener("mousedown", onOutside);
    return () => document.removeEventListener("mousedown", onOutside);
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
          <p className="text-xs text-muted-foreground font-medium mt-1.5">Brand Strategy</p>
          <div className="flex gap-1.5 mt-4">
            <SocialIcon icon={Globe}       label="Website"   />
            <SocialIcon icon={SiInstagram} label="Instagram" />
            <SocialIcon icon={SiTiktok}    label="TikTok"    />
            <SocialIcon icon={SiGoogle}    label="Google"    />
          </div>
        </div>

        {/* Collaborators — pattern avatars synced with Zone B timeline */}
        <div className="px-6 py-5">
          <SectionLabel>Collaborators</SectionLabel>
          <div className="flex gap-2 mt-4">
            {COLLABORATORS.map((c) => (
              <CollaboratorAvatar
                key={c.key}
                collaborator={c}
                palette={ZONE_A_PALETTE[c.key]}
                onClick={() => setActiveCollaborator(c)}
              />
            ))}
          </div>
        </div>

        {/* Brief — new section above Agreements */}
        <div className="px-6 py-5">
          <SectionLabel>Brief</SectionLabel>
          <div className="flex flex-col border border-border divide-y divide-border mt-4">
            {BRIEF_ITEMS.map((item) => (
              <div
                key={item}
                className="px-4 py-3 flex items-center justify-between bg-white hover:bg-muted transition-colors group"
              >
                <p className="text-[11px] font-bold text-foreground leading-tight">{item}</p>
                <button
                  onClick={() => setDocModal({ title: item })}
                  className="text-[9px] font-bold text-accent uppercase tracking-wider hover:text-foreground transition-colors shrink-0 ml-3"
                >
                  View →
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Agreements */}
        <div className="px-6 py-5">
          <SectionLabel>Agreements</SectionLabel>
          <div className="grid grid-cols-2 gap-px mt-4 border border-border">
            {AGREEMENT_ITEMS.map(({ icon, title }) => (
              <VaultCard
                key={title}
                icon={icon}
                title={title}
                onView={() => setDocModal({ title })}
              />
            ))}
          </div>
        </div>

        {/* Asset Library */}
        <div className="px-6 py-5">
          <SectionLabel>Asset Library</SectionLabel>
          <div className="flex flex-col border border-border divide-y divide-border mt-4">
            <FolderCard icon={Folder} title="Logos & Icons"    count="24 files" />
            <FolderCard icon={Type}   title="Typography"        count="8 files"  />
            <FolderCard icon={Video}  title="Raw Video Footage" count="12 files" />
          </div>
        </div>

      </div>

      {/* Collaborator modal */}
      <AnimatePresence>
        {activeCollaborator && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/30"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              ref={collaboratorRef}
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

              <div
                className="w-12 h-12 flex items-center justify-center text-base font-bold mb-5"
                style={{
                  ...ZONE_A_PALETTE[activeCollaborator.key].bar,
                  color: ZONE_A_PALETTE[activeCollaborator.key].text,
                }}
              >
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

      {/* Document preview modal */}
      <AnimatePresence>
        {docModal && (
          <DocumentModal title={docModal.title} onClose={() => setDocModal(null)} />
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function DocumentModal({ title, onClose }: { title: string; onClose: () => void }) {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.97, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.97, y: 12 }}
        transition={{ duration: 0.18 }}
        className="bg-white border border-black/10 flex flex-col shadow-2xl"
        style={{ width: 700, height: "82vh" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal header bar */}
        <div className="bg-foreground px-6 py-4 flex items-center justify-between shrink-0">
          <div>
            <p className="text-[9px] font-bold text-white/40 uppercase tracking-[0.16em]">/ Document Preview</p>
            <h3 className="text-sm font-bold text-white tracking-tight mt-0.5">{title}</h3>
          </div>
          <div className="flex items-center gap-2">
            <a
              href="#"
              download
              onClick={(e) => e.preventDefault()}
              className="flex items-center gap-1.5 px-3 py-1.5 border border-white/20 text-[9px] font-bold text-white uppercase tracking-wider hover:bg-white hover:text-foreground transition-colors"
            >
              <Download size={9} />
              Download
            </a>
            <a
              href="#"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 border border-white/20 text-[9px] font-bold text-white uppercase tracking-wider hover:bg-white hover:text-foreground transition-colors"
            >
              <ExternalLink size={9} />
              Open in New Tab
            </a>
            <button
              onClick={onClose}
              className="w-7 h-7 border border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-foreground transition-colors ml-1"
            >
              <X size={12} />
            </button>
          </div>
        </div>

        {/* Document canvas */}
        <div className="flex-1 overflow-y-auto bg-[#f2f2f2] p-8">
          <div className="bg-white border border-black/8 max-w-[520px] mx-auto px-12 py-10 min-h-full">

            {/* Letterhead */}
            <div className="flex items-start justify-between pb-7 mb-7 border-b border-black/10">
              <div>
                <p className="text-lg font-bold tracking-tight text-foreground" style={{ letterSpacing: "-0.02em" }}>VĀC</p>
                <p className="text-[9px] text-muted-foreground uppercase tracking-[0.16em] mt-0.5">Conscious Communication</p>
              </div>
              <div className="text-right">
                <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider">Ref: VAC-2026-0714</p>
                <p className="text-[9px] text-muted-foreground mt-1">Date: 1 Jul 2026 · Lisbon</p>
              </div>
            </div>

            {/* Doc title */}
            <h1 className="text-xl font-bold tracking-tight text-foreground mb-1">{title}</h1>
            <p className="text-[10px] text-muted-foreground mb-8 uppercase tracking-wider">
              Project: Beach Pizza Cascais · Brand Strategy 2026
            </p>

            {/* Simulated body sections */}
            {[
              { label: "1. Scope & Objectives", lines: [1, 0.95, 0.88, 1, 0.72] },
              { label: "2. Deliverables",       lines: [1, 0.80, 0.92, 0.65] },
              { label: "3. Timeline & Milestones", lines: [1, 0.78, 0.9, 1, 0.55] },
            ].map((section) => (
              <div key={section.label} className="mb-7">
                <p className="text-[10px] font-bold text-foreground uppercase tracking-wider mb-3">{section.label}</p>
                <div className="space-y-1.5">
                  {section.lines.map((w, i) => (
                    <div
                      key={i}
                      className="h-[7px] bg-foreground/8"
                      style={{ width: `${w * 100}%` }}
                    />
                  ))}
                </div>
              </div>
            ))}

            {/* Data table block */}
            <div className="border border-black/10 mt-2 mb-7">
              <div className="px-4 py-2 bg-foreground/4 border-b border-black/10">
                <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider">Budget Reference</p>
              </div>
              <div className="grid grid-cols-2 divide-x divide-black/10">
                {[["Approved Budget", "€45,000"], ["Estimated Costs", "€38,200"], ["Realized to Date", "€31,500"], ["Margin", "30%"]].map(([k, v]) => (
                  <div key={k} className="px-4 py-3 border-b border-black/10">
                    <p className="text-[8px] text-muted-foreground uppercase tracking-wider mb-1">{k}</p>
                    <p className="text-xs font-bold text-foreground">{v}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Signature area */}
            <div className="pt-7 mt-4 border-t border-black/10 flex items-end justify-between">
              <div>
                <div className="h-5 w-32 border-b border-foreground/40 mb-1.5" />
                <p className="text-[8px] text-muted-foreground uppercase tracking-wider">Authorized Signature</p>
              </div>
              <div className="text-right">
                <div className="h-5 w-24 border-b border-foreground/40 mb-1.5" />
                <p className="text-[8px] text-muted-foreground uppercase tracking-wider">Date</p>
              </div>
            </div>

          </div>
        </div>
      </motion.div>
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

function SocialIcon({ icon: Icon, label }: { icon: React.ElementType; label: string }) {
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

function CollaboratorAvatar({
  collaborator,
  palette,
  onClick,
}: {
  collaborator: typeof COLLABORATORS[0];
  palette: PatternEntry;
  onClick: () => void;
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      className="relative"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <button
        onClick={onClick}
        data-testid={`avatar-collaborator-${collaborator.initials}`}
        className="w-9 h-9 flex items-center justify-center text-xs font-bold cursor-pointer relative hover:opacity-80 transition-opacity border border-black/10"
        style={{ ...palette.bar, color: palette.text }}
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

function VaultCard({ icon: Icon, title, onView }: { icon: React.ElementType; title: string; onView: () => void }) {
  return (
    <div className="bg-white p-4 flex flex-col gap-3 hover:bg-muted transition-colors cursor-pointer group border-r border-b border-border last:border-r-0">
      <Icon size={13} className="text-muted-foreground group-hover:text-foreground transition-colors" />
      <div>
        <p className="text-[11px] font-bold leading-tight text-foreground">{title}</p>
        <button
          onClick={onView}
          className="text-[9px] text-accent mt-1 font-bold tracking-wider uppercase hover:text-foreground transition-colors"
        >
          View →
        </button>
      </div>
    </div>
  );
}

function FolderCard({ icon: Icon, title, count }: { icon: React.ElementType; title: string; count: string }) {
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
