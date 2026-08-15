import { index, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const cohorts = sqliteTable("cohorts", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  ownerId: text("owner_id").notNull(),
  name: text("name").notNull(),
  cancerType: text("cancer_type").notNull(),
  status: text("status").notNull().default("Draft"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
}, (table) => [index("idx_cohorts_owner_created").on(table.ownerId, table.createdAt)]);

export type Cohort = typeof cohorts.$inferSelect;

export const patients = sqliteTable("patients", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  ownerId: text("owner_id").notNull(),
  patientCode: text("patient_code").notNull(),
  age: integer("age").notNull(),
  sex: text("sex").notNull(),
  cancerType: text("cancer_type").notNull(),
  stage: text("stage").notNull(),
  biomarker: text("biomarker").notNull().default("Not recorded"),
  status: text("status").notNull().default("Screening"),
  site: text("site").notNull(),
  consentStatus: text("consent_status").notNull().default("Pending"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
}, (table) => [
  index("idx_patients_owner_created").on(table.ownerId, table.createdAt),
  index("idx_patients_owner_cancer").on(table.ownerId, table.cancerType),
]);

export const cohortPatients = sqliteTable("cohort_patients", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  cohortId: integer("cohort_id").notNull(),
  patientId: integer("patient_id").notNull(),
  ownerId: text("owner_id").notNull(),
  enrolledAt: integer("enrolled_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
}, (table) => [index("idx_cohort_patients_owner_cohort").on(table.ownerId, table.cohortId)]);

export const auditEvents = sqliteTable("audit_events", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  ownerId: text("owner_id").notNull(),
  actorEmail: text("actor_email").notNull(),
  action: text("action").notNull(),
  entityType: text("entity_type").notNull(),
  entityId: integer("entity_id").notNull(),
  detail: text("detail").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
}, (table) => [index("idx_audit_owner_created").on(table.ownerId, table.createdAt)]);
