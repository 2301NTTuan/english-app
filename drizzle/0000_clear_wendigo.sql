CREATE TYPE "public"."cefr_level" AS ENUM('A1', 'A2', 'B1', 'B2', 'C1', 'C2');--> statement-breakpoint
CREATE TYPE "public"."expression_kind" AS ENUM('idiom', 'phrasal-verb', 'collocation', 'common-expression');--> statement-breakpoint
CREATE TYPE "public"."knowledge_type" AS ENUM('vocabulary', 'grammar', 'expression');--> statement-breakpoint
CREATE TYPE "public"."path_item_status" AS ENUM('needs-foundation', 'recommended', 'in-progress', 'reviewing', 'strong', 'mastered', 'locked');--> statement-breakpoint
CREATE TYPE "public"."review_status" AS ENUM('new', 'learning', 'review', 'relearning');--> statement-breakpoint
CREATE TABLE "audit_logs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid,
	"action" text NOT NULL,
	"entity_type" text,
	"entity_id" text,
	"metadata" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "auth_sessions" (
	"token_hash" text PRIMARY KEY NOT NULL,
	"user_id" uuid NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"last_seen_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "collocations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"content_id" text NOT NULL,
	"phrase" text NOT NULL,
	"level" "cefr_level",
	"meaning" text,
	"vietnamese_meaning" text,
	"example" text,
	"common_error" text,
	"topics" text[] DEFAULT '{}' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "content_versions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"version" text NOT NULL,
	"checksum" text NOT NULL,
	"published_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "exercise_templates" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"content_id" text NOT NULL,
	"knowledge_type" "knowledge_type" NOT NULL,
	"knowledge_content_id" text NOT NULL,
	"exercise_type" text NOT NULL,
	"difficulty" integer NOT NULL,
	"template" jsonb NOT NULL,
	"active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "expression_progress" (
	"user_id" uuid NOT NULL,
	"expression_id" uuid NOT NULL,
	"mastery" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "expression_progress_user_id_expression_id_pk" PRIMARY KEY("user_id","expression_id")
);
--> statement-breakpoint
CREATE TABLE "expressions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"content_id" text NOT NULL,
	"kind" "expression_kind" NOT NULL,
	"expression" text NOT NULL,
	"base_verb" text,
	"meaning" text NOT NULL,
	"vietnamese_meaning" text,
	"level" "cefr_level" NOT NULL,
	"examples" text[] DEFAULT '{}' NOT NULL,
	"usage_notes" text,
	"register" text,
	"separability" text,
	"topics" text[] DEFAULT '{}' NOT NULL,
	"active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "grammar_lessons" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"grammar_topic_id" uuid NOT NULL,
	"english_explanation" text NOT NULL,
	"vietnamese_explanation" text,
	"structures" text[] DEFAULT '{}' NOT NULL,
	"examples" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"common_mistakes" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"related_structures" text[] DEFAULT '{}' NOT NULL,
	"content_version_id" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "grammar_prerequisites" (
	"grammar_topic_id" uuid NOT NULL,
	"prerequisite_topic_id" uuid NOT NULL,
	CONSTRAINT "grammar_prerequisites_grammar_topic_id_prerequisite_topic_id_pk" PRIMARY KEY("grammar_topic_id","prerequisite_topic_id")
);
--> statement-breakpoint
CREATE TABLE "grammar_progress" (
	"user_id" uuid NOT NULL,
	"grammar_topic_id" uuid NOT NULL,
	"mastery" integer DEFAULT 0 NOT NULL,
	"subtopic_mastery" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "grammar_progress_user_id_grammar_topic_id_pk" PRIMARY KEY("user_id","grammar_topic_id")
);
--> statement-breakpoint
CREATE TABLE "grammar_subtopics" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"grammar_topic_id" uuid NOT NULL,
	"content_id" text NOT NULL,
	"title" text NOT NULL,
	"position" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "grammar_topics" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"content_id" text NOT NULL,
	"title" text NOT NULL,
	"level" "cefr_level" NOT NULL,
	"category" text NOT NULL,
	"description" text NOT NULL,
	"active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "learning_path_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"learning_path_id" uuid NOT NULL,
	"knowledge_type" "knowledge_type" NOT NULL,
	"knowledge_content_id" text NOT NULL,
	"status" "path_item_status" NOT NULL,
	"priority" integer NOT NULL,
	"reason" text NOT NULL,
	"position" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "learning_paths" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"version" integer DEFAULT 1 NOT NULL,
	"generated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"inputs" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"active" boolean DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE TABLE "learning_preferences" (
	"user_id" uuid PRIMARY KEY NOT NULL,
	"current_level" "cefr_level" DEFAULT 'B1' NOT NULL,
	"daily_target" integer DEFAULT 25 NOT NULL,
	"max_new_words_per_day" integer DEFAULT 10 NOT NULL,
	"max_new_grammar_per_day" integer DEFAULT 1 NOT NULL,
	"desired_retention" real DEFAULT 0.9 NOT NULL,
	"study_intensity" text DEFAULT 'balanced' NOT NULL,
	"interface_language" text DEFAULT 'en' NOT NULL,
	"show_vietnamese" boolean DEFAULT true NOT NULL,
	"onboarding_completed_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "mistakes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"knowledge_type" "knowledge_type" NOT NULL,
	"knowledge_content_id" text NOT NULL,
	"subtopic_content_id" text,
	"exercise_type" text NOT NULL,
	"question" text NOT NULL,
	"user_answer" text NOT NULL,
	"correct_answer" text NOT NULL,
	"repeat_count" integer DEFAULT 1 NOT NULL,
	"resolved" boolean DEFAULT false NOT NULL,
	"last_occurred_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "password_reset_tokens" (
	"token_hash" text PRIMARY KEY NOT NULL,
	"user_id" uuid NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"used_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "placement_answers" (
	"placement_attempt_id" uuid NOT NULL,
	"question_id" text NOT NULL,
	"answer" text NOT NULL,
	"correct" boolean NOT NULL,
	"level" "cefr_level" NOT NULL,
	"dimension" text NOT NULL,
	"topic" text NOT NULL,
	"position" integer NOT NULL,
	CONSTRAINT "placement_answers_placement_attempt_id_question_id_pk" PRIMARY KEY("placement_attempt_id","question_id")
);
--> statement-breakpoint
CREATE TABLE "placement_attempts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"idempotency_key" text NOT NULL,
	"estimated_level" "cefr_level",
	"dimension_scores" jsonb,
	"topic_scores" jsonb,
	"strong_areas" text[] DEFAULT '{}' NOT NULL,
	"weak_areas" text[] DEFAULT '{}' NOT NULL,
	"started_at" timestamp with time zone DEFAULT now() NOT NULL,
	"completed_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "review_states" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"knowledge_type" "knowledge_type" NOT NULL,
	"knowledge_content_id" text NOT NULL,
	"status" "review_status" DEFAULT 'new' NOT NULL,
	"difficulty" real DEFAULT 5 NOT NULL,
	"stability" double precision DEFAULT 1 NOT NULL,
	"due_at" timestamp with time zone NOT NULL,
	"last_reviewed_at" timestamp with time zone,
	"scheduled_days" integer DEFAULT 0 NOT NULL,
	"elapsed_days" real DEFAULT 0 NOT NULL,
	"review_count" integer DEFAULT 0 NOT NULL,
	"correct_count" integer DEFAULT 0 NOT NULL,
	"incorrect_count" integer DEFAULT 0 NOT NULL,
	"lapses" integer DEFAULT 0 NOT NULL,
	"version" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "study_session_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"study_session_id" uuid NOT NULL,
	"knowledge_type" "knowledge_type" NOT NULL,
	"knowledge_content_id" text NOT NULL,
	"exercise_type" text NOT NULL,
	"answer" text,
	"correct" boolean,
	"rating" text,
	"position" integer NOT NULL,
	"review_version" integer
);
--> statement-breakpoint
CREATE TABLE "study_sessions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"idempotency_key" text NOT NULL,
	"started_at" timestamp with time zone NOT NULL,
	"completed_at" timestamp with time zone,
	"correct" integer DEFAULT 0 NOT NULL,
	"total" integer DEFAULT 0 NOT NULL,
	"minutes" integer DEFAULT 0 NOT NULL,
	"summary" jsonb DEFAULT '{}'::jsonb NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_state_snapshots" (
	"user_id" uuid PRIMARY KEY NOT NULL,
	"schema_version" integer DEFAULT 1 NOT NULL,
	"state" jsonb NOT NULL,
	"imported_legacy_at" timestamp with time zone,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"password_hash" text NOT NULL,
	"email_verified_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "vocabulary_content" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"content_id" text NOT NULL,
	"word" text NOT NULL,
	"lemma" text,
	"part_of_speech" text NOT NULL,
	"level" "cefr_level" NOT NULL,
	"frequency_rank" integer,
	"frequency_band" text,
	"topics" text[] DEFAULT '{}' NOT NULL,
	"tags" text[] DEFAULT '{}' NOT NULL,
	"active" boolean DEFAULT true NOT NULL,
	"content_version_id" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "vocabulary_examples" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"vocabulary_id" uuid NOT NULL,
	"position" integer NOT NULL,
	"sentence" text NOT NULL,
	"vietnamese_translation" text
);
--> statement-breakpoint
CREATE TABLE "vocabulary_meanings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"vocabulary_id" uuid NOT NULL,
	"position" integer NOT NULL,
	"english_definition" text NOT NULL,
	"vietnamese_meaning" text,
	"usage_notes" text
);
--> statement-breakpoint
CREATE TABLE "vocabulary_progress" (
	"user_id" uuid NOT NULL,
	"vocabulary_id" uuid NOT NULL,
	"recognition" integer DEFAULT 0 NOT NULL,
	"recall" integer DEFAULT 0 NOT NULL,
	"context" integer DEFAULT 0 NOT NULL,
	"spelling" integer DEFAULT 0 NOT NULL,
	"overall" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "vocabulary_progress_user_id_vocabulary_id_pk" PRIMARY KEY("user_id","vocabulary_id")
);
--> statement-breakpoint
CREATE TABLE "vocabulary_relations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"source_vocabulary_id" uuid NOT NULL,
	"target_word" text NOT NULL,
	"target_vocabulary_id" uuid,
	"relation_type" text NOT NULL,
	"strength" integer,
	"register" text,
	"usage_note" text
);
--> statement-breakpoint
CREATE TABLE "word_families" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"vocabulary_id" uuid NOT NULL,
	"word" text NOT NULL,
	"part_of_speech" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "auth_sessions" ADD CONSTRAINT "auth_sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "expression_progress" ADD CONSTRAINT "expression_progress_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "expression_progress" ADD CONSTRAINT "expression_progress_expression_id_expressions_id_fk" FOREIGN KEY ("expression_id") REFERENCES "public"."expressions"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "grammar_lessons" ADD CONSTRAINT "grammar_lessons_grammar_topic_id_grammar_topics_id_fk" FOREIGN KEY ("grammar_topic_id") REFERENCES "public"."grammar_topics"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "grammar_lessons" ADD CONSTRAINT "grammar_lessons_content_version_id_content_versions_id_fk" FOREIGN KEY ("content_version_id") REFERENCES "public"."content_versions"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "grammar_prerequisites" ADD CONSTRAINT "grammar_prerequisites_grammar_topic_id_grammar_topics_id_fk" FOREIGN KEY ("grammar_topic_id") REFERENCES "public"."grammar_topics"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "grammar_prerequisites" ADD CONSTRAINT "grammar_prerequisites_prerequisite_topic_id_grammar_topics_id_fk" FOREIGN KEY ("prerequisite_topic_id") REFERENCES "public"."grammar_topics"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "grammar_progress" ADD CONSTRAINT "grammar_progress_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "grammar_progress" ADD CONSTRAINT "grammar_progress_grammar_topic_id_grammar_topics_id_fk" FOREIGN KEY ("grammar_topic_id") REFERENCES "public"."grammar_topics"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "grammar_subtopics" ADD CONSTRAINT "grammar_subtopics_grammar_topic_id_grammar_topics_id_fk" FOREIGN KEY ("grammar_topic_id") REFERENCES "public"."grammar_topics"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "learning_path_items" ADD CONSTRAINT "learning_path_items_learning_path_id_learning_paths_id_fk" FOREIGN KEY ("learning_path_id") REFERENCES "public"."learning_paths"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "learning_paths" ADD CONSTRAINT "learning_paths_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "learning_preferences" ADD CONSTRAINT "learning_preferences_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "mistakes" ADD CONSTRAINT "mistakes_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "placement_answers" ADD CONSTRAINT "placement_answers_placement_attempt_id_placement_attempts_id_fk" FOREIGN KEY ("placement_attempt_id") REFERENCES "public"."placement_attempts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "placement_attempts" ADD CONSTRAINT "placement_attempts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "review_states" ADD CONSTRAINT "review_states_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "study_session_items" ADD CONSTRAINT "study_session_items_study_session_id_study_sessions_id_fk" FOREIGN KEY ("study_session_id") REFERENCES "public"."study_sessions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "study_sessions" ADD CONSTRAINT "study_sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_state_snapshots" ADD CONSTRAINT "user_state_snapshots_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "vocabulary_content" ADD CONSTRAINT "vocabulary_content_content_version_id_content_versions_id_fk" FOREIGN KEY ("content_version_id") REFERENCES "public"."content_versions"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "vocabulary_examples" ADD CONSTRAINT "vocabulary_examples_vocabulary_id_vocabulary_content_id_fk" FOREIGN KEY ("vocabulary_id") REFERENCES "public"."vocabulary_content"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "vocabulary_meanings" ADD CONSTRAINT "vocabulary_meanings_vocabulary_id_vocabulary_content_id_fk" FOREIGN KEY ("vocabulary_id") REFERENCES "public"."vocabulary_content"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "vocabulary_progress" ADD CONSTRAINT "vocabulary_progress_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "vocabulary_progress" ADD CONSTRAINT "vocabulary_progress_vocabulary_id_vocabulary_content_id_fk" FOREIGN KEY ("vocabulary_id") REFERENCES "public"."vocabulary_content"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "vocabulary_relations" ADD CONSTRAINT "vocabulary_relations_source_vocabulary_id_vocabulary_content_id_fk" FOREIGN KEY ("source_vocabulary_id") REFERENCES "public"."vocabulary_content"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "vocabulary_relations" ADD CONSTRAINT "vocabulary_relations_target_vocabulary_id_vocabulary_content_id_fk" FOREIGN KEY ("target_vocabulary_id") REFERENCES "public"."vocabulary_content"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "word_families" ADD CONSTRAINT "word_families_vocabulary_id_vocabulary_content_id_fk" FOREIGN KEY ("vocabulary_id") REFERENCES "public"."vocabulary_content"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "audit_log_user_date_idx" ON "audit_logs" USING btree ("user_id","created_at");--> statement-breakpoint
CREATE INDEX "audit_log_action_idx" ON "audit_logs" USING btree ("action");--> statement-breakpoint
CREATE INDEX "auth_sessions_user_idx" ON "auth_sessions" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "auth_sessions_expiry_idx" ON "auth_sessions" USING btree ("expires_at");--> statement-breakpoint
CREATE UNIQUE INDEX "collocations_content_id_unique" ON "collocations" USING btree ("content_id");--> statement-breakpoint
CREATE INDEX "collocations_phrase_idx" ON "collocations" USING btree ("phrase");--> statement-breakpoint
CREATE UNIQUE INDEX "content_versions_version_unique" ON "content_versions" USING btree ("version");--> statement-breakpoint
CREATE UNIQUE INDEX "exercise_template_content_unique" ON "exercise_templates" USING btree ("content_id");--> statement-breakpoint
CREATE INDEX "exercise_template_knowledge_idx" ON "exercise_templates" USING btree ("knowledge_type","knowledge_content_id");--> statement-breakpoint
CREATE UNIQUE INDEX "expressions_content_id_unique" ON "expressions" USING btree ("content_id");--> statement-breakpoint
CREATE INDEX "expressions_kind_level_idx" ON "expressions" USING btree ("kind","level");--> statement-breakpoint
CREATE INDEX "expressions_expression_idx" ON "expressions" USING btree ("expression");--> statement-breakpoint
CREATE UNIQUE INDEX "grammar_lesson_topic_unique" ON "grammar_lessons" USING btree ("grammar_topic_id");--> statement-breakpoint
CREATE INDEX "grammar_prerequisite_reverse_idx" ON "grammar_prerequisites" USING btree ("prerequisite_topic_id");--> statement-breakpoint
CREATE INDEX "grammar_progress_user_idx" ON "grammar_progress" USING btree ("user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "grammar_subtopic_content_unique" ON "grammar_subtopics" USING btree ("content_id");--> statement-breakpoint
CREATE INDEX "grammar_subtopic_topic_idx" ON "grammar_subtopics" USING btree ("grammar_topic_id");--> statement-breakpoint
CREATE UNIQUE INDEX "grammar_topics_content_id_unique" ON "grammar_topics" USING btree ("content_id");--> statement-breakpoint
CREATE INDEX "grammar_topics_level_idx" ON "grammar_topics" USING btree ("level");--> statement-breakpoint
CREATE UNIQUE INDEX "learning_path_item_unique" ON "learning_path_items" USING btree ("learning_path_id","knowledge_type","knowledge_content_id");--> statement-breakpoint
CREATE INDEX "learning_path_item_order_idx" ON "learning_path_items" USING btree ("learning_path_id","position");--> statement-breakpoint
CREATE INDEX "learning_path_user_active_idx" ON "learning_paths" USING btree ("user_id","active");--> statement-breakpoint
CREATE INDEX "mistakes_user_active_idx" ON "mistakes" USING btree ("user_id","resolved");--> statement-breakpoint
CREATE INDEX "mistakes_user_knowledge_idx" ON "mistakes" USING btree ("user_id","knowledge_type","knowledge_content_id");--> statement-breakpoint
CREATE INDEX "password_reset_user_idx" ON "password_reset_tokens" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "password_reset_expiry_idx" ON "password_reset_tokens" USING btree ("expires_at");--> statement-breakpoint
CREATE UNIQUE INDEX "placement_answer_position_unique" ON "placement_answers" USING btree ("placement_attempt_id","position");--> statement-breakpoint
CREATE UNIQUE INDEX "placement_user_idempotency_unique" ON "placement_attempts" USING btree ("user_id","idempotency_key");--> statement-breakpoint
CREATE INDEX "placement_user_date_idx" ON "placement_attempts" USING btree ("user_id","completed_at");--> statement-breakpoint
CREATE UNIQUE INDEX "review_state_user_knowledge_unique" ON "review_states" USING btree ("user_id","knowledge_type","knowledge_content_id");--> statement-breakpoint
CREATE INDEX "review_state_due_idx" ON "review_states" USING btree ("user_id","due_at");--> statement-breakpoint
CREATE UNIQUE INDEX "study_session_item_position_unique" ON "study_session_items" USING btree ("study_session_id","position");--> statement-breakpoint
CREATE UNIQUE INDEX "study_session_user_idempotency_unique" ON "study_sessions" USING btree ("user_id","idempotency_key");--> statement-breakpoint
CREATE INDEX "study_session_user_date_idx" ON "study_sessions" USING btree ("user_id","started_at");--> statement-breakpoint
CREATE UNIQUE INDEX "users_email_unique" ON "users" USING btree ("email");--> statement-breakpoint
CREATE UNIQUE INDEX "vocabulary_content_id_unique" ON "vocabulary_content" USING btree ("content_id");--> statement-breakpoint
CREATE INDEX "vocabulary_word_idx" ON "vocabulary_content" USING btree ("word");--> statement-breakpoint
CREATE INDEX "vocabulary_level_frequency_idx" ON "vocabulary_content" USING btree ("level","frequency_rank");--> statement-breakpoint
CREATE UNIQUE INDEX "vocabulary_example_position_unique" ON "vocabulary_examples" USING btree ("vocabulary_id","position");--> statement-breakpoint
CREATE UNIQUE INDEX "vocabulary_meaning_position_unique" ON "vocabulary_meanings" USING btree ("vocabulary_id","position");--> statement-breakpoint
CREATE INDEX "vocabulary_progress_user_idx" ON "vocabulary_progress" USING btree ("user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "vocabulary_relation_unique" ON "vocabulary_relations" USING btree ("source_vocabulary_id","target_word","relation_type");--> statement-breakpoint
CREATE INDEX "vocabulary_relation_target_idx" ON "vocabulary_relations" USING btree ("target_vocabulary_id");--> statement-breakpoint
CREATE UNIQUE INDEX "word_family_unique" ON "word_families" USING btree ("vocabulary_id","word","part_of_speech");