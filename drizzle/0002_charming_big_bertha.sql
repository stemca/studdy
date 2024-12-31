DROP INDEX "assignment_user_id_idx";--> statement-breakpoint
DROP INDEX "assignment_course_id_idx";--> statement-breakpoint
DROP INDEX "course_user_id_idx";--> statement-breakpoint
DROP INDEX "users_table_email_unique";--> statement-breakpoint
DROP INDEX "users_email_idx";--> statement-breakpoint
DROP INDEX "verification_code_table_user_id_unique";--> statement-breakpoint
DROP INDEX "verification_codes_email_idx";--> statement-breakpoint
ALTER TABLE `account_table` ALTER COLUMN "created_at" TO "created_at" integer DEFAULT (unixepoch() * 1000);--> statement-breakpoint
CREATE INDEX `assignment_user_id_idx` ON `assignment_table` (`user_id`);--> statement-breakpoint
CREATE INDEX `assignment_course_id_idx` ON `assignment_table` (`course_id`);--> statement-breakpoint
CREATE INDEX `course_user_id_idx` ON `course_table` (`user_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `users_table_email_unique` ON `users_table` (`email`);--> statement-breakpoint
CREATE INDEX `users_email_idx` ON `users_table` (`email`);--> statement-breakpoint
CREATE UNIQUE INDEX `verification_code_table_user_id_unique` ON `verification_code_table` (`user_id`);--> statement-breakpoint
CREATE INDEX `verification_codes_email_idx` ON `verification_code_table` (`user_id`);--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_assignment_table` (
	`created_at` integer DEFAULT (unixepoch() * 1000),
	`name` text(255) NOT NULL,
	`description` text(1000),
	`due_date` integer NOT NULL,
	`points` integer NOT NULL,
	`type` text NOT NULL,
	`user_id` text(255) NOT NULL,
	`course_id` text(255),
	PRIMARY KEY(`user_id`, `course_id`),
	FOREIGN KEY (`user_id`) REFERENCES `users_table`(`id`) ON UPDATE cascade ON DELETE cascade,
	FOREIGN KEY (`course_id`) REFERENCES `course_table`(`id`) ON UPDATE cascade ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_assignment_table`("created_at", "name", "description", "due_date", "points", "type", "user_id", "course_id") SELECT "created_at", "name", "description", "due_date", "points", "type", "user_id", "course_id" FROM `assignment_table`;--> statement-breakpoint
DROP TABLE `assignment_table`;--> statement-breakpoint
ALTER TABLE `__new_assignment_table` RENAME TO `assignment_table`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
ALTER TABLE `course_table` ALTER COLUMN "created_at" TO "created_at" integer DEFAULT (unixepoch() * 1000);--> statement-breakpoint
CREATE TABLE `__new_session_table` (
	`id` text(255) PRIMARY KEY NOT NULL,
	`user_id` text(255) NOT NULL,
	`expires_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users_table`(`id`) ON UPDATE cascade ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_session_table`("id", "user_id", "expires_at") SELECT "id", "user_id", "expires_at" FROM `session_table`;--> statement-breakpoint
DROP TABLE `session_table`;--> statement-breakpoint
ALTER TABLE `__new_session_table` RENAME TO `session_table`;--> statement-breakpoint
ALTER TABLE `users_table` ALTER COLUMN "created_at" TO "created_at" integer DEFAULT (unixepoch() * 1000);--> statement-breakpoint
CREATE TABLE `__new_verification_code_table` (
	`created_at` integer DEFAULT (unixepoch() * 1000),
	`id` text(255) PRIMARY KEY NOT NULL,
	`code` text(6) NOT NULL,
	`user_id` text(255) NOT NULL,
	`email` text(255) NOT NULL,
	`expires_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users_table`(`id`) ON UPDATE cascade ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_verification_code_table`("created_at", "id", "code", "user_id", "email", "expires_at") SELECT "created_at", "id", "code", "user_id", "email", "expires_at" FROM `verification_code_table`;--> statement-breakpoint
DROP TABLE `verification_code_table`;--> statement-breakpoint
ALTER TABLE `__new_verification_code_table` RENAME TO `verification_code_table`;