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
	"id" text PRIMARY KEY NOT NULL,
	"account_provider" "account_provider" NOT NULL,
	"provider_account_id" text NOT NULL,
	"user_id" text NOT NULL,
	CONSTRAINT "accounts_id_unique" UNIQUE("id"),
	CONSTRAINT "accounts_provider_account_id_unique" UNIQUE("provider_account_id"),
	CONSTRAINT "accounts_account_provider_user_id_unique" UNIQUE("account_provider","user_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text,
	"email" text NOT NULL,
	"password_hash" text,
	"avatar_url" text,
	"created_at" timestamp (3) DEFAULT now() NOT NULL,
	"updated_at" timestamp (3) NOT NULL,
	CONSTRAINT "users_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "invites" (
	"id" text PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"role" "role" NOT NULL,
	"user_id" text,
	"organization_id" text NOT NULL,
	"created_at" timestamp (3) DEFAULT now() NOT NULL,
	CONSTRAINT "invites_id_unique" UNIQUE("id"),
	CONSTRAINT "invites_email_organization_id_unique" UNIQUE("email","organization_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "members" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"role" "role" DEFAULT 'MEMBER' NOT NULL,
	"organization_id" text NOT NULL,
	CONSTRAINT "members_id_unique" UNIQUE("id"),
	CONSTRAINT "members_organization_id_user_id_unique" UNIQUE("organization_id","user_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "organizations" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"domain" text,
	"should_attach_users_by_domain" boolean DEFAULT false NOT NULL,
	"avatar_url" text,
	"created_at" timestamp (3) DEFAULT now() NOT NULL,
	"updated_at" timestamp (3) NOT NULL,
	CONSTRAINT "organizations_id_unique" UNIQUE("id"),
	CONSTRAINT "organizations_slug_unique" UNIQUE("slug"),
	CONSTRAINT "organizations_domain_unique" UNIQUE("domain")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "projects" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"organization_id" text NOT NULL,
	"name" text NOT NULL,
	"description" text NOT NULL,
	"slug" text NOT NULL,
	"avatar_url" text,
	"created_at" timestamp (3) DEFAULT now() NOT NULL,
	"updated_at" timestamp (3) NOT NULL,
	CONSTRAINT "projects_id_unique" UNIQUE("id"),
	CONSTRAINT "projects_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "tokens" (
	"id" text PRIMARY KEY NOT NULL,
	"token_type" "token_type" NOT NULL,
	"user_id" text NOT NULL,
	"created_at" timestamp (3) DEFAULT now() NOT NULL,
	CONSTRAINT "tokens_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "email_idx" ON "invites" ("email");