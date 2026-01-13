PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_addresses` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text,
	`street` text,
	`house_number` text,
	`zipcode` text,
	`city` text
);
--> statement-breakpoint
INSERT INTO `__new_addresses`("id", "name", "street", "house_number", "zipcode", "city") SELECT "id", "name", "street", "house_number", "zipcode", "city" FROM `addresses`;--> statement-breakpoint
DROP TABLE `addresses`;--> statement-breakpoint
ALTER TABLE `__new_addresses` RENAME TO `addresses`;--> statement-breakpoint
PRAGMA foreign_keys=ON;