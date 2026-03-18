// ─── Brevo Email Service ───────────────────────────────────────────────────────

interface BrevoEmailParams {
  to: { email: string; name?: string }[];
  subject: string;
  htmlContent: string;
  textContent?: string;
  replyTo?: { email: string; name?: string };
  tags?: string[];
}

const BREVO_API_URL = "https://api.brevo.com/v3";

export async function sendEmail(params: BrevoEmailParams): Promise<{ success: boolean; messageId?: string; error?: string }> {
  const BREVO_API_KEY = process.env.BREVO_API_KEY;
  const SENDER_EMAIL = process.env.BREVO_SENDER_EMAIL || "noreply@jarlinevieira.com.br";
  const SENDER_NAME = process.env.BREVO_SENDER_NAME || "Jarline Vieira";

  if (!BREVO_API_KEY) {
    console.warn("BREVO_API_KEY não configurado. Email não enviado:", params.subject);
    return { success: false, error: "Brevo API key não configurada" };
  }

  try {
    const response = await fetch(`${BREVO_API_URL}/smtp/email`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": BREVO_API_KEY,
      },
      body: JSON.stringify({
        sender: {
          name: SENDER_NAME,
          email: SENDER_EMAIL,
        },
        to: params.to.map(t => ({
          email: t.email,
          ...(t.name && { name: t.name }),
        })),
        subject: params.subject,
        htmlContent: params.htmlContent,
        textContent: params.textContent || params.htmlContent.replace(/<[^>]*>/g, ""),
        ...(params.replyTo && {
          replyTo: {
            email: params.replyTo.email,
            ...(params.replyTo.name && { name: params.replyTo.name }),
          },
        }),
        ...(params.tags && params.tags.length > 0 && {
          tags: params.tags,
        }),
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Erro ao enviar email via Brevo:", errorData);
      return { success: false, error: errorData.message || "Erro desconhecido" };
    }

    const data = await response.json();
    console.log("Email enviado com sucesso via Brevo:", data.messageId);
    return { success: true, messageId: data.messageId };
  } catch (error) {
    console.error("Exceção ao enviar email:", error);
    return { success: false, error: error instanceof Error ? error.message : "Erro desconhecido" };
  }
}

// ─── Email Helpers ─────────────────────────────────────────────────────────────

export async function sendFormSubmissionNotificationToAdmins(
  formTitle: string,
  formData: Record<string, unknown>,
  adminEmails: { email: string; name?: string }[]
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  if (adminEmails.length === 0) {
    console.warn("Nenhum admin encontrado para envio de email");
    return { success: false, error: "Nenhum admin encontrado" };
  }

  const { formatFormDataForEmail } = await import("../emails/form-notification");
  const htmlContent = await formatFormDataForEmail(formTitle, formData);

  return sendEmail({
    to: adminEmails,
    subject: `Nova submissão: ${formTitle}`,
    htmlContent,
    tags: ["form-submission", "notification", "admin"],
  });
}

export async function sendFormConfirmationToUser(
  userEmail: string,
  formTitle: string
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  const { formatConfirmationForEmail } = await import("../emails/form-confirmation");
  const htmlContent = await formatConfirmationForEmail(formTitle);

  return sendEmail({
    to: [{ email: userEmail }],
    subject: `Mensagem enviada - ${formTitle}`,
    htmlContent,
    tags: ["form-submission", "confirmation", "user"],
  });
}

export async function sendAILeadNotificationToAdmins(
  contactData: Record<string, unknown>,
  adminEmails: { email: string; name?: string }[]
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  if (adminEmails.length === 0) {
    console.warn("Nenhum admin encontrado para envio de email");
    return { success: false, error: "Nenhum admin encontrado" };
  }

  const { formatAILeadNotification } = await import("../emails/ai-lead-notification");
  const htmlContent = await formatAILeadNotification(contactData);

  return sendEmail({
    to: adminEmails,
    subject: "Novo Lead via Assistente IA",
    htmlContent,
    tags: ["ai-lead", "notification", "admin"],
  });
}

// ─── Validate Email ─────────────────────────────────────────────────────────────

export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// ─── Brand Colors ─────────────────────────────────────────────────────────────

export const EMAIL_BRAND = {
  primary: "#585947",
  cream: "#e2e0d4",
  creamLight: "#f6f5ed",
  white: "#ffffff",
  textBody: "#626262",
  textMuted: "#8a8a80",
};
