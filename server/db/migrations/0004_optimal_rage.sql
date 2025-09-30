CREATE TABLE `event_review` (
	`id` text PRIMARY KEY NOT NULL,
	`event_id` text NOT NULL,
	`registration_id` text NOT NULL,
	`attendee_email` text NOT NULL,
	`attendee_name` text NOT NULL,
	`rating` integer NOT NULL,
	`review_text` text,
	`review_token` text NOT NULL,
	`token_used` integer DEFAULT false NOT NULL,
	`submitted_at` integer,
	`created_at` integer DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer)) NOT NULL,
	FOREIGN KEY (`event_id`) REFERENCES `event`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`registration_id`) REFERENCES `event_registration`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `event_review_review_token_unique` ON `event_review` (`review_token`);