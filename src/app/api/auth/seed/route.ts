import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { email, passwordHash, name, role } = body;
    
    if (!email || !passwordHash || !name) {
      return NextResponse.json(
        { error: "Preencha todos os campos." },
        { status: 400 }
      );
    }

    const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
    if (!convexUrl) {
      return NextResponse.json(
        { error: "Erro de configuração." },
        { status: 500 }
      );
    }

    const { ConvexHttpClient } = await import("convex/browser");
    const convex = new ConvexHttpClient(convexUrl);
    
    const { api } = await import("../../../../../convex/_generated/api");
    
    const result = await convex.mutation(api.auth.registerUser, {
      email,
      passwordHash,
      name,
      role: role || "admin",
    });
    
    return NextResponse.json({ message: "Usuário criado com sucesso", userId: result });
  } catch (error: any) {
    console.error("Seed error:", error);
    if (error.message?.includes("já existe")) {
      return NextResponse.json({ message: "Usuário já existe" });
    }
    return NextResponse.json(
      { error: "Erro ao criar usuário. Tente novamente." },
      { status: 500 }
    );
  }
}