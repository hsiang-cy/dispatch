CREATE TABLE "point_distance" (
	"id" uuid PRIMARY KEY DEFAULT uuidv7() NOT NULL,
	"a_point" integer,
	"b_point" integer,
	"distance_from_a_b" integer NOT NULL,
	"info" jsonb
);
--> statement-breakpoint
ALTER TABLE "point_distance" ADD CONSTRAINT "point_distance_a_point_destination_id_fk" FOREIGN KEY ("a_point") REFERENCES "public"."destination"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "point_distance" ADD CONSTRAINT "point_distance_b_point_destination_id_fk" FOREIGN KEY ("b_point") REFERENCES "public"."destination"("id") ON DELETE no action ON UPDATE no action;