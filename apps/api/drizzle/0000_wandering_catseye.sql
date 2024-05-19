DO $$ BEGIN
 CREATE TYPE "public"."account_provider" AS ENUM('GITHUB');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."role" AS ENUM('ADMIN', 'MEMBER', 'BILLING');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."token_type" AS ENUM('PASSWORD_RECOVER');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "accounts" (
	"id" text,
	"account_provider" "account_provider",
	"provider_account_id" text,
	CONSTRAINT "accounts_provider_account_id_unique" UNIQUE("provider_account_id"),
	CONSTRAINT "accounts_account_provider_provider_account_id_unique" UNIQUE("account_provider","provider_account_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" text,
	"name" text,
	"email" text,
	"password_hash" text,
	"avatar_url" text,
	"created_at" timestamp (3) DEFAULT now() NOT NULL,
	"updated_at" timestamp (3)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "invites" (
	"id" text,
	"email" text NOT NULL,
	"role" "role",
	"user_id" text,
	"organization_id" text,
	"created_at" timestamp (3) DEFAULT now() NOT NULL,
	CONSTRAINT "invites_email_organization_id_unique" UNIQUE("email","organization_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "members" (
	"id" text,
	"user_id" text,
	"role" "role" DEFAULT 'MEMBER',
	"organization_id" text,
	CONSTRAINT "members_organization_id_user_id_unique" UNIQUE("organization_id","user_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "organizations" (
	"id" text,
	"user_id" text,
	"name" text,
	"slug" text,
	"domain" text,
	"should_attach_users_by_domain" boolean DEFAULT false,
	"avatar_url" text,
	"created_at" timestamp (3) DEFAULT now() NOT NULL,
	"updated_at" timestamp (3),
	CONSTRAINT "organizations_slug_unique" UNIQUE("slug"),
	CONSTRAINT "organizations_domain_unique" UNIQUE("domain")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "projects" (
	"id" text,
	"user_id" text,
	"organization_id" text,
	"name" text,
	"description" text,
	"slug" text,
	"avatar_url" text,
	"created_at" timestamp (3) DEFAULT now() NOT NULL,
	"updated_at" timestamp (3),
	CONSTRAINT "projects_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "tokens" (
	"id" text,
	"token_type" "token_type",
	"user_id" text,
	"created_at" timestamp (3) DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "email_idx" ON "invites" ("email");