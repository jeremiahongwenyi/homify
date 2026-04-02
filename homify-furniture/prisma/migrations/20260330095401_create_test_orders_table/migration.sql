-- CreateTable
CREATE TABLE "test_orders" (
    "id" TEXT NOT NULL,
    "orderNumber" TEXT NOT NULL,
    "orderDate" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "test_orders_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "test_orders_orderNumber_idx" ON "test_orders"("orderNumber");
