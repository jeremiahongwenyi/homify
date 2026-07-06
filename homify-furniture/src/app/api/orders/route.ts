import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiSuccess, apiError } from "@/helpers/apiResponse";
import { customOrderSchema } from "@/schemas/customOrder";
import { Result } from "pg";

// GET: Fetch all orders
export async function GET(request: NextRequest) {
  // try {
  //   const ordersRef = ref(database, 'orders');
  //   const limit = request.nextUrl.searchParams.get('limit');
  //   let ordersQuery = query(ordersRef, orderByChild('createdAt'));
  //   if (limit) {
  //     ordersQuery = query(ordersQuery, limitToLast(parseInt(limit)));
  //   }
  //   const snapshot = await get(ordersQuery);
  //   if (!snapshot.exists()) {
  //     return NextResponse.json({ orders: [] });
  //   }
  //   const orders: any[] = [];
  //   snapshot.forEach((child) => {
  //     orders.push({
  //       id: child.key,
  //       ...child.val(),
  //     });
  //   });
  //   // Reverse for newest first
  //   orders.reverse();
  //   return NextResponse.json({ orders });
  // } catch (error) {
  //   console.error('GET orders error:', error);
  //   return NextResponse.json(
  //     { error: 'Failed to fetch orders' },
  //     { status: 500 }
  //   );
  // }
}

// POST: Create new order
export async function POST(request: NextRequest) {
  console.log("finally am sending data to the db");
  try {
    const orderData = await request.json();
    console.log("Received order data:", orderData);

    const validity = customOrderSchema.safeParse(orderData);
    console.log("field validity", validity);

    if (!validity.success) {
      const { fieldErrors } = validity.error.flatten();
      return apiError({message:"Some fields are missing", fieldErrors}, 400)
    }

    const order = await prisma.customOrder.create({
      data: orderData,
      select: {
        id:true,
      }
    });

    console.log("response from creating order", order);

    return apiSuccess(
      { message: "order created successfully", ...order},
      201,
    );
  } catch (error) {
    console.error("POST order error:", error);
    return apiError(
      {
        message: "We’re unable to process your order right now. Please try again shortly.",
      },
      500,
    );
  }
}

// DELETE: Remove order
export async function DELETE(request: NextRequest) {
  try {
    const { orderId } = await request.json();

    if (!orderId) {
      return NextResponse.json(
        { error: { message: "No orderId provided" } },
        { status: 400 },
      );
    }

    // const orderRef = ref(database, `orders/${orderId}`);
    // await remove(orderRef);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE order error:", error);
    return NextResponse.json(
      { error: "Failed to delete order" },
      { status: 500 },
    );
  }
}
