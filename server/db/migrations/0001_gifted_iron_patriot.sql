CREATE TABLE `member` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text,
	`name_family` text NOT NULL,
	`name_middle` text,
	`name_first` text NOT NULL,
	`sex` text,
	`dob` text,
	`address` text,
	`telephone` text,
	`fax` text,
	`email` text NOT NULL,
	`avatar` text,
	`position` text,
	`employer` text,
	`department` text,
	`qualifications` text,
	`experience` text,
	`mother_tongue` text,
	`other_languages_json` text,
	`other_language_text` text,
	`expertise_description` text,
	`expertise_other` text,
	`agency` text,
	`type_of_work` text,
	`type_of_work_other` text,
	`retired_since` text,
	`membership_type` text,
	`status` text,
	`joined_date` text,
	`expiry_date` text,
	`fees` integer,
	`payment_reference` text,
	`created_at` integer DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer)) NOT NULL,
	`updated_at` integer DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer)) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `member_email_unique` ON `member` (`email`);--> statement-breakpoint
CREATE TABLE `member_expertise` (
	`id` text PRIMARY KEY NOT NULL,
	`member_id` text NOT NULL,
	`label` text NOT NULL,
	`created_at` integer DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer)) NOT NULL,
	FOREIGN KEY (`member_id`) REFERENCES `member`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `member_history` (
	`id` text PRIMARY KEY NOT NULL,
	`member_id` text NOT NULL,
	`action` text NOT NULL,
	`type` text NOT NULL,
	`date` integer DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer)) NOT NULL,
	`notes` text,
	`created_at` integer DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer)) NOT NULL,
	FOREIGN KEY (`member_id`) REFERENCES `member`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `member_publication` (
	`id` text PRIMARY KEY NOT NULL,
	`member_id` text NOT NULL,
	`filename` text NOT NULL,
	`created_at` integer DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer)) NOT NULL,
	FOREIGN KEY (`member_id`) REFERENCES `member`(`id`) ON UPDATE no action ON DELETE cascade
);
