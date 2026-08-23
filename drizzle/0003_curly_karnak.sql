CREATE TABLE "placement_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"content_id" text NOT NULL,
	"domain" text NOT NULL,
	"level" "cefr_level" NOT NULL,
	"topic" text NOT NULL,
	"subtopic" text NOT NULL,
	"prompt" text NOT NULL,
	"options" jsonb NOT NULL,
	"answer" text NOT NULL,
	"explanation" text NOT NULL,
	"difficulty" real NOT NULL,
	"discrimination" real NOT NULL,
	"status" text NOT NULL,
	"provenance_id" text NOT NULL,
	"passage_content_id" text,
	"content_version_id" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "placement_item_parameters_valid" CHECK ("placement_items"."difficulty" between 0 and 1 and "placement_items"."discrimination" between 0.45 and 2.2)
);
--> statement-breakpoint
CREATE TABLE "placement_passages" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"content_id" text NOT NULL,
	"title" text NOT NULL,
	"passage" text NOT NULL,
	"level" "cefr_level" NOT NULL,
	"status" text NOT NULL,
	"provenance_id" text NOT NULL,
	"content_version_id" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "placement_answers" ADD COLUMN "subtopic" text;--> statement-breakpoint
ALTER TABLE "placement_answers" ADD COLUMN "difficulty" real;--> statement-breakpoint
ALTER TABLE "placement_answers" ADD COLUMN "discrimination" real;--> statement-breakpoint
ALTER TABLE "placement_answers" ADD COLUMN "response_time_ms" integer;--> statement-breakpoint
ALTER TABLE "placement_attempts" ADD COLUMN "overall_ability" real;--> statement-breakpoint
ALTER TABLE "placement_attempts" ADD COLUMN "standard_error" real;--> statement-breakpoint
ALTER TABLE "placement_attempts" ADD COLUMN "confidence_score" integer;--> statement-breakpoint
ALTER TABLE "placement_attempts" ADD COLUMN "confidence_label" text;--> statement-breakpoint
ALTER TABLE "placement_attempts" ADD COLUMN "domain_estimates" jsonb;--> statement-breakpoint
ALTER TABLE "placement_items" ADD CONSTRAINT "placement_items_content_version_id_content_versions_id_fk" FOREIGN KEY ("content_version_id") REFERENCES "public"."content_versions"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "placement_passages" ADD CONSTRAINT "placement_passages_content_version_id_content_versions_id_fk" FOREIGN KEY ("content_version_id") REFERENCES "public"."content_versions"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "placement_item_content_unique" ON "placement_items" USING btree ("content_id");--> statement-breakpoint
CREATE INDEX "placement_item_selection_idx" ON "placement_items" USING btree ("status","domain","level");--> statement-breakpoint
CREATE UNIQUE INDEX "placement_passage_content_unique" ON "placement_passages" USING btree ("content_id");--> statement-breakpoint
CREATE INDEX "placement_passage_level_status_idx" ON "placement_passages" USING btree ("level","status");--> statement-breakpoint
ALTER TABLE "placement_answers" ADD CONSTRAINT "placement_answer_parameters_valid" CHECK (("placement_answers"."difficulty" is null or "placement_answers"."difficulty" between 0 and 1) and ("placement_answers"."discrimination" is null or "placement_answers"."discrimination" between 0.45 and 2.2) and ("placement_answers"."response_time_ms" is null or "placement_answers"."response_time_ms" >= 0));--> statement-breakpoint
ALTER TABLE "placement_attempts" ADD CONSTRAINT "placement_confidence_valid" CHECK ("placement_attempts"."confidence_score" is null or "placement_attempts"."confidence_score" between 0 and 100);