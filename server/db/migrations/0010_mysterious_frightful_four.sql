CREATE TABLE `blog_post_translations` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`blog_post_id` integer NOT NULL,
	`locale` text NOT NULL,
	`slug` text NOT NULL,
	`title` text NOT NULL,
	`excerpt` text,
	`body` text NOT NULL,
	`reading_time` integer,
	`updated_at` integer,
	FOREIGN KEY (`blog_post_id`) REFERENCES `blog_posts`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `blog_trans_slug_locale_idx` ON `blog_post_translations` (`slug`,`locale`);--> statement-breakpoint
CREATE UNIQUE INDEX `blog_trans_post_locale_idx` ON `blog_post_translations` (`blog_post_id`,`locale`);--> statement-breakpoint
CREATE TABLE `project_translations` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`project_id` integer NOT NULL,
	`locale` text NOT NULL,
	`slug` text NOT NULL,
	`title` text NOT NULL,
	`subtitle` text,
	`body` text NOT NULL,
	`features` text,
	`learned` text,
	`challenges` text,
	`updated_at` integer,
	FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `proj_trans_slug_locale_idx` ON `project_translations` (`slug`,`locale`);--> statement-breakpoint
CREATE UNIQUE INDEX `proj_trans_proj_locale_idx` ON `project_translations` (`project_id`,`locale`);--> statement-breakpoint
DROP INDEX `blog_posts_slug_locale_idx`;--> statement-breakpoint
DROP INDEX `blog_posts_translation_key_locale_idx`;--> statement-breakpoint
CREATE UNIQUE INDEX `blog_posts_translation_key_unique` ON `blog_posts` (`translation_key`);--> statement-breakpoint
ALTER TABLE `blog_posts` DROP COLUMN `slug`;--> statement-breakpoint
ALTER TABLE `blog_posts` DROP COLUMN `locale`;--> statement-breakpoint
ALTER TABLE `blog_posts` DROP COLUMN `title`;--> statement-breakpoint
ALTER TABLE `blog_posts` DROP COLUMN `excerpt`;--> statement-breakpoint
ALTER TABLE `blog_posts` DROP COLUMN `body`;--> statement-breakpoint
ALTER TABLE `blog_posts` DROP COLUMN `reading_time`;--> statement-breakpoint
DROP INDEX `projects_slug_locale_idx`;--> statement-breakpoint
DROP INDEX `projects_translation_key_locale_idx`;--> statement-breakpoint
CREATE UNIQUE INDEX `projects_translation_key_unique` ON `projects` (`translation_key`);--> statement-breakpoint
ALTER TABLE `projects` DROP COLUMN `slug`;--> statement-breakpoint
ALTER TABLE `projects` DROP COLUMN `locale`;--> statement-breakpoint
ALTER TABLE `projects` DROP COLUMN `title`;--> statement-breakpoint
ALTER TABLE `projects` DROP COLUMN `subtitle`;--> statement-breakpoint
ALTER TABLE `projects` DROP COLUMN `body`;--> statement-breakpoint
ALTER TABLE `projects` DROP COLUMN `features`;--> statement-breakpoint
ALTER TABLE `projects` DROP COLUMN `learned`;--> statement-breakpoint
ALTER TABLE `projects` DROP COLUMN `challenges`;