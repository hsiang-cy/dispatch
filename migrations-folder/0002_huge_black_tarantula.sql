ALTER TABLE "compute" RENAME COLUMN "users_id" TO "user_id";--> statement-breakpoint
ALTER TABLE "destination" RENAME COLUMN "users_id" TO "user_id";--> statement-breakpoint
ALTER TABLE "orders" RENAME COLUMN "users_id" TO "user_id";--> statement-breakpoint
ALTER TABLE "vehicle" RENAME COLUMN "users_id" TO "user_id";--> statement-breakpoint
ALTER TABLE "compute" DROP CONSTRAINT "compute_users_id_user_id_fk";
--> statement-breakpoint
ALTER TABLE "destination" DROP CONSTRAINT "destination_users_id_user_id_fk";
--> statement-breakpoint
ALTER TABLE "orders" DROP CONSTRAINT "orders_users_id_user_id_fk";
--> statement-breakpoint
ALTER TABLE "vehicle" DROP CONSTRAINT "vehicle_users_id_user_id_fk";
--> statement-breakpoint
DROP INDEX "compute_users_id_index";--> statement-breakpoint
DROP INDEX "destination_users_id_index";--> statement-breakpoint
DROP INDEX "orders_users_id_index";--> statement-breakpoint
DROP INDEX "vehicle_users_id_index";--> statement-breakpoint
ALTER TABLE "compute" ADD CONSTRAINT "compute_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "destination" ADD CONSTRAINT "destination_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "vehicle" ADD CONSTRAINT "vehicle_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "compute_user_id_index" ON "compute" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "destination_user_id_index" ON "destination" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "orders_user_id_index" ON "orders" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "vehicle_user_id_index" ON "vehicle" USING btree ("user_id");