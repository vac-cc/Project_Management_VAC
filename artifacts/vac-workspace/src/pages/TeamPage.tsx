import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, FileText, Search, X, Upload } from "lucide-react";
import { PATTERN_BANK, type PatternEntry } from "../data/assigneePalette";

// ── Types ────────────────────────────────────────────────────
type ExpertiseCategory = "Design" | "Strategy" | "Production" | "Management" | "Copywriting";

interface TeamMember {
  id: string;
  initials: string;
  name: string;
  role: string;
  expertiseCategory: ExpertiseCategory;
  expertise: string;
  email: string;
  phone: string;
  skills: string[];
  bio: string;
  cv: string;
  portfolio: string;
  projects: string[];
}

// ── Chromatic expertise coding ────────────────────────────────
// Rule 1 — Solid brand colors for dominant roles
// Rule 2 — High-contrast neutrals next
// Rule 3 — Pattern fallback (unused at current team size)
const EXPERTISE_PALETTE: Record<ExpertiseCategory, { bg: string; text: string }> = {
  Design:      { bg: "#99CC33", text: "#000000" },  // Leaf Green — text black
  Strategy:    { bg: "#BF5700", text: "#ffffff" },  // Terracotta — text white
  Production:  { bg: "#1a1a1a", text: "#ffffff" },  // Pure Black — text white
  Management:  { bg: "#4a4a4a", text: "#ffffff" },  // Dark Gray — text white
  Copywriting: { bg: "#e2e2e2", text: "#000000" },  // Light Gray — text black
};

// ── Seed data ────────────────────────────────────────────────
const SEED_TEAM: TeamMember[] = [
  {
    id: "CF",
    initials: "CF",
    name: "Catarina Figueiredo",
    role: "Creative Director",
    expertiseCategory: "Design",
    expertise: "Brand Strategy & Art Direction",
    email: "c.figueiredo@vac.studio",
    phone: "+351 912 345 001",
    skills: ["Brand Architecture", "Art Direction", "Campaign Design", "Visual Identity", "Brand Positioning"],
    bio: "A creative strategist with 12+ years shaping visual identities for European brands. Catarina leads with intuition, anchoring every project in cultural context and long-term brand equity. Former Creative Lead at BBDO Lisbon.",
    cv: "#", portfolio: "#",
    projects: [
      "Beach Pizza Cascais — Brand Strategy",
      "Lisbon Surf House — Brand Identity",
      "Comporta Fine Stays — Visual Identity Refresh",
    ],
  },
  {
    id: "MS",
    initials: "MS",
    name: "Miguel Santos",
    role: "Senior Designer",
    expertiseCategory: "Design",
    expertise: "Visual Design & Motion",
    email: "m.santos@vac.studio",
    phone: "+351 912 345 002",
    skills: ["Visual Design", "Motion Graphics", "Illustration", "Typography", "UI Systems"],
    bio: "Miguel translates strategy into precise, resonant form. His background in fine arts informs a design practice that is both systematic and emotionally alive. He has led visual systems for 40+ brand launches.",
    cv: "#", portfolio: "#",
    projects: [
      "Beach Pizza Cascais — Summer Campaign",
      "Estuário Studio — Brand Communication Audit",
      "Comporta Fine Stays — Print Collateral Suite",
    ],
  },
  {
    id: "JP",
    initials: "JP",
    name: "João Pereira",
    role: "Digital Strategist",
    expertiseCategory: "Strategy",
    expertise: "Digital & Content Strategy",
    email: "j.pereira@vac.studio",
    phone: "+351 912 345 003",
    skills: ["Social Media Strategy", "SEO & SEM", "Content Architecture", "Analytics", "Paid Media"],
    bio: "JP bridges brand voice with digital performance. A former data analyst turned strategist, he builds content ecosystems that perform across platforms without sacrificing editorial quality.",
    cv: "#", portfolio: "#",
    projects: [
      "Estuário Studio — Digital Strategy & SEO",
      "Lisbon Surf House — Digital Presence",
      "Comporta Fine Stays — Autumn Social Campaign",
    ],
  },
  {
    id: "AL",
    initials: "AL",
    name: "Ana Lima",
    role: "Account Manager",
    expertiseCategory: "Management",
    expertise: "Client Relations & Brand Consulting",
    email: "a.lima@vac.studio",
    phone: "+351 912 345 004",
    skills: ["Client Management", "Project Delivery", "Brand Consulting", "Budgeting", "Stakeholder Communication"],
    bio: "Ana is the connective tissue between agency vision and client reality. Meticulous, warm, and strategically sharp, she ensures every deliverable lands with precision and every client relationship deepens over time.",
    cv: "#", portfolio: "#",
    projects: [
      "Beach Pizza Cascais — Account Lead",
      "Comporta Fine Stays — Account Lead",
      "Lisbon Surf House — Account Lead",
      "Estuário Studio — Account Lead",
    ],
  },
  {
    id: "MR",
    initials: "MR",
    name: "Marta Rodrigues",
    role: "Senior Copywriter",
    expertiseCategory: "Copywriting",
    expertise: "Brand Language & Editorial",
    email: "m.rodrigues@vac.studio",
    phone: "+351 912 345 005",
    skills: ["Brand Copywriting", "Tone of Voice", "Editorial Strategy", "Naming", "Campaign Concepts"],
    bio: "Marta crafts language that makes brands feel inevitable. She has written for luxury hospitality, F&B, and cultural institutions across Portugal and Spain, developing tone-of-voice guidelines used by entire creative teams.",
    cv: "#", portfolio: "#",
    projects: [
      "Beach Pizza Cascais — Tone of Voice Guide",
      "Comporta Fine Stays — Brand Manifesto",
      "Cortezi — Clothing Pop-Up Lisbon",
    ],
  },
  {
    id: "TC",
    initials: "TC",
    name: "Tiago Costa",
    role: "Creative Producer",
    expertiseCategory: "Production",
    expertise: "Photography & Video Production",
    email: "t.costa@vac.studio",
    phone: "+351 912 345 006",
    skills: ["Photography", "Video Production", "Post-Production", "Set Direction", "Content Direction"],
    bio: "Tiago's visual storytelling captures the authentic texture of a brand's world. Equally at home on editorial shoots and commercial sets, he produces content that performs without looking produced.",
    cv: "#", portfolio: "#",
    projects: [
      "Beach Pizza Cascais — Content Series Shoot",
      "Lisbon Surf House — Brand Photography",
      "Comporta Fine Stays — Seasonal Campaign Shoot",
    ],
  },
];

const EXPERTISE_FILTERS: ExpertiseCategory[] = ["Design", "Strategy", "Production", "Management", "Copywriting"];

// ── Team card ────────────────────────────────────────────────
function TeamCard({ member, index }: { member: TeamMember; index: number }) {
  const palette = EXPERTISE_PALETTE[member.expertiseCategory];
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28, delay: index * 0.05 }}
      className="border border-border bg-white flex flex-col"
    >
      {/* Chromatic expertise header */}
      <div
        className="h-[72px] flex items-end px-5 pb-4 relative overflow-hidden"
        style={{ background: palette.bg }}
      >
        {/* Role label — contrast-locked */}
        <span
          className="text-[10px] font-bold uppercase tracking-[0.2em]"
          style={{ color: palette.text === "#000000" ? "rgba(0,0,0,0.55)" : "rgba(255,255,255,0.65)" }}
        >
          {member.role}
        </span>
        {/* Initials badge — always white bg + black text for universal legibility */}
        <div className="absolute top-4 right-5 w-10 h-10 flex items-center justify-center text-[13px] font-bold bg-white border border-black/15 text-black">
          {member.initials}
        </div>
      </div>

      {/* Body */}
      <div className="px-5 py-5 flex-1 flex flex-col gap-4">
        {/* Name — large editorial scale */}
        <div>
          <h3 className="text-[17px] font-bold text-foreground tracking-tight leading-tight">{member.name}</h3>
          <p className="text-[10px] text-muted-foreground mt-1 uppercase tracking-wider">{member.expertise}</p>
        </div>

        {/* Contact ledger */}
        <div className="flex flex-col gap-1 border border-black/8 px-3 py-2.5 bg-muted/40">
          <div className="flex items-center gap-2">
            <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest w-5 shrink-0">EM</span>
            <span className="text-[10px] font-bold text-foreground">{member.email}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest w-5 shrink-0">PH</span>
            <span className="text-[10px] font-bold text-foreground">{member.phone}</span>
          </div>
        </div>

        {/* Skills */}
        <div className="flex flex-wrap gap-1.5">
          {member.skills.map((skill) => (
            <span key={skill} className="text-[9px] font-bold uppercase tracking-wider border border-black/10 px-2 py-0.5 text-muted-foreground">
              {skill}
            </span>
          ))}
        </div>

        {/* Bio */}
        <p className="text-[11px] text-muted-foreground leading-relaxed">{member.bio}</p>

        {/* Co-Created Projects ledger */}
        <div className="border-t border-border pt-3.5">
          <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-[0.14em] mb-2">/ Co-Created Projects</p>
          <div className="flex flex-col gap-1.5">
            {member.projects.map((p) => (
              <div key={p} className="flex items-center gap-1.5">
                <div className="w-1 h-1 shrink-0" style={{ background: palette.bg === "#e2e2e2" ? "#1a1a1a" : palette.bg }} />
                <span className="text-[10px] text-foreground leading-snug">{p}</span>
              </div>
            ))}
          </div>
        </div>

        {/* CV / Portfolio links */}
        <div className="flex items-center gap-3 pt-2 border-t border-border">
          <a href={member.cv} onClick={(e) => e.preventDefault()}
            className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-foreground hover:text-[#99CC33] transition-colors">
            <FileText size={10} />View CV
          </a>
          <span className="text-black/20">·</span>
          <a href={member.portfolio} onClick={(e) => e.preventDefault()}
            className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-foreground hover:text-[#99CC33] transition-colors">
            <ExternalLink size={10} />Portfolio
          </a>
        </div>
      </div>
    </motion.div>
  );
}

// ── Add Collaborator Modal ───────────────────────────────────
const EMPTY_FORM = { name: "", role: "", skills: "", bio: "", cv: "", portfolio: "" };

function AddCollaboratorModal({ onClose, onAdd }: { onClose: () => void; onAdd: (m: TeamMember) => void }) {
  const [mode, setMode] = useState<"manual" | "csv">("manual");
  const [form, setForm] = useState(EMPTY_FORM);
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [csvSuccess, setCsvSuccess] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleSubmit = () => {
    if (!form.name.trim() || !form.role.trim()) return;
    const initials = form.name.trim().split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();
    const newMember: TeamMember = {
      id: `new-${Date.now()}`,
      initials,
      name: form.name.trim(),
      role: form.role.trim(),
      expertiseCategory: "Design",
      expertise: form.role.trim(),
      email: "",
      phone: "",
      skills: form.skills.split(",").map((s) => s.trim()).filter(Boolean),
      bio: form.bio.trim(),
      cv: form.cv.trim() || "#",
      portfolio: form.portfolio.trim() || "#",
      projects: [],
    };
    onAdd(newMember);
    onClose();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file?.name.endsWith(".csv")) { setCsvFile(file); setCsvSuccess(true); }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) { setCsvFile(file); setCsvSuccess(true); }
  };

  const field = (label: string, key: keyof typeof EMPTY_FORM, placeholder: string, multiline = false) => (
    <div className="flex flex-col gap-1.5">
      <label className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">{label}</label>
      {multiline ? (
        <textarea rows={3} placeholder={placeholder} value={form[key]}
          onChange={(e) => setForm({ ...form, [key]: e.target.value })}
          className="border border-black/10 px-3 py-2.5 text-xs focus:outline-none focus:border-black text-foreground resize-none font-sans" />
      ) : (
        <input type="text" placeholder={placeholder} value={form[key]}
          onChange={(e) => setForm({ ...form, [key]: e.target.value })}
          className="border border-black/10 px-3 py-2.5 text-xs focus:outline-none focus:border-black text-foreground font-sans" />
      )}
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-8" onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, scale: 0.97, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.97 }}
        transition={{ duration: 0.2 }}
        className="bg-white w-full max-w-[640px] max-h-[85vh] flex flex-col border border-border"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-foreground px-6 py-4 flex items-center justify-between shrink-0">
          <span className="text-white font-bold text-sm uppercase tracking-widest">Add Collaborator</span>
          <button onClick={onClose} className="text-white/50 hover:text-white transition-colors"><X size={15} /></button>
        </div>
        <div className="flex border-b border-border shrink-0">
          {(["manual", "csv"] as const).map((m, i) => (
            <button key={m} onClick={() => setMode(m)}
              className={`flex-1 py-3 text-[10px] font-bold uppercase tracking-widest transition-colors ${i > 0 ? "border-l border-border" : ""} ${
                mode === m ? "border-b-2 border-b-[#99CC33] text-foreground bg-white" : "text-muted-foreground hover:text-foreground border-b-2 border-b-transparent"
              }`}>
              {m === "manual" ? "Manual Entry" : "Bulk CSV Import"}
            </button>
          ))}
        </div>
        <div className="flex-1 overflow-y-auto p-6">
          {mode === "manual" ? (
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-4">
                {field("Full Name", "name", "Catarina Figueiredo")}
                {field("Role / Job Title", "role", "Senior Designer")}
              </div>
              {field("Skills", "skills", "Brand Design, Illustration, Motion Graphics (comma-separated)")}
              {field("Short Bio", "bio", "Brief professional background…", true)}
              <div className="grid grid-cols-2 gap-4">
                {field("CV Link", "cv", "https://cv.example.com/…")}
                {field("Portfolio URL", "portfolio", "https://portfolio.example.com/…")}
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-5">
              <div
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                onClick={() => fileRef.current?.click()}
                className={`border-2 border-dashed flex flex-col items-center justify-center gap-3 py-12 cursor-pointer transition-colors ${
                  isDragging ? "border-[#99CC33] bg-[#99CC33]/5" : csvSuccess ? "border-[#99CC33]/50 bg-[#99CC33]/5" : "border-black/15 hover:border-black/30"
                }`}
              >
                <input ref={fileRef} type="file" accept=".csv" className="hidden" onChange={handleFileInput} />
                {csvSuccess ? (
                  <>
                    <div className="w-10 h-10 bg-[#99CC33] flex items-center justify-center">
                      <span className="text-white text-lg font-bold">✓</span>
                    </div>
                    <p className="text-[11px] font-bold text-[#99CC33] uppercase tracking-wider">{csvFile?.name} · Ready to import</p>
                  </>
                ) : (
                  <>
                    <Upload size={22} className="text-muted-foreground" />
                    <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Drag & Drop CSV File</p>
                    <p className="text-[10px] text-muted-foreground">or click to browse</p>
                  </>
                )}
              </div>
              <div className="border border-black/10 p-4 bg-muted">
                <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground mb-2">/ CSV Template Format</p>
                <code className="text-[10px] text-foreground leading-relaxed block font-mono">
                  name,role,skills,bio,cv_url,portfolio_url<br />
                  "Ana Sousa","PR Manager","PR, Press Relations","Bio text…","https://…","https://…"<br />
                  "Rui Faria","Developer","React, Node.js","Bio text…","https://…","https://…"
                </code>
                <p className="text-[9px] text-muted-foreground mt-2">Each row imports as one collaborator. Skills must be comma-separated within quotes.</p>
              </div>
            </div>
          )}
        </div>
        <div className="border-t border-border px-6 py-4 flex justify-end gap-3 shrink-0">
          <button onClick={onClose}
            className="px-5 py-2.5 text-[10px] font-bold uppercase tracking-widest border border-border text-muted-foreground hover:text-foreground transition-colors">
            Cancel
          </button>
          <button
            onClick={mode === "manual" ? handleSubmit : onClose}
            disabled={mode === "manual" && !form.name.trim()}
            className="px-6 py-2.5 text-[10px] font-bold uppercase tracking-widest bg-foreground text-white hover:bg-[#99CC33] transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
            {mode === "manual" ? "Add Collaborator" : csvSuccess ? "Import CSV" : "Close"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

// ── Main page ────────────────────────────────────────────────
export default function TeamPage() {
  const [team, setTeam]                       = useState<TeamMember[]>(SEED_TEAM);
  const [searchQuery, setSearchQuery]         = useState("");
  const [activeExpertise, setActiveExpertise] = useState<ExpertiseCategory | null>(null);
  const [showModal, setShowModal]             = useState(false);

  const filtered = team.filter((m) => {
    const q = searchQuery.toLowerCase();
    const matchSearch = !q || m.name.toLowerCase().includes(q) || m.role.toLowerCase().includes(q) || m.skills.some((s) => s.toLowerCase().includes(q));
    const matchExpertise = !activeExpertise || m.expertiseCategory === activeExpertise;
    return matchSearch && matchExpertise;
  });

  return (
    <div className="flex-1 h-full overflow-y-auto bg-background">

      {/* Sticky header */}
      <div className="sticky top-0 z-20 bg-white border-b border-border">

        {/* Title row — "/Human Resource" only, no subtitle */}
        <div className="px-10 py-5 flex items-center justify-between border-b border-border">
          <div className="flex items-center gap-2.5">
            <span className="text-[#99CC33] font-bold text-2xl leading-none">/</span>
            <span className="text-[13px] font-bold text-foreground uppercase tracking-[0.16em]">Human Resource</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider border border-border px-3 py-1.5">
              {team.length} Professionals
            </span>
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-1.5 bg-[#99CC33] text-black text-[10px] font-bold uppercase tracking-widest px-4 py-1.5 hover:bg-[#8ab82e] transition-colors"
            >
              <span className="text-[13px] leading-none font-bold">+</span> Add Collaborator
            </button>
          </div>
        </div>

        {/* Search + expertise filters */}
        <div className="px-10 py-3.5 flex items-center gap-3">
          <div className="flex items-center gap-2 border border-black/10 px-3 py-2 flex-1 max-w-xs">
            <Search size={12} className="text-muted-foreground shrink-0" />
            <input
              type="text"
              placeholder="Search by name, role, or skill…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-white text-xs focus:outline-none placeholder:text-muted-foreground font-sans text-foreground"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery("")} className="text-muted-foreground hover:text-foreground shrink-0"><X size={11} /></button>
            )}
          </div>

          <div className="w-px h-5 bg-black/10" />

          <div className="flex items-center gap-1.5">
            <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider mr-1">Expertise:</span>
            {EXPERTISE_FILTERS.map((f) => {
              const p = EXPERTISE_PALETTE[f];
              const isActive = activeExpertise === f;
              return (
                <button key={f} onClick={() => setActiveExpertise(isActive ? null : f)}
                  className="text-[9px] font-bold uppercase tracking-wider border px-2.5 py-1 transition-all duration-150"
                  style={isActive
                    ? { background: p.bg, color: p.text, borderColor: p.bg }
                    : { background: "transparent", color: "#6b6b6b", borderColor: "rgba(0,0,0,0.1)" }
                  }>
                  {f}
                </button>
              );
            })}
          </div>

          {(searchQuery || activeExpertise) && (
            <button
              onClick={() => { setSearchQuery(""); setActiveExpertise(null); }}
              className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider hover:text-foreground ml-auto flex items-center gap-1"
            >
              <X size={9} />Clear · {filtered.length} of {team.length}
            </button>
          )}
        </div>
      </div>

      {/* Card grid */}
      <div className="p-10">
        {filtered.length > 0 ? (
          <div className="grid grid-cols-3 gap-5">
            <AnimatePresence>
              {filtered.map((member, i) => (
                <TeamCard key={member.id} member={member} index={i} />
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">No results</p>
            <p className="text-[11px] text-muted-foreground mt-2">Try adjusting your search or filters.</p>
          </div>
        )}
      </div>

      <AnimatePresence>
        {showModal && <AddCollaboratorModal onClose={() => setShowModal(false)} onAdd={(m) => setTeam((p) => [...p, m])} />}
      </AnimatePresence>
    </div>
  );
}
