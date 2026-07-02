import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, Calendar, DollarSign, Tag, ArrowLeft } from "lucide-react";
import ZoneA from "../components/ZoneA";
import ZoneB from "../components/ZoneB";
import ZoneC from "../components/ZoneC";

// ── Types ────────────────────────────────────────────────────

export type ProjectStatus = "active" | "past";

export interface Milestone {
  label: string;
  date: string;
}

export interface Project {
  id: string;
  client: string;
  clientId: string;
  clientAccent: string;
  title: string;
  brief: string;
  tags: string[];
  budget: string;
  crew: string[];   // initials
  status: ProjectStatus;
  milestones: Milestone[];
  deliverables: string[];
  notes: string;
}

// ── Seed Data ────────────────────────────────────────────────

export const PROJECTS: Project[] = [
  // ── Active ──────────────────────────────────────────────────
  {
    id: "BPC-001",
    client: "Beach Pizza Cascais",
    clientId: "BPC",
    clientAccent: "#99CC33",
    title: "Brand Strategy Q3",
    brief: "Full Q3 brand positioning refresh — messaging architecture, visual tone update, and cross-channel communication rollout for the summer season.",
    tags: ["Branding", "Strategy"],
    budget: "€12,400",
    crew: ["CF", "JP"],
    status: "active",
    milestones: [
      { label: "Kick-off", date: "02 Jun 2026" },
      { label: "Strategy Deck Delivery", date: "20 Jun 2026" },
      { label: "Client Review", date: "28 Jun 2026" },
      { label: "Final Sign-off", date: "15 Jul 2026" },
    ],
    deliverables: [
      "Brand Messaging Architecture Document",
      "Q3 Visual Tone Guidelines (12pp)",
      "Campaign Concept Deck",
      "Channel Distribution Matrix",
    ],
    notes: "Client has requested all materials in both EN and PT. Review sessions are confirmed fortnightly on Fridays.",
  },
  {
    id: "BPC-002",
    client: "Beach Pizza Cascais",
    clientId: "BPC",
    clientAccent: "#99CC33",
    title: "Summer Event Campaign",
    brief: "Live event communications and on-site brand activation for the Beach Pizza Cascais summer pop-up series across three Cascais locations.",
    tags: ["Events", "Campaign", "Live Marketing"],
    budget: "€8,750",
    crew: ["CF", "MS"],
    status: "active",
    milestones: [
      { label: "Concept Approval", date: "10 Jun 2026" },
      { label: "Asset Production", date: "25 Jun 2026" },
      { label: "Event 1 — Praia da Rainha", date: "05 Jul 2026" },
      { label: "Event 2 — Cascais Marina", date: "19 Jul 2026" },
    ],
    deliverables: [
      "Event Brand Kit (Signage, Banners, Menus)",
      "Social Content Pack (30 assets)",
      "Photography Direction Brief",
      "Post-Event Report Template",
    ],
    notes: "All printed collateral must be approved 10 working days before each event date. Print liaison is Gráfica Estoril.",
  },
  {
    id: "LSH-001",
    client: "Lisbon Surf House",
    clientId: "LSH",
    clientAccent: "#BF5700",
    title: "Brand Identity Rollout",
    brief: "End-to-end visual identity implementation across all digital and physical touchpoints for the newly repositioned Lisbon Surf House brand.",
    tags: ["Branding", "Identity", "Digital"],
    budget: "€22,000",
    crew: ["CF", "MS", "JP"],
    status: "active",
    milestones: [
      { label: "Identity Handover", date: "01 Jun 2026" },
      { label: "Digital Assets Complete", date: "18 Jun 2026" },
      { label: "Physical Touchpoints Delivery", date: "30 Jun 2026" },
      { label: "Brand Launch", date: "12 Jul 2026" },
    ],
    deliverables: [
      "Master Brand Guidelines (40pp)",
      "Website Design System (Figma)",
      "Social Media Template Library",
      "Stationery & Signage Suite",
      "Brand Film Treatment (30s)",
    ],
    notes: "Rollout is time-sensitive — brand launch aligned to peak summer booking window. No scope creep.",
  },
  {
    id: "ES-001",
    client: "Estuário Studio",
    clientId: "ES",
    clientAccent: "#99CC33",
    title: "Digital Strategy & SEO",
    brief: "Strategic repositioning of Estuário Studio's digital presence — SEO architecture, content strategy, and portfolio UX redesign targeting international architecture clients.",
    tags: ["Digital", "Strategy", "SEO"],
    budget: "€9,500",
    crew: ["JP"],
    status: "active",
    milestones: [
      { label: "Audit Delivery", date: "05 Jun 2026" },
      { label: "Strategy Approval", date: "19 Jun 2026" },
      { label: "Implementation Begin", date: "01 Jul 2026" },
      { label: "Go-Live", date: "31 Jul 2026" },
    ],
    deliverables: [
      "SEO Technical Audit Report",
      "Content Architecture Map",
      "Keyword Strategy Document",
      "Portfolio UX Redesign Wireframes",
    ],
    notes: "Client is targeting English-speaking architecture press and international property developers in the EU.",
  },
  {
    id: "CFS-001",
    client: "Comporta Fine Stays",
    clientId: "CFS",
    clientAccent: "#BF5700",
    title: "Visual Identity Refresh",
    brief: "Systematic refinement of the Comporta Fine Stays visual identity — typography upgrade, colour system recalibration, and a new photography art direction standard.",
    tags: ["Branding", "Identity", "Art Direction"],
    budget: "€14,200",
    crew: ["CF", "MS"],
    status: "active",
    milestones: [
      { label: "Identity Audit", date: "08 Jun 2026" },
      { label: "Concept Presentation", date: "22 Jun 2026" },
      { label: "Refinement Round", date: "07 Jul 2026" },
      { label: "Final Delivery", date: "21 Jul 2026" },
    ],
    deliverables: [
      "Revised Brand Identity Deck",
      "New Photography Style Guide",
      "Updated Digital Asset Library",
      "Colour & Typography System Document",
    ],
    notes: "Must align with upcoming Autumn 2026 property listings. Photography shoot to be scheduled independently.",
  },
  {
    id: "CFS-002",
    client: "Comporta Fine Stays",
    clientId: "CFS",
    clientAccent: "#BF5700",
    title: "Autumn Social Campaign",
    brief: "Paid and organic social media campaign for the Comporta autumn season — content production, ad creative, and weekly channel management across Instagram and LinkedIn.",
    tags: ["Social", "Campaign", "Paid Media"],
    budget: "€11,800",
    crew: ["JP", "MS"],
    status: "active",
    milestones: [
      { label: "Campaign Brief Lock", date: "14 Jul 2026" },
      { label: "Content Production", date: "28 Jul 2026" },
      { label: "Campaign Launch", date: "01 Sep 2026" },
      { label: "Mid-Campaign Review", date: "15 Sep 2026" },
    ],
    deliverables: [
      "Campaign Strategy Deck",
      "60-Asset Content Library (Photo + Copy)",
      "Ad Creative Set (3 formats × 5 variants)",
      "Monthly Analytics Report Template",
    ],
    notes: "Media budget managed by client directly. VĀC responsible for creative and copy only.",
  },

  // ── Past ────────────────────────────────────────────────────
  {
    id: "BPC-P01",
    client: "Beach Pizza Cascais",
    clientId: "BPC",
    clientAccent: "#99CC33",
    title: "Social Content Series",
    brief: "12-week rolling social content production — photography, copy, and scheduling for Beach Pizza Cascais Instagram and Facebook channels.",
    tags: ["Content", "Social", "Production"],
    budget: "€6,200",
    crew: ["MS", "JP"],
    status: "past",
    milestones: [
      { label: "Content Calendar Agreed", date: "03 Jan 2026" },
      { label: "Week 6 Review", date: "14 Feb 2026" },
      { label: "Final Delivery", date: "28 Mar 2026" },
    ],
    deliverables: [
      "156 Instagram Posts (Photo + Copy)",
      "24 Instagram Stories Templates",
      "Monthly Performance Reports (3)",
    ],
    notes: "Project concluded on brief. Client extended retainer to new Social Content Series starting Q4.",
  },
  {
    id: "ES-P01",
    client: "Estuário Studio",
    clientId: "ES",
    clientAccent: "#99CC33",
    title: "Brand Communication Audit",
    brief: "Comprehensive brand communication audit — messaging consistency, tone of voice analysis, and competitive benchmarking against leading European architecture practices.",
    tags: ["Strategy", "Audit", "Branding"],
    budget: "€4,800",
    crew: ["CF", "JP"],
    status: "past",
    milestones: [
      { label: "Data Collection", date: "10 Feb 2026" },
      { label: "Analysis Complete", date: "24 Feb 2026" },
      { label: "Report Delivery", date: "05 Mar 2026" },
    ],
    deliverables: [
      "Brand Communication Audit Report (28pp)",
      "Tone of Voice Benchmark Analysis",
      "Recommended Messaging Framework",
    ],
    notes: "Audit findings directly informed the current Digital Strategy & SEO project scope.",
  },
  {
    id: "LSH-P01",
    client: "Lisbon Surf House",
    clientId: "LSH",
    clientAccent: "#BF5700",
    title: "Brand Photography Direction",
    brief: "Art direction and production management for Lisbon Surf House's inaugural brand photography shoot — 3 locations, 2-day production.",
    tags: ["Photography", "Production", "Art Direction"],
    budget: "€7,500",
    crew: ["MS", "CF"],
    status: "past",
    milestones: [
      { label: "Shot List Approved", date: "15 Jan 2026" },
      { label: "Production Days", date: "22–23 Jan 2026" },
      { label: "Selects Delivered", date: "04 Feb 2026" },
    ],
    deliverables: [
      "200 Selects (Hi-res RAW + Retouched)",
      "Brand Photography Usage Guide",
      "Location & Talent Release Documents",
    ],
    notes: "Final image library handed over to client. Usage rights: perpetual, worldwide, all media.",
  },
  {
    id: "CFS-P01",
    client: "Comporta Fine Stays",
    clientId: "CFS",
    clientAccent: "#BF5700",
    title: "Print Collateral Suite",
    brief: "Complete print design and production management for Comporta Fine Stays property materials — welcome packs, rate cards, and booking guides for all 12 properties.",
    tags: ["Print", "Production", "Design"],
    budget: "€9,100",
    crew: ["MS", "CF"],
    status: "past",
    milestones: [
      { label: "Design Approval", date: "08 Mar 2026" },
      { label: "Print Ready Files", date: "20 Mar 2026" },
      { label: "Delivery to Properties", date: "01 Apr 2026" },
    ],
    deliverables: [
      "Welcome Pack Design (12 property variants)",
      "Rate Card Template System",
      "Booking Guide (8pp Brochure)",
      "Print-Ready PDF Pack",
    ],
    notes: "Printed by Gráfica Torres (Comporta). 500 units per property.",
  },
  {
    id: "BPC-P02",
    client: "Beach Pizza Cascais",
    clientId: "BPC",
    clientAccent: "#99CC33",
    title: "Brand Identity",
    brief: "Original brand identity creation for Beach Pizza Cascais — logo system, colour palette, typography, and core brand assets from scratch.",
    tags: ["Branding", "Identity", "Design"],
    budget: "€14,500",
    crew: ["CF"],
    status: "past",
    milestones: [
      { label: "Discovery Workshop", date: "10 Sep 2025" },
      { label: "Concept Presentation", date: "25 Sep 2025" },
      { label: "Final Identity Delivery", date: "20 Oct 2025" },
    ],
    deliverables: [
      "Logo System (Primary + Alternates)",
      "Brand Identity Guidelines (32pp)",
      "Core Digital Asset Library",
      "Typography & Colour System",
    ],
    notes: "Founding identity project. All subsequent BPC projects derive from this brief.",
  },
  {
    id: "CFS-P02",
    client: "Comporta Fine Stays",
    clientId: "CFS",
    clientAccent: "#BF5700",
    title: "Launch Campaign",
    brief: "Full integrated launch campaign for the Comporta Fine Stays brand debut — strategy, creative, digital and OOH advertising across the Alentejo region.",
    tags: ["Campaign", "Events", "Digital", "OOH"],
    budget: "€18,400",
    crew: ["CF", "JP", "MS"],
    status: "past",
    milestones: [
      { label: "Campaign Strategy Lock", date: "01 Nov 2025" },
      { label: "Creative Production", date: "20 Nov 2025" },
      { label: "Campaign Launch", date: "01 Dec 2025" },
      { label: "Wrap Report", date: "15 Jan 2026" },
    ],
    deliverables: [
      "Integrated Campaign Strategy",
      "OOH Billboard Designs (4 formats)",
      "Digital Ad Creative Set",
      "PR Outreach Kit",
      "Post-Campaign Performance Report",
    ],
    notes: "Campaign delivered 340% above target reach in first 30 days. Became agency case study.",
  },
];

// ── Crew palette (mirrors ASSIGNEE_PALETTE) ──────────────────
const CREW_COLORS: Record<string, { bg: string; text: string }> = {
  CF: { bg: "#99CC33", text: "#000" },
  MS: { bg: "#BF5700", text: "#fff" },
  JP: { bg: "#1a1a1a", text: "#fff" },
  AL: { bg: "#4a90d9", text: "#fff" },
  RP: { bg: "#9b59b6", text: "#fff" },
  TC: { bg: "#e2e2e2", text: "#000" },
};

// ── Sub-components ───────────────────────────────────────────

function CrewBadge({ initials }: { initials: string }) {
  const c = CREW_COLORS[initials] ?? { bg: "#e2e2e2", text: "#000" };
  return (
    <span
      className="w-6 h-6 flex items-center justify-center text-[8px] font-bold border border-black/10"
      style={{ background: c.bg, color: c.text }}
    >
      {initials}
    </span>
  );
}

function TagChip({ label }: { label: string }) {
  return (
    <span className="text-[8px] font-bold uppercase tracking-wider border border-black/10 px-1.5 py-0.5 text-muted-foreground whitespace-nowrap">
      {label}
    </span>
  );
}

function ClientMonogram({ clientId, accent }: { clientId: string; accent: string }) {
  return (
    <div
      className="w-8 h-8 flex items-center justify-center text-[10px] font-bold border border-black/10 shrink-0"
      style={{ background: accent, color: accent === "#99CC33" ? "#000" : "#fff" }}
    >
      {clientId}
    </div>
  );
}

// ── Project Summary Card ─────────────────────────────────────

function ProjectCard({
  project,
  onOpen,
}: {
  project: Project;
  onOpen: (p: Project) => void;
}) {
  const isPast = project.status === "past";
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 4 }}
      transition={{ duration: 0.18 }}
      onClick={() => onOpen(project)}
      className={`border border-border bg-white flex flex-col cursor-pointer hover:border-black/30 transition-colors group ${isPast ? "opacity-60 hover:opacity-80" : ""}`}
    >
      {/* Accent header strip */}
      <div
        className="h-1 w-full"
        style={{ background: project.clientAccent }}
      />

      {/* Card body */}
      <div className="px-4 pt-4 pb-4 flex flex-col flex-1 gap-3">

        {/* Client row */}
        <div className="flex items-center gap-2">
          <ClientMonogram clientId={project.clientId} accent={project.clientAccent} />
          <span className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground leading-tight">
            {project.client}
          </span>
        </div>

        {/* Project title */}
        <div>
          <h3 className="text-[14px] font-bold text-foreground tracking-tight leading-snug group-hover:text-[#99CC33] transition-colors">
            {project.title}
          </h3>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1">
          {project.tags.map((t) => <TagChip key={t} label={t} />)}
        </div>

        {/* Brief */}
        <p className="text-[10px] text-muted-foreground leading-relaxed line-clamp-2 flex-1">
          {project.brief}
        </p>

        {/* Divider */}
        <div className="border-t border-border" />

        {/* Footer row: budget + timeline + crew */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider text-foreground">
              <DollarSign size={8} strokeWidth={2.5} />{project.budget}
            </span>
            <span className="flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider text-muted-foreground">
              <Calendar size={8} strokeWidth={2.5} />{project.milestones[0]?.date}
            </span>
          </div>
          <div className="flex items-center gap-0.5">
            {project.crew.map((c) => <CrewBadge key={c} initials={c} />)}
          </div>
        </div>

      </div>
    </motion.div>
  );
}

// ── Project Drilldown — full 3-zone workspace ────────────────

function ProjectDrilldown({
  project,
  onClose,
}: {
  project: Project;
  onClose: () => void;
}) {
  const [pendingCount, setPendingCount] = useState(0);

  const accentStyle =
    project.status === "active"
      ? { background: project.clientAccent, color: project.clientAccent === "#99CC33" ? "#000" : "#fff" }
      : { background: "#e2e2e2", color: "#1a1a1a" };

  return (
    <motion.div
      key={project.id}
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 40 }}
      transition={{ duration: 0.24, ease: "easeOut" }}
      className="absolute inset-0 z-40 bg-white flex flex-col"
    >
      {/* ── Drilldown header bar ── */}
      <div className="shrink-0 bg-white border-b border-border px-6 py-3 flex items-center justify-between gap-4">
        <button
          onClick={onClose}
          className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors whitespace-nowrap"
        >
          <ArrowLeft size={11} strokeWidth={2.5} />Back to Projects
        </button>

        {/* Project identity */}
        <div className="flex items-center gap-3 min-w-0">
          <ClientMonogram clientId={project.clientId} accent={project.clientAccent} />
          <div className="min-w-0">
            <p className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground truncate">{project.client}</p>
            <p className="text-[13px] font-bold text-foreground tracking-tight leading-tight truncate">{project.title}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          {project.tags.slice(0, 2).map((t) => <TagChip key={t} label={t} />)}
          <span
            className="text-[9px] font-bold uppercase tracking-wider px-2 py-1"
            style={accentStyle}
          >
            {project.status === "active" ? "Active" : "Completed"}
          </span>
          <span className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground border border-border px-2 py-1">
            {project.id}
          </span>
        </div>
      </div>

      {/* ── 3-zone workspace — exact dashboard layout ── */}
      <div className="flex flex-1 min-h-0 overflow-hidden">
        <ZoneA />
        <ZoneB onCostSubmitted={() => setPendingCount((n) => n + 1)} />
        <ZoneC pendingCount={pendingCount} />
      </div>
    </motion.div>
  );
}

// ── Section label ────────────────────────────────────────────

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 mb-4">
      <span className="text-[#99CC33] font-bold text-sm leading-none">/</span>
      <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.14em]">{children}</span>
    </div>
  );
}

// ── Main Page ────────────────────────────────────────────────

export default function ProjectsPage() {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Project | null>(null);

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return PROJECTS;
    return PROJECTS.filter(
      (p) =>
        p.client.toLowerCase().includes(q) ||
        p.title.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q))
    );
  }, [query]);

  const active = filtered.filter((p) => p.status === "active");
  const past = filtered.filter((p) => p.status === "past");

  return (
    <div className="relative flex-1 min-w-0 overflow-hidden flex flex-col h-full">

      {/* ── Main list view ── */}
      <div className="flex-1 overflow-y-auto">

        {/* Sticky header */}
        <div className="sticky top-0 z-20 bg-white border-b border-border px-8 py-4 flex items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <span className="text-[#99CC33] font-bold text-lg leading-none">/</span>
            <h1 className="text-[11px] font-bold uppercase tracking-[0.18em] text-foreground">Projects</h1>
          </div>
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search size={11} strokeWidth={2.5} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by client, project, or tag…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full border border-border pl-8 pr-8 py-2 text-[11px] font-bold placeholder:text-muted-foreground/50 placeholder:font-normal bg-white focus:outline-none focus:border-black/30 transition-colors"
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X size={10} strokeWidth={2.5} />
              </button>
            )}
          </div>
          <span className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground whitespace-nowrap">
            {active.length} Active · {past.length} Past
          </span>
        </div>

        <div className="px-8 py-8">

          {/* Active projects */}
          {active.length > 0 && (
            <div className="mb-10">
              <SectionLabel>Active Projects — {active.length}</SectionLabel>
              <div className="grid grid-cols-3 gap-4">
                <AnimatePresence mode="popLayout">
                  {active.map((p) => (
                    <ProjectCard key={p.id} project={p} onOpen={setSelected} />
                  ))}
                </AnimatePresence>
              </div>
            </div>
          )}

          {/* Divider */}
          {active.length > 0 && past.length > 0 && (
            <div className="border-t border-black/15 mb-10" />
          )}

          {/* Past projects */}
          {past.length > 0 && (
            <div>
              <SectionLabel>Past Projects — {past.length}</SectionLabel>
              <div className="grid grid-cols-3 gap-4">
                <AnimatePresence mode="popLayout">
                  {past.map((p) => (
                    <ProjectCard key={p.id} project={p} onOpen={setSelected} />
                  ))}
                </AnimatePresence>
              </div>
            </div>
          )}

          {/* Empty state */}
          {filtered.length === 0 && (
            <div className="flex flex-col items-center justify-center py-24 gap-3">
              <Tag size={20} strokeWidth={1.5} className="text-muted-foreground/30" />
              <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/40">No projects match "{query}"</p>
            </div>
          )}

        </div>
      </div>

      {/* ── Drilldown overlay ── */}
      <AnimatePresence>
        {selected && (
          <ProjectDrilldown
            key={selected.id}
            project={selected}
            onClose={() => setSelected(null)}
          />
        )}
      </AnimatePresence>

    </div>
  );
}
