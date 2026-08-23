ALTER TABLE "vocabulary_content" ADD COLUMN "cefr_basis" text DEFAULT 'editorial-estimate' NOT NULL;--> statement-breakpoint
ALTER TABLE "vocabulary_content" ADD COLUMN "frequency_basis" text DEFAULT 'editorial-band' NOT NULL;--> statement-breakpoint
ALTER TABLE "vocabulary_content" ADD COLUMN "status" text DEFAULT 'draft' NOT NULL;--> statement-breakpoint
ALTER TABLE "vocabulary_content" ADD COLUMN "provenance_id" text DEFAULT 'legacy-unclassified' NOT NULL;--> statement-breakpoint
UPDATE "vocabulary_content" SET "frequency_rank" = NULL WHERE "frequency_rank" IS NOT NULL;--> statement-breakpoint
CREATE INDEX "vocabulary_release_idx" ON "vocabulary_content" USING btree ("status","level","frequency_band");--> statement-breakpoint
ALTER TABLE "vocabulary_content" ADD CONSTRAINT "vocabulary_metadata_basis_valid" CHECK ("vocabulary_content"."cefr_basis" in ('editorial-estimate', 'source-backed') and "vocabulary_content"."frequency_basis" in ('editorial-band', 'source-backed-rank') and "vocabulary_content"."status" in ('draft', 'validated', 'reviewed', 'published', 'retired') and (("vocabulary_content"."frequency_basis" = 'editorial-band' and "vocabulary_content"."frequency_rank" is null) or ("vocabulary_content"."frequency_basis" = 'source-backed-rank' and "vocabulary_content"."frequency_rank" is not null)));
