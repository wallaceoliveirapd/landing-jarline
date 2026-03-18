import { EmailBaseTemplate } from "./base-email";

export async function formatFormDataForEmail(
  formTitle: string,
  formData: Record<string, any>,
  submissionDate?: Date
): Promise<string> {
  const date = submissionDate || new Date();
  const formattedDate = date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const formatFieldValue = (value: any): string => {
    if (value === undefined || value === null || value === "") return "—";
    if (Array.isArray(value)) return value.join(", ");
    if (typeof value === "boolean") return value ? "Sim" : "Não";
    return String(value);
  };

  const formatLabel = (key: string): string => {
    return key
      .replace(/([A-Z])/g, " $1")
      .replace(/_/g, " ")
      .replace(/^\w/, (c) => c.toUpperCase())
      .trim();
  };

  const fieldsHtml = Object.entries(formData)
    .filter(([key, value]) => key && value !== undefined && value !== null && value !== "")
    .map(([key, value]) => `
      <tr>
        <td style="padding: 12px 0; border-bottom: 1px solid rgba(88, 89, 71, 0.1);">
          <p style="font-size: 11px; color: #8a8a80; text-transform: uppercase; letter-spacing: 1px; margin: 0 0 4px;">${formatLabel(key)}</p>
          <p style="font-size: 15px; color: #585947; margin: 0; line-height: 1.5;">${formatFieldValue(value)}</p>
        </td>
      </tr>
    `)
    .join("");

  const content = `
    <h1 style="font-size: 28px; font-weight: 300; color: #585947; margin: 0 0 8px; letter-spacing: -1px; line-height: 1.2;">
      Nova submissão de formulário
    </h1>
    
    <p style="font-size: 14px; color: #8a8a80; margin: 0 0 24px;">
      Você recebeu uma nova resposta.
    </p>
    
    <div style="background-color: #f6f5ed; border-radius: 12px; padding: 24px; margin-bottom: 24px;">
      <table width="100%" cellspacing="0" cellpadding="0">
        <tr>
          <td style="padding-bottom: 16px; border-bottom: 1px solid rgba(88, 89, 71, 0.15);">
            <p style="font-size: 11px; color: #8a8a80; text-transform: uppercase; letter-spacing: 1px; margin: 0 0 4px;">Formulário</p>
            <p style="font-size: 18px; color: #585947; margin: 0; font-weight: 500;">${formTitle}</p>
          </td>
        </tr>
        <tr>
          <td style="padding-top: 16px;">
            <p style="font-size: 11px; color: #8a8a80; text-transform: uppercase; letter-spacing: 1px; margin: 0 0 4px;">Data do envio</p>
            <p style="font-size: 15px; color: #585947; margin: 0;">${formattedDate}</p>
          </td>
        </tr>
      </table>
    </div>
    
    <h2 style="font-size: 16px; font-weight: 500; color: #585947; margin: 0 0 16px; text-transform: uppercase; letter-spacing: 1px;">
      Dados enviados
    </h2>
    
    <table width="100%" cellspacing="0" cellpadding="0">
      ${fieldsHtml || '<tr><td style="padding: 24px; text-align: center; color: #8a8a80;">Nenhum dado enviado</td></tr>'}
    </table>
    
    <div style="margin-top: 32px; padding-top: 24px; border-top: 1px solid rgba(88, 89, 71, 0.15);">
      <p style="font-size: 13px; color: #8a8a80; margin: 0;">
        Acesse o painel administrativo para gerenciar esta submissão.
      </p>
    </div>
  `;

  return EmailBaseTemplate({
    children: content,
    title: `Nova submissão: ${formTitle}`,
    previewText: `Novo formulário recebido: ${formTitle}`,
  });
}
