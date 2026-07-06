/*
  Warnings:

  - You are about to drop the `test_orders` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "test_orders";

-- CreateTable
CREATE TABLE "CustomOrder" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "customerName" TEXT,
    "customerEmail" TEXT NOT NULL,
    "customerPhone" TEXT,
    "description" TEXT,
    "category" TEXT,
    "budgetMax" DOUBLE PRECISION,
    "budgetMin" DOUBLE PRECISION,
    "dimensions" TEXT,
    "materialPreference" TEXT,
    "colorPreference" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CustomOrder_pkey" PRIMARY KEY ("id")
);
