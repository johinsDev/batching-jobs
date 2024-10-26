PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_serverTasks` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`job` text NOT NULL,
	`serverId` text,
	`order` integer NOT NULL,
	`state` text DEFAULT 'pending' NOT NULL,
	`createdAt` text DEFAULT (current_timestamp) NOT NULL,
	`updatedAt` text DEFAULT (current_timestamp) NOT NULL,
	FOREIGN KEY (`serverId`) REFERENCES `server`(`id`) ON UPDATE cascade ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_serverTasks`("id", "job", "serverId", "order", "state", "createdAt", "updatedAt") SELECT "id", "job", "serverId", "order", "state", "createdAt", "updatedAt" FROM `serverTasks`;--> statement-breakpoint
DROP TABLE `serverTasks`;--> statement-breakpoint
ALTER TABLE `__new_serverTasks` RENAME TO `serverTasks`;--> statement-breakpoint
PRAGMA foreign_keys=ON;