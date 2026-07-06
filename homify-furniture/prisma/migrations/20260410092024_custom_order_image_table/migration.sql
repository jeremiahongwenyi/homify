-- CreateTable
CREATE TABLE "CustomOrderImage" (
    "id" TEXT NOT NULL,
    "customOrderId" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "publicId" TEXT NOT NULL,

    CONSTRAINT "CustomOrderImage_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "CustomOrderImage" ADD CONSTRAINT "CustomOrderImage_customOrderId_fkey" FOREIGN KEY ("customOrderId") REFERENCES "CustomOrder"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
