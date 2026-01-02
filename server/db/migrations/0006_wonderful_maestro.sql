CREATE TABLE `applications_to_contacts` (
	`application_id` integer NOT NULL,
	`contact_id` integer NOT NULL,
	FOREIGN KEY (`application_id`) REFERENCES `applications`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`contact_id`) REFERENCES `contacts`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `contacts` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`salutation` text,
	`position` text,
	`email` text,
	`phone` text,
	`company_id` integer,
	FOREIGN KEY (`company_id`) REFERENCES `companies`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
ALTER TABLE `addresses` DROP COLUMN `contact_name`;--> statement-breakpoint
ALTER TABLE `addresses` DROP COLUMN `contact_position`;--> statement-breakpoint
ALTER TABLE `addresses` DROP COLUMN `contact_email`;--> statement-breakpoint
ALTER TABLE `addresses` DROP COLUMN `contact_phone`;