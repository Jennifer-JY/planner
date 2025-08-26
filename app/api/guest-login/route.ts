import { createGuestUser } from "@/lib/actions";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await createGuestUser();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
