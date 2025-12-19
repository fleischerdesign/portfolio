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
CREATE TABLE `companies` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`address_id` integer,
	FOREIGN KEY (`address_id`) REFERENCES `addresses`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `name_idx` ON `companies` (`name`);--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_applications` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`company_id` integer NOT NULL,
	`title` text NOT NULL,
	`subtitle` text,
	`slug` text NOT NULL,
	`url` text,
	`application_date` integer,
	`response_date` integer,
	`interviews` text DEFAULT '[]',
	`status` text DEFAULT 'draft' NOT NULL,
	`notes` text DEFAULT '[]',
	`created_at` integer DEFAULT (strftime('%s', 'now')),
	`updated_at` integer,
	FOREIGN KEY (`company_id`) REFERENCES `companies`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_applications`("id", "company_id", "title", "subtitle", "slug", "url", "application_date", "response_date", "interviews", "status", "notes", "created_at", "updated_at") SELECT "id", "company_id", "title", "subtitle", "slug", "url", "application_date", "response_date", "interviews", "status", "notes", "created_at", "updated_at" FROM `applications`;--> statement-breakpoint
DROP TABLE `applications`;--> statement-breakpoint
ALTER TABLE `__new_applications` RENAME TO `applications`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE UNIQUE INDEX `applications_slug_unique` ON `applications` (`slug`);