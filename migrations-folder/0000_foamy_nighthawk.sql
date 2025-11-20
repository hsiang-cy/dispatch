CREATE TYPE "public"."compute_status" AS ENUM('initial', 'pending', 'computing', 'completed', 'failed', 'cancelled');--> statement-breakpoint
CREATE TYPE "public"."status" AS ENUM('inactive', 'active', 'deleted');--> statement-breakpoint
CREATE TYPE "public"."vehicle_type" AS ENUM('truck', 'car', 'scooter', 'big_truck');--> statement-breakpoint
CREATE TABLE "compute" (
	"users_id" integer NOT NULL,
	"id" serial PRIMARY KEY NOT NULL,
	"status" "status" DEFAULT 'active' NOT NULL,
	"order_id" integer NOT NULL,
	"matrix" jsonb NOT NULL,
	"compute_status" "compute_status" DEFAULT 'initial' NOT NULL,
	"start_time" timestamp DEFAULT now() NOT NULL,
	"end_time" timestamp,
	"compute_policy" text NOT NULL,
	"destination_snapshot" jsonb NOT NULL,
	"vehicle_snapshot" jsonb NOT NULL,
	"result" jsonb,
	"fail_reason" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"info" jsonb
);
--> statement-breakpoint
CREATE TABLE "destination" (
	"users_id" integer NOT NULL,
	"id" serial PRIMARY KEY NOT NULL,
	"status" "status" DEFAULT 'active' NOT NULL,
	"name" text NOT NULL,
	"is_depot" boolean DEFAULT false NOT NULL,
	"comment" text,
	"time_window" jsonb NOT NULL,
	"address" text NOT NULL,
	"location" jsonb NOT NULL,
	"operation_time" integer DEFAULT 0 NOT NULL,
	"demand" integer DEFAULT 0 NOT NULL,
	"priority" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"info" jsonb
);
--> statement-breakpoint
CREATE TABLE "order_destinations" (
	"id" serial PRIMARY KEY NOT NULL,
	"order_id" integer NOT NULL,
	"destination_id" integer NOT NULL,
	"demand" integer DEFAULT 1 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"info" jsonb,
	CONSTRAINT "order_destinations_order_id_destination_id_unique" UNIQUE("order_id","destination_id")
);
--> statement-breakpoint
CREATE TABLE "order_vehicles" (
	"id" serial PRIMARY KEY NOT NULL,
	"order_id" integer NOT NULL,
	"vehicle_id" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"info" jsonb
);
--> statement-breakpoint
CREATE TABLE "orders" (
	"users_id" integer NOT NULL,
	"id" serial PRIMARY KEY NOT NULL,
	"status" "status" DEFAULT 'active' NOT NULL,
	"order_number" text NOT NULL,
	"scheduled_time" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"info" jsonb
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" serial PRIMARY KEY NOT NULL,
	"status" "status" DEFAULT 'active' NOT NULL,
	"account" text NOT NULL,
	"password" text NOT NULL,
	"name" text NOT NULL,
	"email" text,
	"phone" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"info" jsonb,
	CONSTRAINT "user_account_unique" UNIQUE("account")
);
--> statement-breakpoint
CREATE TABLE "vehicle" (
	"users_id" integer NOT NULL,
	"id" serial PRIMARY KEY NOT NULL,
	"status" "status" DEFAULT 'active' NOT NULL,
	"vehicle_number" text NOT NULL,
	"vehicle_type" "vehicle_type" DEFAULT 'truck' NOT NULL,
	"capacity" integer DEFAULT 0 NOT NULL,
	"comment" text,
	"max_distance" integer DEFAULT 0 NOT NULL,
	"max_working_time" integer DEFAULT 0 NOT NULL,
	"depot_id" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"info" jsonb,
	CONSTRAINT "vehicle_vehicle_number_unique" UNIQUE("vehicle_number")
);
--> statement-breakpoint
ALTER TABLE "compute" ADD CONSTRAINT "compute_users_id_user_id_fk" FOREIGN KEY ("users_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "compute" ADD CONSTRAINT "compute_order_id_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "destination" ADD CONSTRAINT "destination_users_id_user_id_fk" FOREIGN KEY ("users_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "order_destinations" ADD CONSTRAINT "order_destinations_order_id_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "order_destinations" ADD CONSTRAINT "order_destinations_destination_id_destination_id_fk" FOREIGN KEY ("destination_id") REFERENCES "public"."destination"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "order_vehicles" ADD CONSTRAINT "order_vehicles_order_id_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "order_vehicles" ADD CONSTRAINT "order_vehicles_vehicle_id_vehicle_id_fk" FOREIGN KEY ("vehicle_id") REFERENCES "public"."vehicle"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_users_id_user_id_fk" FOREIGN KEY ("users_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "vehicle" ADD CONSTRAINT "vehicle_users_id_user_id_fk" FOREIGN KEY ("users_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "vehicle" ADD CONSTRAINT "vehicle_depot_id_destination_id_fk" FOREIGN KEY ("depot_id") REFERENCES "public"."destination"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "compute_users_id_index" ON "compute" USING btree ("users_id");--> statement-breakpoint
CREATE INDEX "compute_order_id_index" ON "compute" USING btree ("order_id");--> statement-breakpoint
CREATE INDEX "compute_compute_status_index" ON "compute" USING btree ("compute_status");--> statement-breakpoint
CREATE INDEX "destination_users_id_index" ON "destination" USING btree ("users_id");--> statement-breakpoint
CREATE INDEX "destination_name_index" ON "destination" USING btree ("name");--> statement-breakpoint
CREATE INDEX "destination_address_index" ON "destination" USING btree ("address");--> statement-breakpoint
CREATE INDEX "order_destinations_order_id_index" ON "order_destinations" USING btree ("order_id");--> statement-breakpoint
CREATE INDEX "order_destinations_destination_id_index" ON "order_destinations" USING btree ("destination_id");--> statement-breakpoint
CREATE INDEX "order_vehicles_order_id_index" ON "order_vehicles" USING btree ("order_id");--> statement-breakpoint
CREATE INDEX "order_vehicles_vehicle_id_index" ON "order_vehicles" USING btree ("vehicle_id");--> statement-breakpoint
CREATE INDEX "orders_users_id_index" ON "orders" USING btree ("users_id");--> statement-breakpoint
CREATE INDEX "orders_order_number_index" ON "orders" USING btree ("order_number");--> statement-breakpoint
CREATE INDEX "user_account_index" ON "user" USING btree ("account");--> statement-breakpoint
CREATE INDEX "user_account_gin" ON "user" USING gin (to_tsvector('english', "account"));--> statement-breakpoint
CREATE INDEX "vehicle_users_id_index" ON "vehicle" USING btree ("users_id");--> statement-breakpoint
CREATE INDEX "vehicle_depot_id_index" ON "vehicle" USING btree ("depot_id");