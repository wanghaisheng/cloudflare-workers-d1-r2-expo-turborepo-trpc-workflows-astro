CREATE TABLE `recaps` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`userId` text NOT NULL,
	`text` text NOT NULL,
	`createdAt` integer NOT NULL,
	`type` text NOT NULL,
	`image` text
);
