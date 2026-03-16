import { NextResponse, NextRequest } from "next/server";
import { sql } from "@/lib/neon-db";

export async function GET() {
  try {
    const response = await sql`SELECT version()`

    return NextResponse.json({
     success: true,
      version: response[0].version,
      isSuccess:true
    })

  } catch (error) {
   
    console.log('error', error);
    
    return NextResponse.json({
       success: false, error: 'Database error',  status: 500
    })
  }
}
