import { NextRequest, NextResponse } from "next/server";

const BREVO_API_URL = "https://api.brevo.com/v3";
const BREVO_API_KEY = process.env.BREVO_API_KEY;
const DEFAULT_SENDER_EMAIL = process.env.BREVO_SENDER_EMAIL || "noreply@jarlinevieira.com.br";
const DEFAULT_SENDER_NAME = process.env.BREVO_SENDER_NAME || "Jarline Vieira";

interface EmailRequest {
  to: { email: string; name?: string }[];
  subject: string;
  htmlContent: string;
  textContent?: string;
  replyTo?: { email: string; name?: string };
  tags?: string[];
}

export async function POST(request: NextRequest) {
  try {
    if (!BREVO_API_KEY) {
      return NextResponse.json(
        { success: false, error: "Brevo API key não configurada" },
        { status: 500 }
      );
    }

    const body: EmailRequest = await request.json();

    if (!body.to || body.to.length === 0) {
      return NextResponse.json(
        { success: false, error: "Destinatário não informado" },
        { status: 400 }
      );
    }

    if (!body.subject || !body.htmlContent) {
      return NextResponse.json(
        { success: false, error: "Assunto e conteúdo são obrigatórios" },
        { status: 400 }
      );
    }

    const response = await fetch(`${BREVO_API_URL}/smtp/email`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": BREVO_API_KEY,
      },
      body: JSON.stringify({
        sender: {
          name: DEFAULT_SENDER_NAME,
          email: DEFAULT_SENDER_EMAIL,
        },
        to: body.to.map((t) => ({
          email: t.email,
          ...(t.name && { name: t.name }),
        })),
        subject: body.subject,
        htmlContent: body.htmlContent,
        textContent: body.textContent || body.htmlContent.replace(/<[^>]*>/g, ""),
        ...(body.replyTo && {
          replyTo: {
            email: body.replyTo.email,
            ...(body.replyTo.name && { name: body.replyTo.name }),
          },
        }),
        ...(body.tags && body.tags.length > 0 && {
          tags: body.tags,
        }),
      }),
    });

    console.log("Brevo API Response Status:", response.status);
    console.log("Brevo API Response Headers:", Object.fromEntries(response.headers.entries()));
    
    const responseText = await response.text();
    console.log("Brevo API Response Body:", responseText);

    if (!response.ok) {
      return NextResponse.json(
        { success: false, error: responseText, status: response.status },
        { status: response.status }
      );
    }

    const data = JSON.parse(responseText);
    return NextResponse.json({ success: true, messageId: data.messageId });
  } catch (error) {
    console.error("Exceção ao enviar email:", error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Erro desconhecido" },
      { status: 500 }
    );
  }
}
