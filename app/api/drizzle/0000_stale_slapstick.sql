DO $$ BEGIN
 CREATE TYPE "public"."card_request_status_enum" AS ENUM('PENDING', 'APPROVED', 'REJECTED');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."product_enum" AS ENUM('A-80', 'АИ-92', 'Евро Аи-92', 'АИ-95', 'АИ-98', 'Дизель', 'Евро-ДТ', 'Авто хий');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."statement_type_enum" AS ENUM('CHARGE', 'WITHDRAW', 'PURCHASE', 'BONUS');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."transfer_action_enum" AS ENUM('CARD_REQUEST_FULFILLMENT', 'CARD_TRANSFER', 'CARD_TRANSFER_RETURN', 'DRIVER_ASSIGN', 'DRIVER_UNASSIGN');
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
	"balance" integer DEFAULT 0 NOT NULL,
	"vendor_id" uuid,
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
CREATE TABLE IF NOT EXISTS "card_request" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"vendor_id" uuid NOT NULL,
	"requested_user_id" uuid NOT NULL,
	"requested_amount" integer NOT NULL,
	"status" "card_request_status_enum" NOT NULL,
	"fulfilled_card_ids" uuid[] NOT NULL,
	"created_at" timestamp with time zone NOT NULL,
	"updated_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "card_transfer_log" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"card_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"transfer_action" "transfer_action_enum" NOT NULL,
	"from_vendor_id" uuid,
	"to_vendor_id" uuid,
	"from_driver_id" uuid,
	"to_driver_id" uuid,
	"details" text DEFAULT '' NOT NULL,
	"created_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "product_balance" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"card_id" uuid NOT NULL,
	"product" "product_enum" NOT NULL,
	"balance" integer DEFAULT 0 NOT NULL,
	"available_stations" uuid[] NOT NULL,
	"created_at" timestamp with time zone NOT NULL,
	"updated_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "statement" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"card_id" uuid NOT NULL,
	"amount" numeric(10, 2) NOT NULL,
	"from" numeric(10, 2) NOT NULL,
	"to" numeric(10, 2) NOT NULL,
	"details" text DEFAULT '' NOT NULL,
	"type" "statement_type_enum" NOT NULL,
	"station_id" uuid,
	"vendor_id" uuid,
	"user_id" uuid,
	"created_at" timestamp with time zone NOT NULL,
	"updated_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "driver" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"first_name" text,
	"last_name" text,
	"phone" text NOT NULL,
	"vendor_id" uuid,
	"register_number" text,
	"car_number" text,
	"refreshToken" text
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
	"email" text NOT NULL,
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
	"balance" integer DEFAULT 0 NOT NULL,
	"address_id" uuid NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "card" ADD CONSTRAINT "card_vendor_id_vendor_id_fk" FOREIGN KEY ("vendor_id") REFERENCES "public"."vendor"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "card" ADD CONSTRAINT "card_driver_id_driver_id_fk" FOREIGN KEY ("driver_id") REFERENCES "public"."driver"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "card_request" ADD CONSTRAINT "card_request_vendor_id_vendor_id_fk" FOREIGN KEY ("vendor_id") REFERENCES "public"."vendor"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "card_request" ADD CONSTRAINT "card_request_requested_user_id_user_id_fk" FOREIGN KEY ("requested_user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "card_transfer_log" ADD CONSTRAINT "card_transfer_log_card_id_card_id_fk" FOREIGN KEY ("card_id") REFERENCES "public"."card"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "card_transfer_log" ADD CONSTRAINT "card_transfer_log_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "card_transfer_log" ADD CONSTRAINT "card_transfer_log_from_vendor_id_vendor_id_fk" FOREIGN KEY ("from_vendor_id") REFERENCES "public"."vendor"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "card_transfer_log" ADD CONSTRAINT "card_transfer_log_to_vendor_id_vendor_id_fk" FOREIGN KEY ("to_vendor_id") REFERENCES "public"."vendor"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "card_transfer_log" ADD CONSTRAINT "card_transfer_log_from_driver_id_driver_id_fk" FOREIGN KEY ("from_driver_id") REFERENCES "public"."driver"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "card_transfer_log" ADD CONSTRAINT "card_transfer_log_to_driver_id_driver_id_fk" FOREIGN KEY ("to_driver_id") REFERENCES "public"."driver"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "product_balance" ADD CONSTRAINT "product_balance_card_id_card_id_fk" FOREIGN KEY ("card_id") REFERENCES "public"."card"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "statement" ADD CONSTRAINT "statement_card_id_card_id_fk" FOREIGN KEY ("card_id") REFERENCES "public"."card"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "statement" ADD CONSTRAINT "statement_vendor_id_vendor_id_fk" FOREIGN KEY ("vendor_id") REFERENCES "public"."vendor"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "statement" ADD CONSTRAINT "statement_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "driver" ADD CONSTRAINT "driver_vendor_id_vendor_id_fk" FOREIGN KEY ("vendor_id") REFERENCES "public"."vendor"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
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
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user" ADD CONSTRAINT "user_vendor_id_vendor_id_fk" FOREIGN KEY ("vendor_id") REFERENCES "public"."vendor"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user" ADD CONSTRAINT "user_role_id_role_id_fk" FOREIGN KEY ("role_id") REFERENCES "public"."role"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "contract" ADD CONSTRAINT "contract_vendor_id_vendor_id_fk" FOREIGN KEY ("vendor_id") REFERENCES "public"."vendor"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "payment_date_each_month" ADD CONSTRAINT "payment_date_each_month_payment_plan_id_payment_plan_id_fk" FOREIGN KEY ("payment_plan_id") REFERENCES "public"."payment_plan"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "payment_plan" ADD CONSTRAINT "payment_plan_contract_id_contract_id_fk" FOREIGN KEY ("contract_id") REFERENCES "public"."contract"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
