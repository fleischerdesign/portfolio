CREATE TABLE `now_entries` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`content_de` text NOT NULL,
	`content_en` text NOT NULL,
	`icon` text,
	`created_at` integer DEFAULT (strftime('%s', 'now'))
);
