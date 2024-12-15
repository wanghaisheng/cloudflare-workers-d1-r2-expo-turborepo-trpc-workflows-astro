PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_moments` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`userId` text NOT NULL,
	`text` text NOT NULL,
	`timestamp` integer NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_moments`("id", "userId", "text", "timestamp") SELECT "id", "userId", "text", "timestamp" FROM `moments`;--> statement-breakpoint
DROP TABLE `moments`;--> statement-breakpoint
ALTER TABLE `__new_moments` RENAME TO `moments`;--> statement-breakpoint
PRAGMA foreign_keys=ON;