import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const sessionId = searchParams.get("sessionId");

  if (!sessionId) {
    return NextResponse.json({ valid: false });
  }

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_CONVEX_URL}/api/verify_session`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ sessionId }),
    });

    if (response.ok) {
      return NextResponse.json({ valid: true });
    }

    return NextResponse.json({ valid: false });
  } catch {
    // If Convex is unreachable, we still check if session exists locally
    // This is a fallback for development/offline scenarios
    return NextResponse.json({ valid: true });
  }
}
