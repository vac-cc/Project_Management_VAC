import PDFDocument from "pdfkit";
import type { IndustryConfig } from "./industry-config.js";

interface Session {
  clientName: string;
  clientCompany: string;
  accountManager: string;
}

interface Brief {
  clientSnapshot: unknown;
  keyOpportunities: unknown;
  strategicRisks: unknown;
  audienceInsights: unknown;
  messagingHypotheses: unknown;
  recommendedNextSteps: unknown;
  redFlags?: unknown;
  internalNotes?: string | null;
  readingSuggestions?: unknown;
  industryContext?: unknown;
}

const GREEN = "#7DB523";
const RUST = "#A44B1C";
const DARK = "#1A1A16";
const MUTED = "#888880";
const LIGHT = "#F7F5F0";

function drawRule(doc: PDFKit.PDFDocument, color = "#E8E4DC") {
  doc
    .save()
    .strokeColor(color)
    .lineWidth(0.5)
    .moveTo(doc.page.margins.left, doc.y)
    .lineTo(doc.page.width - doc.page.margins.right, doc.y)
    .stroke()
    .restore();
  doc.moveDown(0.4);
}

function sectionLabel(doc: PDFKit.PDFDocument, text: string) {
  doc.moveDown(0.6);
  drawRule(doc);
  doc
    .font("Helvetica")
    .fontSize(7)
    .fillColor(MUTED)
    .text(text.toUpperCase(), { characterSpacing: 1.8 });
  doc.moveDown(0.5);
}

function slashItem(doc: PDFKit.PDFDocument, text: string, color = GREEN) {
  const x = doc.page.margins.left;
  const y = doc.y;
  doc
    .font("Helvetica-Bold")
    .fontSize(11)
    .fillColor(color)
    .text("/", x, y, { continued: false, width: 16 });
  doc
    .font("Helvetica")
    .fontSize(10)
    .fillColor(DARK)
    .text(text, x + 20, y, { width: doc.page.width - doc.page.margins.left - doc.page.margins.right - 20 });
  doc.moveDown(0.2);
}

function dashItem(doc: PDFKit.PDFDocument, text: string, color = RUST) {
  const x = doc.page.margins.left;
  const y = doc.y;
  doc
    .font("Helvetica-Bold")
    .fontSize(10)
    .fillColor(color)
    .text("—", x, y, { continued: false, width: 16 });
  doc
    .font("Helvetica")
    .fontSize(10)
    .fillColor(MUTED)
    .text(text, x + 20, y, { width: doc.page.width - doc.page.margins.left - doc.page.margins.right - 20 });
  doc.moveDown(0.2);
}

export async function generateReportPdf(
  session: Session,
  brief: Brief,
  config: IndustryConfig
): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({
      size: "A4",
      margins: { top: 60, bottom: 60, left: 60, right: 60 },
      info: {
        Title: `Strategic Brief — ${session.clientCompany}`,
        Author: "Vāc • Conscious Communication",
        Creator: "Vāc Onboarding Console",
      },
    });

    const chunks: Buffer[] = [];
    doc.on("data", (chunk: Buffer) => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    const snapshot = brief.clientSnapshot as Record<string, unknown>;
    const opportunities = (brief.keyOpportunities as string[]) ?? [];
    const risks = (brief.strategicRisks as string[]) ?? [];
    const audiences = (brief.audienceInsights as string[]) ?? [];
    const messaging = (brief.messagingHypotheses as string[]) ?? [];
    const nextSteps = (brief.recommendedNextSteps as string[]) ?? [];
    const redFlags = (brief.redFlags as string[]) ?? [];
    const reading =
      (brief.readingSuggestions as Array<{ title: string; author: string; type: string }>) ??
      config.readingSuggestions;

    const pageW = doc.page.width;
    const marginL = doc.page.margins.left;
    const marginR = doc.page.margins.right;
    const contentW = pageW - marginL - marginR;

    // ─── Cover band ───────────────────────────────────────────────
    doc
      .rect(0, 0, pageW, 130)
      .fill(GREEN);

    doc
      .font("Helvetica")
      .fontSize(8)
      .fillColor("rgba(255,255,255,0.55)")
      .text("STRATEGIC BRIEF — DISCOVERY OUTPUT", marginL, 38, { characterSpacing: 1.5 });

    doc
      .font("Helvetica-Bold")
      .fontSize(28)
      .fillColor("#FFFFFF")
      .text(session.clientCompany, marginL, 54, { width: contentW });

    doc
      .font("Helvetica")
      .fontSize(11)
      .fillColor("rgba(255,255,255,0.75)")
      .text(config.label, marginL, 104);

    // ─── Agency name ─────────────────────────────────────────────
    doc
      .font("Helvetica")
      .fontSize(8)
      .fillColor("rgba(255,255,255,0.45)")
      .text("Vāc • Conscious Communication", pageW - marginR - 180, 38, { width: 180, align: "right" });

    doc.y = 148;

    // ─── Meta row ────────────────────────────────────────────────
    doc
      .rect(marginL, doc.y, contentW, 38)
      .fill(LIGHT);

    const metaY = doc.y + 10;
    doc.font("Helvetica").fontSize(8).fillColor(MUTED);
    doc.text(`CLIENT`, marginL + 12, metaY, { characterSpacing: 1 });
    doc
      .font("Helvetica-Bold")
      .fontSize(9)
      .fillColor(DARK)
      .text(session.clientName, marginL + 12, metaY + 10);

    doc.font("Helvetica").fontSize(8).fillColor(MUTED);
    doc.text(`MANAGER`, marginL + 130, metaY, { characterSpacing: 1 });
    doc
      .font("Helvetica-Bold")
      .fontSize(9)
      .fillColor(DARK)
      .text(session.accountManager, marginL + 130, metaY + 10);

    doc.font("Helvetica").fontSize(8).fillColor(MUTED);
    doc.text(`DATE`, marginL + 280, metaY, { characterSpacing: 1 });
    doc
      .font("Helvetica-Bold")
      .fontSize(9)
      .fillColor(DARK)
      .text(
        new Date().toLocaleDateString("en-GB", {
          day: "numeric",
          month: "long",
          year: "numeric",
        }),
        marginL + 280,
        metaY + 10
      );

    doc.y = 200;
    doc.moveDown(0.6);

    // ─── Client snapshot ──────────────────────────────────────────
    sectionLabel(doc, "Client Snapshot");

    const fields = [
      ["Business Context", String(snapshot?.businessContext ?? "Not provided")],
      ["Brand Age", String(snapshot?.brandAge ?? "Not specified")],
      ["Channels", `${(snapshot?.channels as string[] ?? []).length} selected`],
      ["Brand Personality", (snapshot?.brandPersonality as string[] ?? []).join(", ") || "Not defined"],
    ];

    fields.forEach(([key, val]) => {
      doc
        .font("Helvetica")
        .fontSize(8)
        .fillColor(MUTED)
        .text(key.toUpperCase(), { characterSpacing: 1 });
      doc
        .font("Helvetica")
        .fontSize(10)
        .fillColor(DARK)
        .text(val, { width: contentW });
      doc.moveDown(0.4);
    });

    // ─── Sector context ───────────────────────────────────────────
    sectionLabel(doc, `Sector Context — ${config.label}`);

    doc
      .rect(marginL, doc.y, contentW, 36)
      .fill(GREEN);
    doc
      .font("Helvetica")
      .fontSize(10)
      .fillColor("#fff")
      .text(config.categoryTension, marginL + 14, doc.y - 30, { width: contentW - 28 });
    doc.y += 10;
    doc.moveDown(0.5);

    config.strategicThemes.forEach((t) => slashItem(doc, t));

    // ─── Key opportunities ────────────────────────────────────────
    sectionLabel(doc, "Key Opportunities");
    opportunities.forEach((o) => slashItem(doc, o));

    // ─── Strategic risks ──────────────────────────────────────────
    sectionLabel(doc, "Strategic Risks & Challenges");
    risks.forEach((r) => dashItem(doc, r));
    config.painPoints.slice(0, 2).forEach((p) => dashItem(doc, p));

    // ─── Audience insights ────────────────────────────────────────
    sectionLabel(doc, "Audience Insights");
    audiences.forEach((a) => slashItem(doc, a));

    // ─── Messaging hypotheses ─────────────────────────────────────
    sectionLabel(doc, "Messaging Hypotheses");
    messaging.forEach((m) => slashItem(doc, m));

    // ─── Recommended next steps ───────────────────────────────────
    sectionLabel(doc, "Recommended Next Steps");
    nextSteps.forEach((s) => slashItem(doc, s, RUST));

    // ─── Reading suggestions ──────────────────────────────────────
    sectionLabel(doc, `Reading — Curated for ${config.label}`);
    reading.forEach((r) => {
      const x = marginL;
      const y = doc.y;
      doc
        .font("Helvetica")
        .fontSize(8)
        .fillColor(MUTED)
        .text(r.type.toUpperCase(), x, y, { characterSpacing: 1, width: 60 });
      doc
        .font("Helvetica-Bold")
        .fontSize(10)
        .fillColor(DARK)
        .text(r.title, x + 70, y, { width: contentW - 70, continued: false });
      doc
        .font("Helvetica")
        .fontSize(9)
        .fillColor(MUTED)
        .text(r.author, x + 70, doc.y, { width: contentW - 70 });
      doc.moveDown(0.3);
    });

    // ─── Red flags ────────────────────────────────────────────────
    if (redFlags.length > 0) {
      sectionLabel(doc, "Information Gaps — Follow Up Required");
      redFlags.forEach((f) => {
        doc
          .font("Helvetica")
          .fontSize(10)
          .fillColor(RUST)
          .text(`! ${f}`, { width: contentW });
        doc.moveDown(0.2);
      });
    }

    // ─── Internal notes ───────────────────────────────────────────
    if (brief.internalNotes) {
      sectionLabel(doc, "Internal Notes");
      doc
        .font("Helvetica-Oblique")
        .fontSize(9)
        .fillColor(MUTED)
        .text(brief.internalNotes, { width: contentW });
    }

    // ─── Footer on all pages ─────────────────────────────────────
    const range = doc.bufferedPageRange();
    for (let i = 0; i < range.count; i++) {
      doc.switchToPage(range.start + i);
      const footerY = doc.page.height - 42;
      doc
        .rect(0, footerY - 8, pageW, 50)
        .fill("#FAFAF8");
      doc
        .font("Helvetica")
        .fontSize(7.5)
        .fillColor(MUTED)
        .text(
          `Vāc • Conscious Communication  ·  Strategic Brief — ${session.clientCompany}  ·  Confidential`,
          marginL,
          footerY,
          { width: contentW - 40 }
        );
      doc
        .font("Helvetica")
        .fontSize(7.5)
        .fillColor(MUTED)
        .text(`${i + 1} / ${range.count}`, pageW - marginR - 30, footerY, { width: 30, align: "right" });
    }

    doc.end();
  });
}
