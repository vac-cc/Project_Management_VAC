import type { CSSProperties } from "react";

export type PatternEntry = {
  name: string;
  bar: CSSProperties;
  done: CSSProperties;
  upcoming: CSSProperties;
  text: string;
};

// ── Brand Pattern Bank — 6 geometric styles, strictly #BF5700 + #99CC33 ──
export const PATTERN_BANK: Record<string, PatternEntry> = {
  // 1. Solid Leaf Green
  solidGreen: {
    name: "Solid Green",
    bar:      { background: "#99CC33" },
    done:     { background: "rgba(0,0,0,0.13)" },
    upcoming: { background: "#EEF8CC", outline: "1px solid #99CC33" },
    text: "#fff",
  },
  // 2. Solid Terracotta
  solidTerracotta: {
    name: "Solid Terracotta",
    bar:      { background: "#BF5700" },
    done:     { background: "rgba(0,0,0,0.13)" },
    upcoming: { background: "#FAEEE6", outline: "1px solid #BF5700" },
    text: "#fff",
  },
  // 3. 45° Diagonal Stripes — Green + Black
  stripedGreen: {
    name: "Striped Green",
    bar: {
      backgroundImage: "repeating-linear-gradient(45deg,#99CC33 0px,#99CC33 3px,#1a1a1a 3px,#1a1a1a 6px)",
    },
    done:     { background: "rgba(0,0,0,0.13)" },
    upcoming: {
      backgroundImage: "repeating-linear-gradient(45deg,rgba(153,204,51,0.28) 0px,rgba(153,204,51,0.28) 3px,rgba(0,0,0,0.07) 3px,rgba(0,0,0,0.07) 6px)",
      outline: "1px solid rgba(153,204,51,0.45)",
    },
    text: "#fff",
  },
  // 4. 45° Diagonal Stripes — Terracotta + Black
  stripedTerracotta: {
    name: "Striped Terracotta",
    bar: {
      backgroundImage: "repeating-linear-gradient(45deg,#BF5700 0px,#BF5700 3px,#1a1a1a 3px,#1a1a1a 6px)",
    },
    done:     { background: "rgba(0,0,0,0.13)" },
    upcoming: {
      backgroundImage: "repeating-linear-gradient(45deg,rgba(191,87,0,0.28) 0px,rgba(191,87,0,0.28) 3px,rgba(0,0,0,0.07) 3px,rgba(0,0,0,0.07) 6px)",
      outline: "1px solid rgba(191,87,0,0.45)",
    },
    text: "#fff",
  },
  // 5. Micro-dot matrix — green dots on deep green base
  dottedGreen: {
    name: "Dotted Grid",
    bar: {
      backgroundColor: "#6B9424",
      backgroundImage: "radial-gradient(circle,rgba(238,248,204,0.85) 1.5px,transparent 1.5px)",
      backgroundSize: "7px 7px",
    },
    done:     { background: "rgba(0,0,0,0.13)" },
    upcoming: {
      backgroundColor: "#EEF8CC",
      backgroundImage: "radial-gradient(circle,rgba(107,148,36,0.45) 1.5px,transparent 1.5px)",
      backgroundSize: "7px 7px",
      outline: "1px solid #99CC33",
    },
    text: "#fff",
  },
  // 6. Crosshatch grid mesh — white grid over deep terracotta
  crosshatchTerracotta: {
    name: "Crosshatch",
    bar: {
      backgroundColor: "#994500",
      backgroundImage: [
        "repeating-linear-gradient(0deg,rgba(255,255,255,0.22) 0px,rgba(255,255,255,0.22) 1px,transparent 1px,transparent 7px)",
        "repeating-linear-gradient(90deg,rgba(255,255,255,0.22) 0px,rgba(255,255,255,0.22) 1px,transparent 1px,transparent 7px)",
      ].join(","),
    },
    done:     { background: "rgba(0,0,0,0.13)" },
    upcoming: {
      backgroundColor: "#FAEEE6",
      backgroundImage: [
        "repeating-linear-gradient(0deg,rgba(191,87,0,0.22) 0px,rgba(191,87,0,0.22) 1px,transparent 1px,transparent 7px)",
        "repeating-linear-gradient(90deg,rgba(191,87,0,0.22) 0px,rgba(191,87,0,0.22) 1px,transparent 1px,transparent 7px)",
      ].join(","),
      outline: "1px solid rgba(191,87,0,0.4)",
    },
    text: "#fff",
  },
};

// Assignee → pattern mapping (single source of truth for ZoneB timeline bars)
export const ASSIGNEE_PALETTE: Record<string, PatternEntry> = {
  "Marta":    PATTERN_BANK.solidGreen,
  "Tiago":    PATTERN_BANK.solidTerracotta,
  "Ana":      PATTERN_BANK.crosshatchTerracotta,
  "Pedro":    PATTERN_BANK.stripedGreen,
  "Catarina Pinto": PATTERN_BANK.dottedGreen,
  "Anaís":    PATTERN_BANK.solidTerracotta,
  "Íris":     PATTERN_BANK.stripedTerracotta,
};
