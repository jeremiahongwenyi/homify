-- AlterTable
ALTER TABLE "CustomOrder" ADD COLUMN     "accessToken" TEXT,
ADD COLUMN     "tokenExpiresAt" TIMESTAMP(3);
