CREATE TABLE "audit_logs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text,
	"action" text NOT NULL,
	"entity_type" text,
	"entity_id" text,
	"metadata" jsonb,
	"ip_address" text,
	"user_agent" text,
	"method" text,
	"path" text,
	"status_code" integer,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "security_events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"event_type" text NOT NULL,
	"severity" text DEFAULT 'info' NOT NULL,
	"source_ip" text,
	"user_id" text,
	"details" text,
	"resolved" boolean DEFAULT false NOT NULL,
	"resolved_by" text,
	"resolved_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "system_metrics_snapshots" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"cpu_usage" real DEFAULT 0 NOT NULL,
	"memory_usage" real DEFAULT 0 NOT NULL,
	"memory_total" real DEFAULT 0 NOT NULL,
	"heap_used" real DEFAULT 0 NOT NULL,
	"heap_total" real DEFAULT 0 NOT NULL,
	"active_connections" integer DEFAULT 0 NOT NULL,
	"requests_per_minute" integer DEFAULT 0 NOT NULL,
	"avg_response_time_ms" real DEFAULT 0 NOT NULL,
	"error_count" integer DEFAULT 0 NOT NULL,
	"uptime_seconds" real DEFAULT 0 NOT NULL,
	"db_pool_size" integer DEFAULT 0 NOT NULL,
	"db_pool_available" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "security_events" ADD CONSTRAINT "security_events_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "security_events" ADD CONSTRAINT "security_events_resolved_by_user_id_fk" FOREIGN KEY ("resolved_by") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "audit_logs_user_id_idx" ON "audit_logs" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "audit_logs_action_idx" ON "audit_logs" USING btree ("action");--> statement-breakpoint
CREATE INDEX "audit_logs_created_at_idx" ON "audit_logs" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "security_events_severity_idx" ON "security_events" USING btree ("severity");--> statement-breakpoint
CREATE INDEX "security_events_resolved_idx" ON "security_events" USING btree ("resolved");--> statement-breakpoint
CREATE INDEX "security_events_created_at_idx" ON "security_events" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "system_metrics_created_at_idx" ON "system_metrics_snapshots" USING btree ("created_at");