CREATE TABLE `addresses` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text,
	`contact_name` text,
	`contact_position` text,
	`contact_email` text,
	`contact_phone` text,
	`street` text,
	`house_number` text,
	`zipcode` integer,
	`city` text
);
--> statement-breakpoint
CREATE TABLE `applications` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`company_id` integer NOT NULL,
	`title` text NOT NULL,
	`subtitle` text,
	`slug` text NOT NULL,
	`url` text,
	`application_date` integer,
	`response_date` integer,
	`status` text DEFAULT 'draft' NOT NULL,
	`notes` text DEFAULT '[]',
	`body` text,
	`created_at` integer DEFAULT (strftime('%s', 'now')),
	`updated_at` integer,
	FOREIGN KEY (`company_id`) REFERENCES `companies`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `applications_slug_unique` ON `applications` (`slug`);--> statement-breakpoint
CREATE TABLE `companies` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`address_id` integer,
	FOREIGN KEY (`address_id`) REFERENCES `addresses`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `name_idx` ON `companies` (`name`);--> statement-breakpoint
CREATE TABLE `interviews` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`application_id` integer NOT NULL,
	`date` integer NOT NULL,
	`notes` text,
	FOREIGN KEY (`application_id`) REFERENCES `applications`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` integer PRIMARY KEY NOT NULL,
	`auth_provider_id` text NOT NULL,
	`email` text NOT NULL,
	`name` text,
	`created_at` integer DEFAULT (strftime('%s', 'now'))
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_auth_provider_id_unique` ON `users` (`auth_provider_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);