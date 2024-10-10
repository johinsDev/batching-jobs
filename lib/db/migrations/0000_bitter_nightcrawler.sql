CREATE TABLE `app_accounts` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` integer NOT NULL,
	`account_type` text NOT NULL,
	`github_id` text,
	`google_id` text,
	`password` text,
	`salt` text,
	`created_at` integer,
	`updated_at` integer,
	`deleted_at` integer,
	FOREIGN KEY (`user_id`) REFERENCES `app_user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `app_accounts_user_id_unique` ON `app_accounts` (`user_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `app_accounts_github_id_unique` ON `app_accounts` (`github_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `app_accounts_google_id_unique` ON `app_accounts` (`google_id`);--> statement-breakpoint
CREATE TABLE `app_profile` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` integer NOT NULL,
	`display_name` text,
	`image` text,
	`image_blur_data` text,
	`bio` text DEFAULT '' NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `app_user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `app_profile_user_id_unique` ON `app_profile` (`user_id`);--> statement-breakpoint
CREATE TABLE `app_user` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text(100),
	`email` text(255) NOT NULL,
	`password_hash` text,
	`role` text(50) DEFAULT 'user' NOT NULL,
	`email_verified` integer,
	`created_at` integer,
	`updated_at` integer,
	`deleted_at` integer
);
--> statement-breakpoint
CREATE UNIQUE INDEX `app_user_email_unique` ON `app_user` (`email`);