ALTER TABLE "vendor" ADD COLUMN "wallet_id" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "wallet" DROP COLUMN IF EXISTS "vendor_id";