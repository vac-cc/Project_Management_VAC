import { pgTable, serial, text, integer, jsonb, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const sessionStatusEnum = pgEnum("session_status", ["in_progress", "completed", "paused"]);

export const onboardingSessionsTable = pgTable("onboarding_sessions", {
  id: serial("id").primaryKey(),
  clientName: text("client_name").notNull(),
  clientCompany: text("client_company").notNull(),
  clientEmail: text("client_email"),
  accountManager: text("account_manager").notNull(),
  status: sessionStatusEnum("status").notNull().default("in_progress"),
  currentStep: integer("current_step").notNull().default(1),
  totalSteps: integer("total_steps").notNull().default(10),
  completionPercent: integer("completion_percent").notNull().default(0),
  responses: jsonb("responses").notNull().default({}),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  completedAt: timestamp("completed_at"),
});

export const insertSessionSchema = createInsertSchema(onboardingSessionsTable).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  completedAt: true,
  status: true,
  currentStep: true,
  totalSteps: true,
  completionPercent: true,
  responses: true,
});

export type InsertSession = z.infer<typeof insertSessionSchema>;
export type OnboardingSession = typeof onboardingSessionsTable.$inferSelect;
