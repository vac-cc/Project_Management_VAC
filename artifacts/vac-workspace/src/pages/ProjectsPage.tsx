import React, { useState, useMemo, useEffect } from "react";
import { useSearch } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, Calendar, DollarSign, Tag, ArrowLeft } from "lucide-react";
import ZoneA from "../components/ZoneA";
import ZoneB from "../components/ZoneB";
import ZoneC from "../components/ZoneC";

// ── Types ────────────────────────────────────────────────────

export type ProjectStatus = "active" | "past" | "not-started";

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
  freelancerCosts?: { name: string; amount: string }[];
}

// ── Seed Data ────────────────────────────────────────────────

export const PROJECTS: Project[] = [
  {
    id: "BPC-001",
    client: "Beach Pizza",
    clientId: "BPC",
    clientAccent: "#99CC33",
    title: "Brand Book",
    brief: "Consolidation of brand story, identity rules, brand values and visual standards — built to support future franchise expansion.",
    tags: ["Brand Strategy", "Identity"],
    budget: "€150",
    crew: ["CP"],
    status: "past",
    milestones: [{ label: "Start", date: "Mar 2026" }],
    deliverables: [],
    notes: "",
  },
  {
    id: "BPC-002",
    client: "Beach Pizza",
    clientId: "BPC",
    clientAccent: "#99CC33",
    title: "Cavalete",
    brief: "Design and brand integration for a cavalete to promote summer products in-store.",
    tags: ["Design", "Print"],
    budget: "€120",
    crew: ["AA", "CP"],
    status: "active",
    milestones: [{ label: "Start", date: "Jun 2026" }],
    deliverables: [],
    notes: "",
  },
  {
    id: "SML-001",
    client: "Samuel",
    clientId: "SML",
    clientAccent: "#99CC33",
    title: "Naming & Branding",
    brief: "Development of brand naming and visual identity — naming creation, logo selection and brand foundations.",
    tags: ["Naming", "Branding"],
    budget: "€800",
    crew: ["PO", "CP", "IF"],
    status: "active",
    milestones: [{ label: "Start", date: "May 2026" }],
    deliverables: [],
    notes: "",
    freelancerCosts: [
      { name: "Pedro Oliveira", amount: "€700" },
      { name: "Íris Filipe", amount: "€240" },
    ],
  },
  {
    id: "SML-002",
    client: "Samuel",
    clientId: "SML",
    clientAccent: "#99CC33",
    title: "Digital & Applications",
    brief: "Brand application strategy, website development and copy, and social media content strategy.",
    tags: ["Branding Applications", "Website", "Social Media"],
    budget: "€800",
    crew: ["PO", "CP"],
    status: "not-started",
    milestones: [{ label: "Start", date: "Aug 2026" }],
    deliverables: [],
    notes: "",
  },
];

// ── Crew palette (mirrors ASSIGNEE_PALETTE) ──────────────────
const CREW_COLORS: Record<string, { bg: string; text: string }> = {
  PO: { bg: "#99CC33", text: "#000" },
  CP: { bg: "#BF5700", text: "#fff" },
  AA: { bg: "#1a1a1a", text: "#fff" },
  IF: { bg: "#4a4a4a", text: "#fff" },
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
            {project.status === "active" ? "Active" : project.status === "past" ? "Completed" : "Not Yet Started"}
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
  const search = useSearch();

  // Deep-link support — e.g. clicking a collaborator on the Dashboard's
  // Active Crew Blueprint navigates to /projects?project=<id>, which opens
  // that project's drilldown (and its scoped Zone C chat) directly.
  useEffect(() => {
    const params = new URLSearchParams(search);
    const projectId = params.get("project");
    if (!projectId) return;
    const match = PROJECTS.find((p) => p.id === projectId);
    if (match) setSelected(match);
  }, [search]);

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
  const notStarted = filtered.filter((p) => p.status === "not-started");

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
            {active.length} Active · {notStarted.length} Not Started · {past.length} Past
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

          {/* Not yet started projects */}
          {notStarted.length > 0 && (
            <div className={`${active.length > 0 ? "mb-10" : ""}`}>
              <SectionLabel>Not Yet Started — {notStarted.length}</SectionLabel>
              <div className="grid grid-cols-3 gap-4">
                <AnimatePresence mode="popLayout">
                  {notStarted.map((p) => (
                    <ProjectCard key={p.id} project={p} onOpen={setSelected} />
                  ))}
                </AnimatePresence>
              </div>
            </div>
          )}

          {/* Divider */}
          {notStarted.length > 0 && past.length > 0 && (
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
