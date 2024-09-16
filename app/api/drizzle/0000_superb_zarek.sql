DO $$ BEGIN
 CREATE TYPE "public"."permission_enum" AS ENUM('CREATE_CARD', 'READ_CARD', 'UPDATE_CARD', 'DELETE_CARD');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."platform_enum" AS ENUM('ADMIN', 'VENDOR');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."contract_type_enum" AS ENUM('PRE_PAID', 'POST_PAID');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."payment_date_type_enum" AS ENUM('SAME_DAY_EACH_MONTH', 'LAST_WEEKDAY', 'LAST_DAY_OF_THE_MONTH', 'DAYS_AFTER');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."payment_type_enum" AS ENUM('MONTHLY', 'DAYS_AFTER', 'CUSTOM');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "address" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"bag_khoroo_id" text NOT NULL,
	"details" text NOT NULL,
	"email" text NOT NULL,
	"phone_number" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "password_reset_token" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"token_hash" text NOT NULL,
	"expires_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "role" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"platform" "platform_enum" NOT NULL,
	"permissions" permission_enum[] NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "session" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" uuid NOT NULL,
	"expires_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"password" text,
	"vendor_id" uuid,
	"role_id" uuid NOT NULL,
	"firstTimePassword" text,
	"refreshToken" text DEFAULT 'hi' NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "contract" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"vendor_id" uuid NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"contract_type" "contract_type_enum" NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "payment_date_each_month" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"payment_plan_id" uuid NOT NULL,
	"period" timestamp NOT NULL,
	"months_after" integer DEFAULT 1 NOT NULL,
	"payment_date_type" "payment_date_type_enum" NOT NULL,
	"same_day_each_month" integer,
	"last_weekday" integer,
	"days_after" integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "payment_plan" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"contract_id" uuid NOT NULL,
	"payment_type" "payment_type_enum" NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "vendor" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"register" text NOT NULL,
	"phone_number" text NOT NULL,
	"email" text NOT NULL,
	"address_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "wallet" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"vendor_id" uuid NOT NULL,
	"balance" integer NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "password_reset_token" ADD CONSTRAINT "password_reset_token_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "session" ADD CONSTRAINT "session_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
