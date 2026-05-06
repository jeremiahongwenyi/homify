import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { emailService } from "@/lib/emailService";

type RedirectParams = {
  token?: string;
  trackingToken?: string;
};

const buildRedirectUrl = (status: string, params?: RedirectParams) => {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const url = new URL(`/custom-order/verification?status=${status}`, appUrl);
  if (params?.token) {
    url.searchParams.set("token", params.token);
  }
  if (params?.trackingToken) {
    url.searchParams.set("trackingToken", params.trackingToken);
  }
  return url;
};

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token");
  console.log('token retrieved', token);
  

  if (!token) {
    return NextResponse.redirect(buildRedirectUrl("missing-token"));
  }

  try {
    const now = new Date();

    const order = await prisma.customOrder.findFirst({
      where: {
        accessToken: token,
      },
      select: {
        id: true,
        customerName: true,
        customerEmail: true,
        customerPhone: true,
        category: true,
        emailVerified: true,
        tokenExpiresAt: true,
        trackingToken: true,
        trackingExpiresAt: true,
      },
    });

    console.log('order verification details', order);

    if (!order) {
      return NextResponse.redirect(buildRedirectUrl("invalid-token"));
    }
   
    

    if (order.emailVerified) {
      const hasValidTrackingToken =
        !!order.trackingToken &&
        (!order.trackingExpiresAt || order.trackingExpiresAt > now);

      if (hasValidTrackingToken) {
        return NextResponse.redirect(
          buildRedirectUrl("already-verified", {
            trackingToken: order.trackingToken || undefined,
          }),
        );
      }

      return NextResponse.redirect(buildRedirectUrl("already-verified"));
    }

    if (!order.tokenExpiresAt || order.tokenExpiresAt < now) {
      return NextResponse.redirect(
        buildRedirectUrl("expired-token", { token }),
      );
    }

    const trackingToken = crypto.randomBytes(32).toString("hex");
    const trackingExpiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 90);

    const updatedOrder = await prisma.customOrder.update({
      where: {
        id: order.id,
      },
      data: {
        emailVerified: true,
        status: "PENDING",
        accessToken: null,
        tokenExpiresAt: null,
        trackingToken,
        trackingExpiresAt,
      },
      select: {
        id: true,
        customerName: true,
        customerEmail: true,
        customerPhone: true,
        category: true,
        trackingToken: true,
      },
    });

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const trackingUrl = `${appUrl}/track-order?token=${updatedOrder.trackingToken}`;

    // Promise.resolve().then(async () => {
    //   try {
    //     await Promise.all([
    //       emailService.sendCustomOrderUnderReview({
    //         email: updatedOrder.customerEmail,
    //         name: updatedOrder.customerName || "there",
    //         orderId: updatedOrder.id,
    //         trackingUrl,
    //       }),
    //       emailService.notifyBusinessOwnerOfVerifiedOrder({
    //         orderId: updatedOrder.id,
    //         customerName: updatedOrder.customerName || "Not provided",
    //         customerEmail: updatedOrder.customerEmail,
    //         customerPhone: updatedOrder.customerPhone,
    //         category: updatedOrder.category,
    //       }),
    //     ]);
    //   } catch (error) {
    //     console.error("Post-verification email failed:", error);
    //   }
    // });

    return NextResponse.redirect(
      buildRedirectUrl("success", {
        trackingToken: updatedOrder.trackingToken || undefined,
      }),
    );
  } catch (error) {
    console.error("Custom order verification failed:", error);
    return NextResponse.redirect(buildRedirectUrl("server-error"));
  }
}
