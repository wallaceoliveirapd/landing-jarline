import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { sessionId } = body;

    if (!sessionId) {
      return NextResponse.json({ success: true });
    }

    const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
    if (!convexUrl) {
      return NextResponse.json({ success: true });
    }

    const { ConvexHttpClient } = await import("convex/browser");
    const convex = new ConvexHttpClient(convexUrl);
    
    const { api } = await import("../../../../../convex/_generated/api");
    
    await convex.mutation(api.auth.logout, { sessionId });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Logout error:", error);
    return NextResponse.json({ success: true });
  }
}