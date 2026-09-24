import { pgTable, serial, integer, text, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { onboardingSessionsTable } from "./sessions";

export const strategicBriefsTable = pgTable("strategic_briefs", {
  id: serial("id").primaryKey(),
  sessionId: integer("session_id").notNull().references(() => onboardingSessionsTable.id, { onDelete: "cascade" }),
  clientSnapshot: jsonb("client_snapshot").notNull().default({}),
  keyOpportunities: jsonb("key_opportunities").notNull().default([]),
  strategicRisks: jsonb("strategic_risks").notNull().default([]),
  audienceInsights: jsonb("audience_insights").notNull().default([]),
  messagingHypotheses: jsonb("messaging_hypotheses").notNull().default([]),
  recommendedNextSteps: jsonb("recommended_next_steps").notNull().default([]),
  internalNotes: text("internal_notes"),
  redFlags: jsonb("red_flags").notNull().default([]),
  readingSuggestions: jsonb("reading_suggestions").notNull().default([]),
  industryContext: jsonb("industry_context").notNull().default({}),
  generatedAt: timestamp("generated_at").notNull().defaultNow(),
});

export const insertBriefSchema = createInsertSchema(strategicBriefsTable).omit({
  id: true,
  generatedAt: true,
});

export type InsertBrief = z.infer<typeof insertBriefSchema>;
export type StrategicBrief = typeof strategicBriefsTable.$inferSelect;
