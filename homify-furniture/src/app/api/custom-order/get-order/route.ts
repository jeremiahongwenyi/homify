import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiError, apiSuccess } from "@/helpers/apiResponse";

export async function GET(req: NextRequest) {
  try {
    const token = req.nextUrl.searchParams.get("token");
    console.log("token retrieved", token);

    if (!token) {
      return apiError({ message: "Tracking token is required." }, 400);
    }

    const now = new Date();

    const order = await prisma.customOrder.findFirst({
      where: {
        trackingToken: token,
      },
      select: {
        id: true,
        status: true,
        emailVerified: true,
        customerName: true,
        category: true,
        budgetMax: true,
        materialPreference: true,
        colorPreference: true,
        createdAt: true,
        updatedAt: true,
        trackingExpiresAt: true,

        images: {
          select: {
            id: true,
            imageUrl: true,
          },
        },
      },
    });

    if (!order) {
      return apiError(
        {
          message:
            " This link is invalid. Please check your email for the correct link.",
        },
        404,
      );
    }

    if (order.trackingExpiresAt && order.trackingExpiresAt < now) {
      return apiError(
        {
          message: "This tracking link has expired.",
        },
        410,
      );
    }

    return apiSuccess({ message: "Order retrieved successfully", order }, 200);
  } catch (error) {
    console.error("Track order failed:", error);
    return apiError(
      {
        message:
          "We could not retrieve this order right now. Please try again.",
      },
      500,
    );
  }
}
