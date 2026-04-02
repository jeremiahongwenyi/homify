import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    const user = await prisma.user.findUnique({
      where: { email: email },
      select: { id: true },
    });
    console.log("user", user);

    const exists = !!user;

    return NextResponse.json({
      data: { exists },
      success: true,
    });
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      {
        error: {
          message: "We could not process your request. Please try again",
        },
        success: false,
      },
      { status: 500 },
    );
  }
}

// export async function POST(req: NextRequest) {
//   try {
//     const { email } = await req.json();
//     const user = await sql`SELECT id FROM "user" WHERE email  = ${email} `;
//     console.log("user", user);
//     const exists = user.length > 0;

//     return NextResponse.json({
//       data: { exists, email },
//       success: true,
//     });
//   } catch (error) {
//     console.log("error", error);
//     return NextResponse.json({
//       error: { error },
//       statusMessage: 'We could not process your request. Please try again',
//       success: false,
//     },  {status: 500});
//   }
// }
