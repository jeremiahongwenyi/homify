import crypto from "crypto";
import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiError, apiSuccess } from "@/helpers/apiResponse";
import { emailService } from "@/lib/emailService";

export async function POST(req: NextRequest) {
  try {
    const { token } = await req.json();

    if (!token || typeof token !== "string") {
      return apiError({ message: "Verification token is required." }, 400);
    }

    const order = await prisma.customOrder.findFirst({
      where: {
        accessToken: token,
      },
      select: {
        id: true,
        customerName: true,
        customerEmail: true,
        emailVerified: true,
      },
    });

    if (!order) {
      return apiError(
        {
          message: "This verification link is invalid or no longer available.",
        },
        404,
      );
    }

    if (order.emailVerified) {
      return apiError(
        { message: "This email has already been verified." },
        409,
      );
    }

    const newToken = crypto.randomBytes(32).toString("hex");
    const tokenExpiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24);

    await prisma.customOrder.update({
      where: {
        id: order.id,
      },
      data: {
        accessToken: newToken,
        tokenExpiresAt,
      },
    });

    const verificationUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/custom-order/verify?token=${newToken}`;

    Promise.resolve().then(() =>
      emailService
        .sendCustomOrderVerification({
          email: order.customerEmail,
          name: order.customerName || "there",
          orderId: order.id,
          verificationUrl,
        })
        .catch((error) => {
          console.error("Resend verification email failed:", error);
        }),
    );

    return apiSuccess(
      {
        message: "A new verification email has been sent.",
      },
      200,
    );
  } catch (error) {
    console.error("Resend verification failed:", error);
    return apiError(
      {
        message:
          "We could not resend the verification email right now. Please try again shortly.",
      },
      500,
    );
  }
}
