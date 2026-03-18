import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { email, passwordHash } = body;
    
    if (!email || !passwordHash) {
      return NextResponse.json(
        { error: "Preencha email e senha para continuar." },
        { status: 400 }
      );
    }

    const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
    if (!convexUrl) {
      return NextResponse.json(
        { error: "Erro de configuração. Entre em contato com o administrador." },
        { status: 500 }
      );
    }

    const { ConvexHttpClient } = await import("convex/browser");
    const convex = new ConvexHttpClient(convexUrl);
    
    const { api } = await import("../../../../../convex/_generated/api");
    
    const result = await convex.mutation(api.auth.login, { 
      email, 
      passwordHash 
    });

    return NextResponse.json({
      user: result.user,
      sessionId: result.sessionId,
    });
  } catch (error: any) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Email ou senha incorretos. Tente novamente." },
      { status: 401 }
    );
  }
}