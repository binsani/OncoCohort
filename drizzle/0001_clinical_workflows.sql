CREATE TABLE `patients` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`owner_id` text NOT NULL,
	`patient_code` text NOT NULL,
	`age` integer NOT NULL,
	`sex` text NOT NULL,
	`cancer_type` text NOT NULL,
	`stage` text NOT NULL,
	`biomarker` text DEFAULT 'Not recorded' NOT NULL,
	`status` text DEFAULT 'Screening' NOT NULL,
	`site` text NOT NULL,
	`consent_status` text DEFAULT 'Pending' NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_patients_owner_created` ON `patients` (`owner_id`,`created_at`);
--> statement-breakpoint
CREATE INDEX `idx_patients_owner_cancer` ON `patients` (`owner_id`,`cancer_type`);
--> statement-breakpoint
CREATE TABLE `cohort_patients` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`cohort_id` integer NOT NULL,
	`patient_id` integer NOT NULL,
	`owner_id` text NOT NULL,
	`enrolled_at` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_cohort_patients_owner_cohort` ON `cohort_patients` (`owner_id`,`cohort_id`);
--> statement-breakpoint
CREATE TABLE `audit_events` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`owner_id` text NOT NULL,
	`actor_email` text NOT NULL,
	`action` text NOT NULL,
	`entity_type` text NOT NULL,
	`entity_id` integer NOT NULL,
	`detail` text NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_audit_owner_created` ON `audit_events` (`owner_id`,`created_at`);
--> statement-breakpoint
PRAGMA optimize;
