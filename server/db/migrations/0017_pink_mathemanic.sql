CREATE TABLE `applications_to_documents` (
	`application_id` integer NOT NULL,
	`document_id` integer NOT NULL,
	`sort_order` integer DEFAULT 0 NOT NULL,
	FOREIGN KEY (`application_id`) REFERENCES `applications`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`document_id`) REFERENCES `documents`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `documents` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`filename` text NOT NULL,
	`file_type` text NOT NULL,
	`file_size` integer,
	`is_default` integer DEFAULT false NOT NULL,
	`created_at` integer DEFAULT (strftime('%s', 'now'))
);
