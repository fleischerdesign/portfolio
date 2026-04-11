CREATE TABLE `now_entry_translations` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`now_entry_id` integer NOT NULL,
	`locale` text NOT NULL,
	`content` text NOT NULL,
	`updated_at` integer,
	FOREIGN KEY (`now_entry_id`) REFERENCES `now_entries`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `now_trans_entry_locale_idx` ON `now_entry_translations` (`now_entry_id`,`locale`);
--> statement-breakpoint
INSERT INTO `now_entry_translations` (`now_entry_id`, `locale`, `content`)
	SELECT `id`, 'de', `content_de` FROM `now_entries` WHERE `content_de` IS NOT NULL;
--> statement-breakpoint
INSERT INTO `now_entry_translations` (`now_entry_id`, `locale`, `content`)
	SELECT `id`, 'en', `content_en` FROM `now_entries` WHERE `content_en` IS NOT NULL;
--> statement-breakpoint
ALTER TABLE `now_entries` DROP COLUMN `content_de`;--> statement-breakpoint
ALTER TABLE `now_entries` DROP COLUMN `content_en`;