import { EmailBaseTemplate } from "./base-email";

export async function formatConfirmationForEmail(formTitle: string): Promise<string> {
  const content = `
    <div style="text-align: center; margin-bottom: 32px;">
      <div style="width: 64px; height: 64px; background-color: rgba(88, 89, 71, 0.1); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 24px;">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M20 6L9 17L4 12" stroke="#585947" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>
      <h1 style="font-size: 32px; font-weight: 300; color: #585947; margin: 0 0 12px; letter-spacing: -1px;">
        Enviado com sucesso!
      </h1>
      <p style="font-size: 16px; color: #626262; margin: 0; line-height: 1.6;">
        Sua mensagem foi recebida.<br/>
        Entraremos em contato em breve.
      </p>
    </div>
    
    <div style="background-color: #f6f5ed; border-radius: 12px; padding: 24px; margin: 24px 0;">
      <p style="font-size: 11px; color: #8a8a80; text-transform: uppercase; letter-spacing: 1px; margin: 0 0 4px;">Formulário</p>
      <p style="font-size: 16px; color: #585947; margin: 0; font-weight: 500;">${formTitle}</p>
    </div>
    
    <p style="font-size: 14px; color: #8a8a80; margin: 24px 0 0; line-height: 1.6;">
      Caso tenha alguma dúvida, entre em contato através dos nossos canais de comunicação.
    </p>
  `;

  return EmailBaseTemplate({
    children: content,
    title: `Mensagem enviada - ${formTitle}`,
    previewText: "Sua mensagem foi enviada com sucesso!",
  });
}
