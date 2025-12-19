CREATE TABLE `users` (
	`id` integer PRIMARY KEY NOT NULL,
	`auth_provider_id` text,
	`email` text NOT NULL,
	`name` text,
	`created_at` integer DEFAULT (strftime('%s', 'now'))
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_auth_provider_id_unique` ON `users` (`auth_provider_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);