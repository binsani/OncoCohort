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
