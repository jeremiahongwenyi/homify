/*
  Warnings:

  - A unique constraint covering the columns `[accessToken]` on the table `CustomOrder` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[trackingToken]` on the table `CustomOrder` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterEnum
ALTER TYPE "CustomOrderStatus" ADD VALUE 'AWAITING_EMAIL_VERIFICATION';

-- AlterTable
ALTER TABLE "CustomOrder" ADD COLUMN     "trackingExpiresAt" TIMESTAMP(3),
ADD COLUMN     "trackingToken" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "CustomOrder_accessToken_key" ON "CustomOrder"("accessToken");

-- CreateIndex
CREATE UNIQUE INDEX "CustomOrder_trackingToken_key" ON "CustomOrder"("trackingToken");
