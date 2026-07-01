import React, { useState } from "react";
import { motion } from "framer-motion";
import { ExternalLink, FileText, Tag } from "lucide-react";
import { PATTERN_BANK } from "../data/assigneePalette";

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 mb-6">
      <span className="text-[#99CC33] font-bold text-sm leading-none">/</span>
      <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.14em]">{children}</span>
    </div>
  );
}

const TEAM = [
  {
    initials: "CF",
    name: "Catarina Figueiredo",
    role: "Creative Director",
    expertise: "Brand Strategy & Art Direction",
    palette: PATTERN_BANK.stripedGreen,
    skills: ["Brand Architecture", "Art Direction", "Campaign Design", "Visual Identity", "Brand Positioning"],
    bio: "A creative strategist with 12+ years shaping visual identities for European brands. Catarina leads with intuition, anchoring every project in cultural context and long-term brand equity. Former Creative Lead at BBDO Lisbon.",
    cv: "#",
    portfolio: "#",
  },
  {
    initials: "MS",
    name: "Miguel Santos",
    role: "Senior Designer",
    expertise: "Visual Design & Motion",
    palette: PATTERN_BANK.dottedGreen,
    skills: ["Visual Design", "Motion Graphics", "Illustration", "Typography", "UI Systems"],
    bio: "Miguel translates strategy into precise, resonant form. His background in fine arts informs a design practice that is both systematic and emotionally alive. He has led visual systems for 40+ brand launches.",
    cv: "#",
    portfolio: "#",
  },
  {
    initials: "JP",
    name: "João Pereira",
    role: "Digital Strategist",
    expertise: "Digital & Content Strategy",
    palette: PATTERN_BANK.stripedTerracotta,
    skills: ["Social Media Strategy", "SEO & SEM", "Content Architecture", "Analytics", "Paid Media"],
    bio: "JP bridges brand voice with digital performance. A former data analyst turned strategist, he builds content ecosystems that perform across platforms without sacrificing editorial quality.",
    cv: "#",
    portfolio: "#",
  },
  {
    initials: "AL",
    name: "Ana Lima",
    role: "Account Manager",
    expertise: "Client Relations & Brand Consulting",
    palette: PATTERN_BANK.crosshatchTerracotta,
    skills: ["Client Management", "Project Delivery", "Brand Consulting", "Budgeting", "Stakeholder Communication"],
    bio: "Ana is the connective tissue between agency vision and client reality. Meticulous, warm, and strategically sharp, she ensures every deliverable lands with precision and every client relationship deepens over time.",
    cv: "#",
    portfolio: "#",
  },
  {
    initials: "MR",
    name: "Marta Rodrigues",
    role: "Senior Copywriter",
    expertise: "Brand Language & Editorial",
    palette: PATTERN_BANK.dottedGreen,
    skills: ["Brand Copywriting", "Tone of Voice", "Editorial Strategy", "Naming", "Campaign Concepts"],
    bio: "Marta crafts language that makes brands feel inevitable. She has written for luxury hospitality, F&B, and cultural institutions across Portugal and Spain, developing tone-of-voice guidelines used by entire creative teams.",
    cv: "#",
    portfolio: "#",
  },
  {
    initials: "TC",
    name: "Tiago Costa",
    role: "Creative Producer",
    expertise: "Photography & Video Production",
    palette: PATTERN_BANK.stripedGreen,
    skills: ["Photography", "Video Production", "Post-Production", "Set Direction", "Content Direction"],
    bio: "Tiago's visual storytelling captures the authentic texture of a brand's world. Equally at home on editorial shoots and commercial sets, he produces content that performs without looking produced.",
    cv: "#",
    portfolio: "#",
  },
];

interface TeamCardProps {
  member: (typeof TEAM)[0];
  index: number;
}

function TeamCard({ member, index }: TeamCardProps) {
  const [hovering, setHovering] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.06 }}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      className="border border-border bg-white flex flex-col"
    >
      {/* Card header */}
      <div
        className="h-[80px] flex items-end px-5 pb-4 relative overflow-hidden"
        style={{ ...member.palette.bar }}
      >
        <span
          className="text-[10px] font-bold uppercase tracking-[0.18em] opacity-70"
          style={{ color: member.palette.text }}
        >
          {member.role}
        </span>
        <div
          className="absolute top-4 right-5 w-10 h-10 flex items-center justify-center text-[13px] font-bold border border-white/30"
          style={{ color: member.palette.text, borderColor: `${member.palette.text}44` }}
        >
          {member.initials}
        </div>
      </div>

      {/* Body */}
      <div className="px-5 py-5 flex-1 flex flex-col gap-4">
        <div>
          <h3 className="text-sm font-bold text-foreground tracking-tight">{member.name}</h3>
          <p className="text-[10px] text-muted-foreground mt-0.5 uppercase tracking-wider">{member.expertise}</p>
        </div>

        {/* Skills */}
        <div className="flex flex-wrap gap-1.5">
          {member.skills.map((skill) => (
            <span
              key={skill}
              className="text-[9px] font-bold uppercase tracking-wider border border-black/10 px-2 py-0.5 text-muted-foreground"
            >
              {skill}
            </span>
          ))}
        </div>

        {/* Bio */}
        <p className="text-[11px] text-muted-foreground leading-relaxed flex-1">{member.bio}</p>

        {/* Links */}
        <div className="flex items-center gap-3 pt-2 border-t border-border">
          <a
            href={member.cv}
            onClick={(e) => e.preventDefault()}
            className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-foreground hover:text-[#99CC33] transition-colors"
          >
            <FileText size={10} />
            View CV
          </a>
          <span className="text-black/20">·</span>
          <a
            href={member.portfolio}
            onClick={(e) => e.preventDefault()}
            className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-foreground hover:text-[#99CC33] transition-colors"
          >
            <ExternalLink size={10} />
            Portfolio
          </a>
        </div>
      </div>
    </motion.div>
  );
}

export default function TeamPage() {
  return (
    <div className="flex-1 h-full overflow-y-auto bg-background">
      {/* Page header */}
      <div className="border-b border-border px-10 py-6 bg-white flex items-center justify-between sticky top-0 z-10">
        <div>
          <SectionLabel>Human Resources</SectionLabel>
          <h1 className="text-xl font-bold text-foreground tracking-tight -mt-3">Agency Team</h1>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider border border-border px-3 py-1.5">
            {TEAM.length} Professionals
          </span>
          <span className="text-[10px] font-bold text-[#99CC33] uppercase tracking-wider border border-[#99CC33]/30 px-3 py-1.5 bg-[#99CC33]/5">
            All Active
          </span>
        </div>
      </div>

      {/* Grid */}
      <div className="p-10">
        <div className="grid grid-cols-3 gap-5">
          {TEAM.map((member, i) => (
            <TeamCard key={member.initials} member={member} index={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
