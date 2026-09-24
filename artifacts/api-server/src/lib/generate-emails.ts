import type { IndustryConfig } from "./industry-config.js";

interface Session {
  clientName: string;
  clientCompany: string;
  clientEmail?: string | null;
  accountManager: string;
}

interface Brief {
  clientSnapshot: unknown;
  keyOpportunities: unknown;
  strategicRisks: unknown;
  audienceInsights: unknown;
  messagingHypotheses: unknown;
  recommendedNextSteps: unknown;
  readingSuggestions?: unknown;
  industryContext?: unknown;
  redFlags?: unknown;
}

function getMeetingSlots(): string[] {
  const today = new Date();
  return [2, 5, 9].map((daysAhead) => {
    const d = new Date(today);
    d.setDate(d.getDate() + daysAhead);
    return (
      d.toLocaleDateString("en-GB", {
        weekday: "long",
        day: "numeric",
        month: "long",
      }) + " — 10:00am GMT"
    );
  });
}

export function generateClientEmailHtml(
  session: Session,
  brief: Brief,
  config: IndustryConfig,
  folderPath: string
): { subject: string; html: string } {
  const snapshot = brief.clientSnapshot as Record<string, unknown>;
  const opportunities = (brief.keyOpportunities as string[]) ?? [];
  const nextSteps = (brief.recommendedNextSteps as string[]) ?? [];
  const risks = (brief.strategicRisks as string[]) ?? [];
  const reading = (brief.readingSuggestions as Array<{ title: string; author: string; type: string }>) ?? config.readingSuggestions;
  const slots = getMeetingSlots();

  const GREEN = "#7DB523";
  const RUST = "#A44B1C";
  const DARK = "#1a1a16";
  const MUTED = "#888880";

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Vāc • Conscious Communication — Onboarding Summary</title>
<style>
  body { margin: 0; padding: 0; background: #ffffff; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: ${DARK}; }
  .container { max-width: 620px; margin: 0 auto; }
  .header { padding: 40px 48px 32px; border-bottom: 1px solid #e8e4dc; }
  .agency-name { font-size: 10px; letter-spacing: 0.15em; text-transform: uppercase; color: ${MUTED}; margin-bottom: 6px; }
  .logo-text { font-size: 26px; font-weight: 700; color: ${DARK}; letter-spacing: -0.01em; }
  .logo-dot { color: ${GREEN}; }
  .hero { background: ${GREEN}; padding: 36px 48px; }
  .hero-label { font-size: 9px; letter-spacing: 0.18em; text-transform: uppercase; color: rgba(255,255,255,0.6); margin-bottom: 8px; }
  .hero-title { font-size: 28px; font-weight: 700; color: #ffffff; line-height: 1.15; margin-bottom: 4px; }
  .hero-sub { font-size: 14px; color: rgba(255,255,255,0.75); font-style: italic; }
  .body { padding: 40px 48px; }
  .greeting { font-size: 15px; line-height: 1.7; color: ${DARK}; margin-bottom: 32px; }
  .section-label { font-size: 9px; letter-spacing: 0.18em; text-transform: uppercase; color: ${MUTED}; margin-bottom: 14px; border-top: 1px solid #e8e4dc; padding-top: 24px; margin-top: 24px; }
  .slash-item { display: flex; gap: 12px; margin-bottom: 10px; font-size: 13px; line-height: 1.6; }
  .slash { color: ${GREEN}; font-weight: 700; flex-shrink: 0; }
  .slot-box { background: #f7f5f0; padding: 12px 16px; margin-bottom: 8px; font-size: 13px; }
  .slot-label { font-size: 9px; letter-spacing: 0.12em; text-transform: uppercase; color: ${MUTED}; display: block; margin-bottom: 2px; }
  .reading-item { padding: 10px 0; border-bottom: 1px solid #e8e4dc; display: flex; gap: 12px; align-items: flex-start; font-size: 12px; }
  .reading-type { font-size: 8px; letter-spacing: 0.12em; text-transform: uppercase; color: ${MUTED}; margin-top: 2px; flex-shrink: 0; width: 60px; }
  .reading-title { font-weight: 600; color: ${DARK}; display: block; }
  .reading-author { color: ${MUTED}; }
  .risk-item { display: flex; gap: 12px; margin-bottom: 8px; font-size: 12px; line-height: 1.6; color: ${MUTED}; }
  .risk-dash { color: ${RUST}; flex-shrink: 0; }
  .footer { padding: 28px 48px; border-top: 1px solid #e8e4dc; }
  .footer-text { font-size: 10px; color: ${MUTED}; line-height: 1.7; letter-spacing: 0.03em; }
  .file-path { background: #f7f5f0; padding: 10px 14px; font-family: monospace; font-size: 11px; color: ${MUTED}; margin-top: 8px; }
</style>
</head>
<body>
<div class="container">
  <div class="header">
    <div class="agency-name">Strategic Communications</div>
    <div class="logo-text">Vāc <span class="logo-dot">•</span> Conscious Communication</div>
  </div>

  <div class="hero">
    <div class="hero-label">Onboarding Summary</div>
    <div class="hero-title">${session.clientCompany}</div>
    <div class="hero-sub">Discovery Output — ${config.label}</div>
  </div>

  <div class="body">
    <div class="greeting">
      Dear ${session.clientName},<br><br>
      Thank you for completing your onboarding session with Vāc • Conscious Communication.
      Below is a summary of what we learned and the strategic directions we see for ${session.clientCompany}.
      This is a starting point — not a conclusion. Our work together begins here.
    </div>

    <div class="section-label">Key Opportunities</div>
    ${opportunities
      .slice(0, 4)
      .map(
        (o) =>
          `<div class="slash-item"><span class="slash">/</span><span>${o}</span></div>`
      )
      .join("")}

    <div class="section-label">Key Challenges to Address</div>
    ${risks
      .slice(0, 3)
      .map(
        (r) =>
          `<div class="risk-item"><span class="risk-dash">—</span><span>${r}</span></div>`
      )
      .join("")}

    <div class="section-label">Sector Context — ${config.label}</div>
    <div class="slash-item"><span class="slash">/</span><span>${config.categoryTension}</span></div>
    ${config.strategicThemes
      .map(
        (t) =>
          `<div class="slash-item"><span class="slash">/</span><span>${t}</span></div>`
      )
      .join("")}

    <div class="section-label">Proposed Next Steps</div>
    ${nextSteps
      .slice(0, 4)
      .map(
        (s) =>
          `<div class="slash-item"><span class="slash">/</span><span>${s}</span></div>`
      )
      .join("")}

    <div class="section-label">Suggested Meeting Times</div>
    <p style="font-size:12px;color:${MUTED};margin-bottom:12px;">
      Please reply to confirm one of these slots, or suggest an alternative.
    </p>
    ${slots
      .map(
        (slot, i) =>
          `<div class="slot-box"><span class="slot-label">Option ${i + 1}</span>${slot}</div>`
      )
      .join("")}

    <div class="section-label">Reading — Curated for ${config.label}</div>
    <div>
      ${reading
        .map(
          (r) =>
            `<div class="reading-item">
              <div class="reading-type">${r.type}</div>
              <div>
                <span class="reading-title">${r.title}</span>
                <span class="reading-author">${r.author}</span>
              </div>
            </div>`
        )
        .join("")}
    </div>

    <div class="section-label">Your Report File</div>
    <p style="font-size:12px;color:${MUTED};margin-bottom:4px;">
      Your full strategic brief is available from your account manager. File reference:
    </p>
    <div class="file-path">${folderPath}</div>
  </div>

  <div class="footer">
    <div class="footer-text">
      Vāc • Conscious Communication &nbsp;·&nbsp; Strategic Communications Agency<br>
      This document is prepared exclusively for ${session.clientName} and ${session.clientCompany}.<br>
      Account Manager: ${session.accountManager}<br>
      Not for wider distribution without written consent.
    </div>
  </div>
</div>
</body>
</html>`;

  return {
    subject: `Your strategic onboarding summary — ${session.clientCompany}`,
    html,
  };
}

export function generateDirectorEmailHtml(
  session: Session,
  brief: Brief,
  config: IndustryConfig,
  folderPath: string,
  filename: string
): { subject: string; html: string } {
  const snapshot = brief.clientSnapshot as Record<string, unknown>;
  const opportunities = (brief.keyOpportunities as string[]) ?? [];
  const risks = (brief.strategicRisks as string[]) ?? [];
  const audiences = (brief.audienceInsights as string[]) ?? [];
  const messaging = (brief.messagingHypotheses as string[]) ?? [];
  const nextSteps = (brief.recommendedNextSteps as string[]) ?? [];
  const redFlags = (brief.redFlags as string[]) ?? [];

  const GREEN = "#7DB523";
  const RUST = "#A44B1C";
  const DARK = "#1a1a16";
  const MUTED = "#888880";

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Internal Director Report — ${session.clientCompany}</title>
<style>
  body { margin: 0; padding: 0; background: #ffffff; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: ${DARK}; }
  .container { max-width: 620px; margin: 0 auto; }
  .header { padding: 32px 48px; border-bottom: 2px solid ${RUST}; }
  .internal-tag { display: inline-block; background: ${RUST}; color: #fff; font-size: 8px; letter-spacing: 0.18em; text-transform: uppercase; padding: 3px 8px; margin-bottom: 10px; }
  .logo-text { font-size: 20px; font-weight: 700; color: ${DARK}; }
  .title-block { background: #1a1a16; padding: 28px 48px; }
  .title-label { font-size: 9px; letter-spacing: 0.18em; text-transform: uppercase; color: rgba(255,255,255,0.4); margin-bottom: 6px; }
  .title-main { font-size: 24px; font-weight: 700; color: #fff; }
  .title-sub { font-size: 12px; color: rgba(255,255,255,0.5); margin-top: 4px; }
  .body { padding: 36px 48px; }
  .section-label { font-size: 9px; letter-spacing: 0.18em; text-transform: uppercase; color: ${MUTED}; margin-bottom: 12px; border-top: 1px solid #e8e4dc; padding-top: 20px; margin-top: 20px; }
  .slash-item { display: flex; gap: 12px; margin-bottom: 8px; font-size: 13px; line-height: 1.6; }
  .slash { color: ${GREEN}; font-weight: 700; flex-shrink: 0; }
  .risk-item { display: flex; gap: 12px; margin-bottom: 8px; font-size: 12px; line-height: 1.6; }
  .risk-dash { color: ${RUST}; flex-shrink: 0; font-weight: 700; }
  .flag-item { display: flex; gap: 12px; margin-bottom: 6px; font-size: 12px; line-height: 1.6; background: #fff5f0; padding: 8px 12px; }
  .snapshot-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px 24px; margin-bottom: 8px; }
  .snapshot-item { }
  .snapshot-key { font-size: 8px; letter-spacing: 0.14em; text-transform: uppercase; color: ${MUTED}; display: block; margin-bottom: 2px; }
  .snapshot-val { font-size: 13px; color: ${DARK}; font-weight: 500; }
  .pdf-box { background: #f2f7e8; padding: 16px 20px; border-left: 3px solid ${GREEN}; margin-top: 8px; }
  .pdf-path { font-family: monospace; font-size: 11px; color: ${MUTED}; word-break: break-all; }
  .footer { padding: 24px 48px; border-top: 1px solid #e8e4dc; }
  .footer-text { font-size: 10px; color: ${MUTED}; line-height: 1.7; }
</style>
</head>
<body>
<div class="container">
  <div class="header">
    <div class="internal-tag">Internal — Account Director</div>
    <div class="logo-text">Vāc • Conscious Communication</div>
  </div>

  <div class="title-block">
    <div class="title-label">Director Briefing Report</div>
    <div class="title-main">${session.clientCompany}</div>
    <div class="title-sub">${config.label} · Onboarded by ${session.accountManager} · ${new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}</div>
  </div>

  <div class="body">
    <div class="section-label">Client Snapshot</div>
    <div class="snapshot-grid">
      <div class="snapshot-item"><span class="snapshot-key">Client</span><span class="snapshot-val">${session.clientName}</span></div>
      <div class="snapshot-item"><span class="snapshot-key">Company</span><span class="snapshot-val">${session.clientCompany}</span></div>
      <div class="snapshot-item"><span class="snapshot-key">Sector</span><span class="snapshot-val">${config.label}</span></div>
      <div class="snapshot-item"><span class="snapshot-key">Brand Age</span><span class="snapshot-val">${String(snapshot?.brandAge ?? "Not specified")}</span></div>
      <div class="snapshot-item"><span class="snapshot-key">Personality</span><span class="snapshot-val">${(snapshot?.brandPersonality as string[] ?? []).join(", ") || "Not defined"}</span></div>
      <div class="snapshot-item"><span class="snapshot-key">Channels</span><span class="snapshot-val">${(snapshot?.channels as string[] ?? []).length} selected</span></div>
    </div>

    <div class="section-label">Strategic Opportunities</div>
    ${opportunities
      .map(
        (o) =>
          `<div class="slash-item"><span class="slash">/</span><span>${o}</span></div>`
      )
      .join("")}

    <div class="section-label">Biggest Challenges & Risks</div>
    ${risks
      .map(
        (r) =>
          `<div class="risk-item"><span class="risk-dash">—</span><span>${r}</span></div>`
      )
      .join("")}
    <div style="margin-top:10px;">
    ${config.painPoints
      .slice(0, 3)
      .map(
        (p) =>
          `<div class="risk-item"><span class="risk-dash">—</span><span>${p}</span></div>`
      )
      .join("")}
    </div>

    <div class="section-label">Audience Intelligence</div>
    ${audiences
      .map(
        (a) =>
          `<div class="slash-item"><span class="slash">/</span><span>${a}</span></div>`
      )
      .join("")}

    <div class="section-label">Messaging Hypotheses</div>
    ${messaging
      .map(
        (m) =>
          `<div class="slash-item"><span class="slash">/</span><span>${m}</span></div>`
      )
      .join("")}

    <div class="section-label">Category Context — ${config.label}</div>
    <div class="slash-item"><span class="slash">/</span><span>${config.categoryTension}</span></div>
    ${config.strategicThemes
      .map(
        (t) =>
          `<div class="slash-item"><span class="slash">/</span><span>${t}</span></div>`
      )
      .join("")}

    <div class="section-label">Recommended Internal Actions</div>
    ${nextSteps
      .map(
        (s) =>
          `<div class="slash-item"><span class="slash">/</span><span>${s}</span></div>`
      )
      .join("")}

    ${
      redFlags.length > 0
        ? `<div class="section-label" style="color:#cc4400;">Information Gaps — Follow Up Required</div>
    ${redFlags
      .map(
        (f) =>
          `<div class="flag-item"><span style="color:${RUST};font-weight:700;flex-shrink:0;">!</span><span style="font-size:12px;">${f}</span></div>`
      )
      .join("")}`
        : ""
    }

    <div class="section-label">PDF Report & File Storage</div>
    <div class="pdf-box">
      <div style="font-size:10px;letter-spacing:0.12em;text-transform:uppercase;color:${MUTED};margin-bottom:6px;">Suggested Microsoft 365 File Path</div>
      <div class="pdf-path">${folderPath} / ${filename}</div>
      <div style="font-size:11px;color:${MUTED};margin-top:8px;">
        Upload the attached PDF to the above path in SharePoint or OneDrive.
        Create the folder structure if it does not yet exist.
      </div>
    </div>
  </div>

  <div class="footer">
    <div class="footer-text">
      Vāc • Conscious Communication — Internal Document<br>
      Prepared by: ${session.accountManager} · Strictly Confidential · Not for client distribution.
    </div>
  </div>
</div>
</body>
</html>`;

  return {
    subject: `[Internal] Director briefing — ${session.clientCompany} onboarding`,
    html,
  };
}
