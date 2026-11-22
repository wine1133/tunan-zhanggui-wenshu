CREATE TABLE `column_info` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`type` text NOT NULL,
	`role` text NOT NULL,
	`examples` text DEFAULT '[]' NOT NULL,
	`description` text NOT NULL,
	`alias` text DEFAULT '[]' NOT NULL,
	`table_id` text NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_column_info_table` ON `column_info` (`table_id`);--> statement-breakpoint
CREATE TABLE `column_metric` (
	`column_id` text NOT NULL,
	`metric_id` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `dim_customer` (
	`customer_id` text PRIMARY KEY NOT NULL,
	`customer_name` text NOT NULL,
	`gender` text NOT NULL,
	`member_level` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `dim_date` (
	`date_id` integer PRIMARY KEY NOT NULL,
	`year` integer NOT NULL,
	`quarter` text NOT NULL,
	`month` integer NOT NULL,
	`day` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `dim_product` (
	`product_id` text PRIMARY KEY NOT NULL,
	`product_name` text NOT NULL,
	`category` text NOT NULL,
	`brand` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `dim_region` (
	`region_id` text PRIMARY KEY NOT NULL,
	`province` text NOT NULL,
	`region_name` text NOT NULL,
	`country` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `fact_order` (
	`order_id` text PRIMARY KEY NOT NULL,
	`customer_id` text NOT NULL,
	`product_id` text NOT NULL,
	`date_id` integer NOT NULL,
	`region_id` text NOT NULL,
	`order_quantity` integer NOT NULL,
	`order_amount` real NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_fact_order_date` ON `fact_order` (`date_id`);--> statement-breakpoint
CREATE INDEX `idx_fact_order_region` ON `fact_order` (`region_id`);--> statement-breakpoint
CREATE INDEX `idx_fact_order_product` ON `fact_order` (`product_id`);--> statement-breakpoint
CREATE INDEX `idx_fact_order_customer` ON `fact_order` (`customer_id`);--> statement-breakpoint
CREATE TABLE `metric_info` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`description` text NOT NULL,
	`relevant_columns` text DEFAULT '[]' NOT NULL,
	`alias` text DEFAULT '[]' NOT NULL
);
--> statement-breakpoint
CREATE TABLE `query_history` (
	`id` text PRIMARY KEY NOT NULL,
	`session_key` text DEFAULT 'public' NOT NULL,
	`question` text NOT NULL,
	`sql` text NOT NULL,
	`row_count` integer DEFAULT 0 NOT NULL,
	`elapsed_ms` integer DEFAULT 0 NOT NULL,
	`status` text DEFAULT 'success' NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_query_history_created` ON `query_history` (`created_at`);--> statement-breakpoint
CREATE TABLE `table_info` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`role` text NOT NULL,
	`description` text NOT NULL
);
