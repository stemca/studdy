CREATE TABLE `studdy_account` (
	`provider_id` text(255) NOT NULL,
	`provider_user_id` text(255) NOT NULL,
	`user_id` text(255) NOT NULL,
	PRIMARY KEY(`provider_id`, `provider_user_id`),
	FOREIGN KEY (`user_id`) REFERENCES `studdy_user`(`id`) ON UPDATE cascade ON DELETE cascade
);
