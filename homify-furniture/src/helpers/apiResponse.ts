import { NextResponse } from "next/server";

export const apiSuccess = <T>(data: T, status: number) => {
    // console.log('data received', data);
    
  return NextResponse.json(
    {
      success: true,
      error: null,
      data,
    },
    { status },
  );
};

export const apiError = <T>(error: T, status: number) => {
  return NextResponse.json({
    success: false,
    error,
    data: null,
  },
{status});
};
