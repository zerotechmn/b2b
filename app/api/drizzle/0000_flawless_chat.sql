DO $$ BEGIN
 CREATE TYPE "public"."product_enum" AS ENUM('A-80', 'АИ-92', 'Евро Аи-92', 'АИ-95', 'АИ-98', 'Дизель', 'Евро-ДТ', 'Авто хий');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."permission_enum" AS ENUM('CREATE_CARD', 'READ_CARD', 'UPDATE_CARD', 'DELETE_CARD');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."platform_enum" AS ENUM('ADMIN', 'VENDOR', 'DRIVER');
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
 CREATE TYPE "public"."e_receipt_enum" AS ENUM('BULK', 'SINGLE', 'RECEIPT_FREE');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."local_entity_enum" AS ENUM('Шунхлай ХХК', 'Шунхлай Трейдинг ХХК', 'Шунхлай Говь ХХК', 'Шунхлай Петролиум ХХК', 'Эс жи ханги гейт ХХК', 'Эс эи шивээ хүрэн депо ХХК');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."ownership_type_enum" AS ENUM('PERSONAL', 'STATE');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."payment_date_type_enum" AS ENUM('SAME_DAY_EACH_MONTH', 'LAST_WEEKDAY', 'LAST_DAY_OF_THE_MONTH');
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
DO $$ BEGIN
 CREATE TYPE "public"."sales_channel_enum" AS ENUM('RETAIL', 'BULK');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."zone_enum" AS ENUM('Баруун бүс', 'Говийн бүс', 'Дархан бүс', 'Зүүн бүс', 'Орхон бүс', 'Сайншанд бүс', 'Төв бүс-1 бүс', 'Төв бүс-2 бүс', 'Хангайн бүс');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "card" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"cardholder_name" text NOT NULL,
	"card_number" text NOT NULL,
	"balance" integer NOT NULL,
	"vendor_id" uuid NOT NULL,
	"current_limit" integer NOT NULL,
	"max_limit" integer NOT NULL,
	"limit_interval" text,
	"pin" integer NOT NULL,
	"is_active" boolean NOT NULL,
	"driver_id" uuid,
	"created_at" timestamp with time zone NOT NULL,
	"updated_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "card_requests" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"vendor_id" uuid NOT NULL,
	"requested_amount" integer NOT NULL,
	"status" text NOT NULL,
	"requested_at" text NOT NULL,
	"created_at" timestamp with time zone NOT NULL,
	"updated_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "product_balance" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"card_id" uuid NOT NULL,
	"product" "product_enum" NOT NULL,
	"balance" text NOT NULL,
	"available_stations" uuid[] DEFAULT  NOT NULL,
	"created_at" timestamp with time zone NOT NULL,
	"updated_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "statement" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"card_id" uuid NOT NULL,
	"amount" text NOT NULL,
	"from" integer NOT NULL,
	"to" integer NOT NULL,
	"details" text NOT NULL,
	"station_id" uuid NOT NULL,
	"created_at" timestamp with time zone NOT NULL,
	"updated_at" timestamp with time zone NOT NULL
);
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
	"name" text,
	"phone" text,
	"email" text,
	"password" text,
	"vendor_id" uuid,
	"role_id" uuid NOT NULL,
	"refreshToken" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "contract" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"vendor_id" uuid NOT NULL,
	"contract_type" "contract_type_enum" NOT NULL,
	"ownership" "ownership_type_enum" NOT NULL,
	"sales_channel" "sales_channel_enum" NOT NULL,
	"zone" "zone_enum" NOT NULL,
	"local_entity" "local_entity_enum" NOT NULL,
	"discount" integer DEFAULT 0 NOT NULL,
	"penalty_charge_percentage" integer DEFAULT 0 NOT NULL,
	"maximum_loan_amount" integer DEFAULT 0 NOT NULL,
	"e_receipt" "e_receipt_enum" NOT NULL,
	"start_date" timestamp with time zone NOT NULL,
	"expires_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "payment_date_each_month" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"payment_plan_id" uuid NOT NULL,
	"period" timestamp NOT NULL,
	"months_after" integer DEFAULT 1 NOT NULL,
	"payment_date_type" "payment_date_type_enum" NOT NULL,
	"same_day_each_month" integer,
	"week_of_month" integer,
	"day_of_week" integer,
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
