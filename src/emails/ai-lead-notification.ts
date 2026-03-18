import { EmailBaseTemplate } from "./base-email";

export async function formatAILeadNotification(contactData: Record<string, any>): Promise<string> {
  const date = new Date();
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
    return String(value);
  };

  const formatLabel = (key: string): string => {
    return key
      .replace(/([A-Z])/g, " $1")
      .replace(/_/g, " ")
      .replace(/^\w/, (c) => c.toUpperCase())
      .trim();
  };

  const fieldsHtml = Object.entries(contactData)
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
    <div style="text-align: center; margin-bottom: 24px;">
      <div style="width: 64px; height: 64px; background-color: rgba(88, 89, 71, 0.1); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px;">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M21 11.5C21 16.1944 16.9706 20 12 20C10.4 20 8.9 19.6 7.6 18.9L3 20L4.4 16.2C3.6 15.1 3 13.8 3 12.5C3 7.80556 7.02944 4 12 4C16.9706 4 21 7.80556 21 12.5V11.5Z" stroke="#585947" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>
      <h1 style="font-size: 28px; font-weight: 300; color: #585947; margin: 0 0 8px; letter-spacing: -1px;">
        Novo Lead via Assistente IA
      </h1>
      <p style="font-size: 14px; color: #8a8a80; margin: 0;">
        Alguém demonstrou interesse através do assistente virtual.
      </p>
    </div>
    
    <div style="background-color: #f6f5ed; border-radius: 12px; padding: 24px; margin-bottom: 24px;">
      <p style="font-size: 11px; color: #8a8a80; text-transform: uppercase; letter-spacing: 1px; margin: 0 0 4px;">Data</p>
      <p style="font-size: 15px; color: #585947; margin: 0;">${formattedDate}</p>
    </div>
    
    <h2 style="font-size: 16px; font-weight: 500; color: #585947; margin: 0 0 16px; text-transform: uppercase; letter-spacing: 1px;">
      Dados do contato
    </h2>
    
    <table width="100%" cellspacing="0" cellpadding="0">
      ${fieldsHtml || '<tr><td style="padding: 24px; text-align: center; color: #8a8a80;">Nenhum dado disponível</td></tr>'}
    </table>
    
    <div style="margin-top: 32px; padding: 20px; background-color: #f6f5ed; border-radius: 12px;">
      <p style="font-size: 13px; color: #626262; margin: 0; line-height: 1.6;">
        Considere entrar em contato via WhatsApp para um atendimento personalizado.
      </p>
    </div>
  `;

  return EmailBaseTemplate({
    children: content,
    title: "Novo Lead via Assistente IA",
    previewText: "Alguém demonstrou interesse através do assistente virtual!",
  });
}
