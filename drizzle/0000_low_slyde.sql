CREATE TABLE `studdy_session` (
	`id` text(255) PRIMARY KEY NOT NULL,
	`user_id` text(255) NOT NULL,
	`expires_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `studdy_user`(`id`) ON UPDATE cascade ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `studdy_user` (
	`id` text(255) PRIMARY KEY NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer,
	`email` text(255) NOT NULL,
	`password` text(255),
	`email_verified` integer DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE `studdy_verification_code` (
	`id` text(255) PRIMARY KEY NOT NULL,
	`code` text NOT NULL,
	`user_id` text(255) NOT NULL,
	`email` text(255) NOT NULL,
	`expires_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `studdy_user`(`id`) ON UPDATE cascade ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `studdy_user_email_unique` ON `studdy_user` (`email`);--> statement-breakpoint
CREATE UNIQUE INDEX `studdy_verification_code_user_id_unique` ON `studdy_verification_code` (`user_id`);