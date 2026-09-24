// Pure onboarding logic (no database, no Node APIs).
// Shared by the API server and the in-browser preview build.
import { INDUSTRY_CONFIG } from "./industry-config.js";

export function buildFolderPath(clientCompany: string): string {
  const date = new Date().toISOString().split("T")[0];
  return `Clients / ${clientCompany} / Onboarding / ${date}`;
}

export function buildFilename(clientCompany: string): string {
  const date = new Date().toISOString().split("T")[0];
  const slug = clientCompany.replace(/[^a-zA-Z0-9]+/g, "-").replace(/^-|-$/g, "");
  return `${slug}_Strategic-Brief_${date}.pdf`;
}

// ─── Brief generation (industry-adaptive) ────────────────────────────────────

export function generateBrief(
  clientName: string,
  clientCompany: string,
  responses: Record<string, unknown>
) {
  const industry = (responses.industry as string) ?? "other";
  const config = INDUSTRY_CONFIG[industry] ?? INDUSTRY_CONFIG.other;

  const objectives = (responses.objectives as Record<string, number>) ?? {};
  const audience = (responses.audience as string[]) ?? [];
  const brandPersonality = (responses.brandPersonality as string[]) ?? [];
  const toneWords = (responses.toneWords as string[]) ?? [];
  const competitors = (responses.competitors as string[]) ?? [];
  const channels = (responses.channels as string[]) ?? [];
  const businessContext = (responses.businessContext as string) ?? "";
  const brandAge = (responses.brandAge as string) ?? "";

  const topObjectives = Object.entries(objectives)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 2)
    .map(([key]) => key.replace(/([A-Z])/g, " $1").trim().toLowerCase());

  const keyOpportunities: string[] = [];
  const strategicRisks: string[] = [];
  const audienceInsights: string[] = [];
  const messagingHypotheses: string[] = [];
  const recommendedNextSteps: string[] = [];
  const redFlags: string[] = [];

  // Industry-level positioning
  keyOpportunities.push(`${config.label} sector: ${config.categoryTension}`);
  keyOpportunities.push(`Primary strategic theme for ${config.label}: ${config.strategicThemes[0]}`);

  // Audience insights — adaptive to industry
  if (audience.length > 0) {
    audienceInsights.push(
      `Primary audience: ${audience[0]} — in ${config.label}, this segment responds best to ${toneWords[0] ?? config.strategicThemes[0]} communication`
    );
    if (audience.length > 1) {
      audienceInsights.push(
        `Secondary audiences: ${audience.slice(1, 3).join(", ")} — a multi-audience strategy requires distinct message hierarchies`
      );
    }
  } else {
    audienceInsights.push(`Default primary audience for ${config.label}: ${config.audiences[0]}`);
    audienceInsights.push(`Recommended secondary focus: ${config.audiences.slice(1, 3).join(" and ")}`);
  }

  // Tone & messaging
  if (toneWords.length > 0) {
    messagingHypotheses.push(
      `Brand voice anchored in: ${toneWords.join(", ")} — calibrated for ${config.label} sector expectations`
    );
    const isBold = toneWords.includes("Bold") || toneWords.includes("Provocative");
    messagingHypotheses.push(
      isBold
        ? `Challenger positioning signal: this brand has confidence to reframe ${config.label} category norms`
        : `Authority-led positioning: ${config.strategicThemes[1] ?? "considered communication"} will build long-term credibility`
    );
  } else {
    messagingHypotheses.push(
      `Tone of voice not yet established — recommend aligning to "${config.strategicThemes[0]}" as a starting point`
    );
  }

  // Industry pain points as risks
  config.painPoints.slice(0, 2).forEach((pt) => {
    strategicRisks.push(pt);
  });

  // Competitive landscape
  if (competitors.length > 0) {
    keyOpportunities.push(
      `Competitive benchmark: ${competitors.slice(0, 2).join(", ")} — differentiation strategy required`
    );
    strategicRisks.push(
      `Active competitive field: ${competitors.slice(0, 2).join(", ")} — positioning clarity is critical`
    );
  } else {
    strategicRisks.push(`No competitive benchmarks identified — category mapping recommended as first deliverable`);
    keyOpportunities.push(`Potential whitespace: no competitor references suggest an open positioning opportunity`);
  }

  // Channels
  if (channels.length >= 4) {
    keyOpportunities.push(
      `Multi-channel presence across ${channels.length} platforms — integrated campaign potential is strong`
    );
  } else if (channels.length > 0) {
    const missing = config.channelPriorities.filter((c) => !channels.includes(c))[0];
    strategicRisks.push(
      `Focused channel mix (${channels.length} platforms) — consider expanding to ${missing ?? "additional channels"}`
    );
  }

  // Business context
  if (businessContext) {
    keyOpportunities.push(
      `Business context: "${businessContext.slice(0, 100)}${businessContext.length > 100 ? "..." : ""}" — explore category leadership angles`
    );
  }

  // Brand age
  if (brandAge === "Under 1 year") {
    keyOpportunities.push("Early-stage brand: invest in positioning and foundation before amplification");
    strategicRisks.push("Brand infrastructure not yet established — premature scale risks inconsistency");
  } else if (brandAge === "10+ years") {
    keyOpportunities.push("Established brand with heritage equity — repositioning opportunity to modernise without losing core identity");
  }

  // Brand personality
  if (brandPersonality.length > 0) {
    keyOpportunities.push(`Brand personality alignment: ${brandPersonality.join(", ")} — apply consistently across all touchpoints`);
  }

  // Next steps — objective-driven
  recommendedNextSteps.push(`Schedule a 90-minute strategy alignment session with ${clientName}`);
  if (topObjectives.length > 0) {
    recommendedNextSteps.push(
      `Priority objective: ${topObjectives[0]} — develop a KPI framework and measurement plan`
    );
  }
  recommendedNextSteps.push(`Develop initial messaging framework based on tone and audience insights`);
  recommendedNextSteps.push(
    `Commission ${config.label} audience research to validate prioritisation hypotheses`
  );
  if (competitors.length > 0) {
    recommendedNextSteps.push(
      `Conduct competitive audit across ${competitors.slice(0, 2).join(" and ")} to identify positioning gaps`
    );
  } else {
    recommendedNextSteps.push(
      `Map the ${config.label} category landscape to identify whitespace and positioning opportunity`
    );
  }
  recommendedNextSteps.push(
    `Present channel strategy proposal within 2 weeks, prioritising ${config.channelPriorities[0]}`
  );

  // Red flags
  if (!businessContext) {
    redFlags.push("Business context incomplete — follow up to capture full market background");
  }
  if (audience.length === 0) {
    redFlags.push("No audience segments defined — critical gap for campaign planning");
  }
  if (toneWords.length === 0) {
    redFlags.push("Tone of voice not established — required before any creative development");
  }
  if (!industry || industry === "other") {
    redFlags.push("Industry not specified — generic outputs applied; re-run with sector selection for tailored strategy");
  }

  return {
    clientSnapshot: {
      name: clientName,
      company: clientCompany,
      industry: config.label,
      businessContext: businessContext || "Not provided",
      brandPersonality,
      channels,
      completedSteps: Object.keys(responses).length,
      brandAge: brandAge || "Not specified",
    },
    keyOpportunities:
      keyOpportunities.length > 0
        ? keyOpportunities
        : ["Full strategic opportunity assessment pending additional information"],
    strategicRisks:
      strategicRisks.length > 0
        ? strategicRisks
        : ["No critical risks identified at this stage"],
    audienceInsights:
      audienceInsights.length > 0
        ? audienceInsights
        : ["Audience mapping to be refined in strategy session"],
    messagingHypotheses:
      messagingHypotheses.length > 0
        ? messagingHypotheses
        : ["Messaging framework to be developed following tone alignment"],
    recommendedNextSteps,
    internalNotes: `Auto-generated brief for ${clientCompany} (${config.label}). Review and enhance with account team before sharing externally.`,
    redFlags,
    readingSuggestions: config.readingSuggestions,
    industryContext: {
      sector: config.label,
      categoryTension: config.categoryTension,
      strategicThemes: config.strategicThemes,
      painPoints: config.painPoints,
    },
  };
}
