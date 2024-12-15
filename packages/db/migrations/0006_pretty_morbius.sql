CREATE TABLE `userMeta` (
	`userId` text PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`createdAt` integer NOT NULL,
	`timezone` text DEFAULT 'America/Los_Angeles' NOT NULL,
	`lastRecapAt` integer
);
