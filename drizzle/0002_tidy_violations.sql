CREATE TABLE `studdy_assignment` (
	`id` text(255) PRIMARY KEY NOT NULL,
	`name` text(255) NOT NULL,
	`description` text(255),
	`due_date` integer NOT NULL,
	`points` integer NOT NULL,
	`type` text NOT NULL,
	`user_id` text(255),
	`course_id` text(255),
	FOREIGN KEY (`user_id`) REFERENCES `studdy_user`(`id`) ON UPDATE cascade ON DELETE cascade,
	FOREIGN KEY (`course_id`) REFERENCES `studdy_course`(`id`) ON UPDATE cascade ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `studdy_course` (
	`id` text(255) PRIMARY KEY NOT NULL,
	`name` text(255) NOT NULL,
	`description` text,
	`start_date` integer NOT NULL,
	`end_date` integer NOT NULL,
	`credits` real,
	`code` text(255),
	`user_id` text(255),
	FOREIGN KEY (`user_id`) REFERENCES `studdy_user`(`id`) ON UPDATE cascade ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `assignment_user_id_idx` ON `studdy_assignment` (`user_id`);--> statement-breakpoint
CREATE INDEX `assignment_course_id_idx` ON `studdy_assignment` (`course_id`);--> statement-breakpoint
CREATE INDEX `course_user_id_idx` ON `studdy_course` (`user_id`);