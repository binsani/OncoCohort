CREATE TABLE `cohorts` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`owner_id` text NOT NULL,
	`name` text NOT NULL,
	`cancer_type` text NOT NULL,
	`status` text DEFAULT 'Draft' NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_cohorts_owner_created` ON `cohorts` (`owner_id`,`created_at`);
--> statement-breakpoint
PRAGMA optimize;
