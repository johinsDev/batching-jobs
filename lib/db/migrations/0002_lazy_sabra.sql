CREATE TABLE `serverTasks` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`job` text NOT NULL,
	`serverId` text,
	`order` integer NOT NULL,
	`createdAt` text DEFAULT (current_timestamp) NOT NULL,
	`updatedAt` text DEFAULT (current_timestamp) NOT NULL,
	FOREIGN KEY (`serverId`) REFERENCES `server`(`id`) ON UPDATE no action ON DELETE no action
);
