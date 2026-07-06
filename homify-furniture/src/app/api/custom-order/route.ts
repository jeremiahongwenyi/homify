import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import cloudinary from "@/lib/cloudinary";
import { emailService } from "@/lib/emailService";
import { apiError, apiSuccess } from "@/helpers/apiResponse";
import { customOrderSchema } from "@/schemas/customOrder";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    console.log("formData", formData);

    const rawOrder = formData.get("order");
    const folder = (formData.get("folder") as string) || "custom-orders";
    const files = formData
      .getAll("files")
      .filter((item): item is File => item instanceof File);

    if (!rawOrder || typeof rawOrder !== "string") {
      return apiError({ message: "Order payload is required" }, 400);
    }

    let parsedOrder: unknown;
    try {
      parsedOrder = JSON.parse(rawOrder);
    } catch {
      return apiError({ message: "Invalid order payload" }, 400);
    }

    const validity = customOrderSchema.safeParse(parsedOrder);
    if (!validity.success) {
      const { fieldErrors } = validity.error.flatten();
      return apiError({ message: "Some fields are missing", fieldErrors }, 400);
    }

    if (files.length === 0) {
      return apiError({ message: "At least one image is required" }, 400);
    }

    const token = crypto.randomBytes(32).toString("hex");
    const tokenExpiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24);

    const { images: _images, ...orderData } = validity.data;

    const order = await prisma.customOrder.create({
      data: {
        ...orderData,        accessToken: token,
        tokenExpiresAt,
      },
      select: {
        id: true,
        customerEmail: true,
        customerName: true,
      },
    });

    console.log("response from creating order", order);

    const uploadedImages = await Promise.all(
      files.map(async (file) => {
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const base64String = `data:${file.type};base64,${buffer.toString("base64")}`;

        const result = await cloudinary.uploader.upload(base64String, {
          folder,
          transformation: [
            { width: 1200, height: 800, crop: "fill" },
            { quality: "auto:good" },
            { fetch_format: "auto" },
          ],
          resource_type: "auto",
        });

        console.log("images upload result", result);

        return {
          imageUrl: result.secure_url,
          publicId: result.public_id,
        };
      }),
    );

    console.log("uploaded images", uploadedImages);

    await prisma.customOrderImage.createMany({
      data: uploadedImages.map((image) => ({
        customOrderId: order.id,
        imageUrl: image.imageUrl,
        publicId: image.publicId,
      })),
      skipDuplicates: true,
    });

    const verificationUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/custom-order/verify?token=${token}`;

    console.log('verification url',verificationUrl);
    

    Promise.resolve().then(() =>
      emailService
        .sendCustomOrderVerification({
          email: order.customerEmail,
          name: order.customerName || "there",
          orderId: order.id,
          verificationUrl
        })
        .catch((error) => {
          console.error("Email failed:", error);
        }),
    );

    return apiSuccess(
      {
        message:
          "Your order has been received successfully. We've sent you an email with more information and next steps.",
        orderId: order.id,
      },
      201,
    );
  } catch (error) {
    console.error("Custom order creation failed:", error);
    return apiError(
      {
        message:
          "We are unable to process your custom order right now. Please try again shortly.",
      },
      500,
    );
  }
}
