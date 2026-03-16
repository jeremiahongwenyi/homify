import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/neon-db";
import { STATUS_CODES } from "http";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    const user = await sql`SELECT id FROM "use" WHERE email  = ${email} `;
    console.log("user", user);
    const exists = user.length > 0;

    return NextResponse.json({
      data: { exists, email },
      success: true,
    });
  } catch (error) {
    console.log("error", error);
    return NextResponse.json({
      error: { error },
      statusMessage: 'We could not process your request/ please try again',
      success: false,
    },  {status: 500});
  }
}
