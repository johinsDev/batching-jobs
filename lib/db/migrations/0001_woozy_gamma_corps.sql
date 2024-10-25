CREATE TABLE `jobBatch` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`totalJobs` integer NOT NULL,
	`pendingJobs` integer NOT NULL,
	`failedJobs` integer NOT NULL,
	`createdAt` text DEFAULT (current_timestamp) NOT NULL,
	`updatedAt` text DEFAULT (current_timestamp) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `server` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`batchId` text,
	`type` text DEFAULT 'web' NOT NULL,
	`provisionedAt` text,
	`createdAt` text DEFAULT (current_timestamp) NOT NULL,
	`updatedAt` text DEFAULT (current_timestamp) NOT NULL,
	FOREIGN KEY (`batchId`) REFERENCES `jobBatch`(`id`) ON UPDATE no action ON DELETE no action
);
