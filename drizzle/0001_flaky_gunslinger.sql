CREATE TABLE `account_table` (
	`created_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	`provider_id` text(255) NOT NULL,
	`provider_user_id` text(255) NOT NULL,
	`user_id` text(255) NOT NULL,
	PRIMARY KEY(`provider_id`, `provider_user_id`),
	FOREIGN KEY (`user_id`) REFERENCES `users_table`(`id`) ON UPDATE cascade ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `assignment_table` (
	`created_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	`name` text(255) NOT NULL,
	`description` text(1000),
	`due_date` integer NOT NULL,
	`points` integer NOT NULL,
	`type` text NOT NULL,
	`user_id` text(255),
	`course_id` text(255),
	PRIMARY KEY(`user_id`, `course_id`),
	FOREIGN KEY (`user_id`) REFERENCES `users_table`(`id`) ON UPDATE cascade ON DELETE cascade,
	FOREIGN KEY (`course_id`) REFERENCES `course_table`(`id`) ON UPDATE cascade ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `assignment_user_id_idx` ON `assignment_table` (`user_id`);--> statement-breakpoint
CREATE INDEX `assignment_course_id_idx` ON `assignment_table` (`course_id`);--> statement-breakpoint
CREATE TABLE `course_table` (
	`created_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	`id` text(255) PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`description` text(255),
	`start_date` integer NOT NULL,
	`end_date` integer NOT NULL,
	`credits` real,
	`code` text,
	`user_id` text(255) NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users_table`(`id`) ON UPDATE cascade ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `course_user_id_idx` ON `course_table` (`user_id`);--> statement-breakpoint
CREATE TABLE `session_table` (
	`created_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	`id` text(255) PRIMARY KEY NOT NULL,
	`user_id` text(255),
	`expires_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users_table`(`id`) ON UPDATE cascade ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `verification_code_table` (
	`created_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	`id` text(255) PRIMARY KEY NOT NULL,
	`code` text(6) NOT NULL,
	`user_id` text(255),
	`email` text(255) NOT NULL,
	`expires_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users_table`(`id`) ON UPDATE cascade ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `verification_code_table_user_id_unique` ON `verification_code_table` (`user_id`);--> statement-breakpoint
CREATE INDEX `verification_codes_email_idx` ON `verification_code_table` (`user_id`);--> statement-breakpoint
ALTER TABLE `users_table` ADD `created_at` integer DEFAULT (unixepoch() * 1000) NOT NULL;--> statement-breakpoint
ALTER TABLE `users_table` ADD `email` text(255) NOT NULL;--> statement-breakpoint
ALTER TABLE `users_table` ADD `password` text(255);--> statement-breakpoint
ALTER TABLE `users_table` ADD `email_verified` integer DEFAULT false;--> statement-breakpoint
CREATE UNIQUE INDEX `users_table_email_unique` ON `users_table` (`email`);--> statement-breakpoint
CREATE INDEX `users_email_idx` ON `users_table` (`email`);