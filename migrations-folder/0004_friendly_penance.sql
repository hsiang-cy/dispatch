ALTER TABLE "compute" ADD COLUMN "created_at" timestamp with time zone DEFAULT now();--> statement-breakpoint
ALTER TABLE "compute" ADD COLUMN "updated_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "destination" ADD COLUMN "created_at" timestamp with time zone DEFAULT now();--> statement-breakpoint
ALTER TABLE "destination" ADD COLUMN "updated_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "order_destinations" ADD COLUMN "created_at" timestamp with time zone DEFAULT now();--> statement-breakpoint
ALTER TABLE "order_destinations" ADD COLUMN "updated_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "order_vehicles" ADD COLUMN "created_at" timestamp with time zone DEFAULT now();--> statement-breakpoint
ALTER TABLE "order_vehicles" ADD COLUMN "updated_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "created_at" timestamp with time zone DEFAULT now();--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "updated_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "created_at" timestamp with time zone DEFAULT now();--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "updated_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "vehicle" ADD COLUMN "created_at" timestamp with time zone DEFAULT now();--> statement-breakpoint
ALTER TABLE "vehicle" ADD COLUMN "updated_at" timestamp with time zone;