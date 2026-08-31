ALTER TABLE "collocations" ADD COLUMN "status" text DEFAULT 'draft' NOT NULL;--> statement-breakpoint
ALTER TABLE "collocations" ADD COLUMN "active" boolean DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE "expressions" ADD COLUMN "status" text DEFAULT 'draft' NOT NULL;--> statement-breakpoint
CREATE INDEX "collocations_release_idx" ON "collocations" USING btree ("status","level");--> statement-breakpoint
CREATE INDEX "expressions_release_idx" ON "expressions" USING btree ("status","kind","level");--> statement-breakpoint
ALTER TABLE "collocations" ADD CONSTRAINT "collocations_status_valid" CHECK ("collocations"."status" in ('draft', 'validated', 'reviewed', 'published', 'retired'));--> statement-breakpoint
ALTER TABLE "expressions" ADD CONSTRAINT "expressions_metadata_valid" CHECK ("expressions"."status" in ('draft', 'validated', 'reviewed', 'published', 'retired') and ("expressions"."separability" is null or "expressions"."separability" in ('separable', 'inseparable', 'both')));