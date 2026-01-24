ALTER TABLE "orders" ADD COLUMN "destination_snapshot" jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "vehicle_snapshot" jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "compute" DROP COLUMN "destination_snapshot";--> statement-breakpoint
ALTER TABLE "compute" DROP COLUMN "vehicle_snapshot";