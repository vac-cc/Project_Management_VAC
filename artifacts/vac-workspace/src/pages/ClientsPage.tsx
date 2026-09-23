import React, { useState } from "react";
import { motion } from "framer-motion";
import { Globe, Instagram, Linkedin, ExternalLink, TrendingUp, FolderOpen, BarChart3 } from "lucide-react";

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 mb-1">
      <span className="text-[#99CC33] font-bold text-sm leading-none">/</span>
      <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.14em]">{children}</span>
    </div>
  );
}

export const CLIENTS = [
  {
    id: "BPC",
    name: "Beach Pizza",
    sector: "Food & Beverage",
    website: "not yet available",
    instagram: "not yet available",
    linkedin: "not applicable",
    contact: { name: "Not yet specified", email: "", phone: "" },
    bio: "",
    activeProjects: ["Brand Book", "Cavalete"],
    profit: "€270",
    projectCount: 2,
    accentColor: "#99CC33",
  },
  {
    id: "SML",
    name: "Samuel",
    sector: "Frutas e Legumes",
    website: "not yet available",
    instagram: "not yet available",
    linkedin: "not applicable",
    contact: { name: "Samuel Cristovão", email: "samuelrjcristovao@gmail.com", phone: "+351 912 059 628" },
    bio: "Samuel é uma marca de venda saloia de frutas e legumes. A VĀC desenvolve o projeto completo: naming, branding, logo, website, social media e aplicações de marca.",
    activeProjects: ["Naming & Branding"],
    profit: "€800",
    projectCount: 2,
    accentColor: "#99CC33",
  },
  {
    id: "CRZ",
    name: "Corteiz",
    sector: "Streetwear & Fashion",
    website: "corteiz.com",
    instagram: "@corteiz",
    linkedin: "not applicable",
    contact: { name: "Amna", email: "", phone: "WhatsApp only" },
    bio: "Corteiz is a global streetwear movement born in London in 2017, built on community, exclusivity and anti-conventional fashion culture. VĀC held local executive production coordination for the brand's 2026 Lisbon pop-up — space, set design, connectivity, green room and local hospitality.",
    activeProjects: [],
    profit: "€1,300",
    projectCount: 1,
    accentColor: "#99CC33",
  },
];

interface ClientBlockProps {
  client: (typeof CLIENTS)[0];
  index: number;
}

function ClientBlock({ client, index }: ClientBlockProps) {
  const [expanded, setExpanded] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.07 }}
      className="border border-border bg-white"
    >
      {/* Client header stripe */}
      <div
        className="h-1.5 w-full"
        style={{ background: client.accentColor }}
      />

      <div className="p-7">
        <div className="flex items-start justify-between gap-6">

          {/* Left: Identity */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-4 mb-4">
              {/* Logo placeholder */}
              <div
                className="w-14 h-14 border border-black/10 flex items-center justify-center text-[11px] font-bold shrink-0"
                style={{ color: client.accentColor, borderColor: `${client.accentColor}44`, background: `${client.accentColor}0d` }}
              >
                {client.id}
              </div>
              <div>
                <h2 className="text-base font-bold text-foreground tracking-tight">{client.name}</h2>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider mt-0.5">{client.sector}</p>
              </div>
            </div>

            {/* Bio */}
            <p className="text-[11px] text-muted-foreground leading-relaxed mb-4">{client.bio}</p>

            {/* Links row */}
            <div className="flex items-center gap-4 flex-wrap">
              <a
                href={`https://${client.website}`}
                onClick={(e) => e.preventDefault()}
                className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-foreground hover:text-[#99CC33] transition-colors"
              >
                <Globe size={10} />
                {client.website}
              </a>
              <a
                href="#"
                onClick={(e) => e.preventDefault()}
                className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors"
              >
                <Instagram size={10} />
                {client.instagram}
              </a>
              <a
                href="#"
                onClick={(e) => e.preventDefault()}
                className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors"
              >
                <Linkedin size={10} />
                {client.linkedin}
              </a>
            </div>
          </div>

          {/* Right: Metrics column */}
          <div className="flex flex-col gap-0 border border-border shrink-0 min-w-[220px]">
            {/* Metric: Profit */}
            <div className="px-5 py-4 border-b border-border">
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp size={10} className="text-muted-foreground" />
                <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider">Total Profit Generated</span>
              </div>
              <span className="text-xl font-bold" style={{ color: client.accentColor }}>{client.profit}</span>
            </div>
            {/* Metric: Project Count */}
            <div className="px-5 py-4 border-b border-border">
              <div className="flex items-center gap-2 mb-1">
                <BarChart3 size={10} className="text-muted-foreground" />
                <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider">Total Projects</span>
              </div>
              <span className="text-xl font-bold text-foreground">{String(client.projectCount).padStart(2, "0")}</span>
            </div>
            {/* Metric: Active Projects */}
            <div className="px-5 py-4">
              <div className="flex items-center gap-2 mb-2">
                <FolderOpen size={10} className="text-muted-foreground" />
                <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider">Active Projects</span>
              </div>
              <div className="flex flex-col gap-1">
                {client.activeProjects.map((p) => (
                  <div key={p} className="flex items-center gap-1.5">
                    <div className="w-1 h-1 shrink-0" style={{ background: client.accentColor }} />
                    <span className="text-[10px] font-bold text-foreground">{p}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Contact row */}
        <div className="mt-5 pt-5 border-t border-border flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div>
              <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider block mb-0.5">Primary Contact</span>
              <span className="text-[11px] font-bold text-foreground">{client.contact.name}</span>
            </div>
            <div>
              <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider block mb-0.5">Email</span>
              <a
                href={`mailto:${client.contact.email}`}
                className="text-[11px] font-bold text-foreground hover:text-[#99CC33] transition-colors"
              >
                {client.contact.email}
              </a>
            </div>
            <div>
              <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider block mb-0.5">Phone</span>
              <span className="text-[11px] font-bold text-foreground">{client.contact.phone}</span>
            </div>
          </div>
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-[9px] font-bold uppercase tracking-widest border border-border px-4 py-2 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            {expanded ? "Collapse" : "Full Profile →"}
          </button>
        </div>
      </div>
    </motion.div>
  );
}

export default function ClientsPage() {
  const totalProfit = CLIENTS.reduce((total, client) => total + Number(client.profit.replace(/[^0-9]/g, "")), 0);
  const totalProjects = CLIENTS.reduce((s, c) => s + c.projectCount, 0);
  const totalActive  = CLIENTS.reduce((s, c) => s + c.activeProjects.length, 0);

  return (
    <div className="flex-1 h-full overflow-y-auto bg-background">
      {/* Page header */}
      <div className="border-b border-border px-10 py-6 bg-white flex items-start justify-between sticky top-0 z-10">
        <div>
          <SectionLabel>Master Portfolio</SectionLabel>
          <h1 className="text-xl font-bold text-foreground tracking-tight -mt-2">Client Database</h1>
        </div>
        {/* Summary metrics bar */}
        <div className="flex items-stretch gap-0 border border-border">
          <div className="px-6 py-3 border-r border-border">
            <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider block">Agency Clients</span>
            <span className="text-lg font-bold text-foreground">{CLIENTS.length}</span>
          </div>
          <div className="px-6 py-3 border-r border-border">
            <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider block">Total Projects</span>
            <span className="text-lg font-bold text-foreground">{totalProjects}</span>
          </div>
          <div className="px-6 py-3 border-r border-border">
            <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider block">Active Now</span>
            <span className="text-lg font-bold text-[#99CC33]">{totalActive}</span>
          </div>
          <div className="px-6 py-3">
            <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider block">Total Profit</span>
            <span className="text-lg font-bold text-foreground">€{totalProfit.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Client list */}
      <div className="p-10 flex flex-col gap-6">
        {CLIENTS.map((client, i) => (
          <ClientBlock key={client.id} client={client} index={i} />
        ))}
      </div>
    </div>
  );
}
