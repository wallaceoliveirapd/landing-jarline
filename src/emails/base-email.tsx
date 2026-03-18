// ─── Email Base Template ────────────────────────────────────────────────────────

export interface EmailTemplateProps {
  children: React.ReactNode;
  title: string;
  previewText?: string;
}

export function EmailBaseTemplate({ children, title, previewText }: EmailTemplateProps) {
  return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>${title}</title>
  <!--[if mso]>
  <style type="text/css">
    table { border-collapse: collapse; }
    .button { padding: 12px 24px !important; }
  </style>
  <![endif]-->
</head>
<body style="margin: 0; padding: 0; background-color: #f6f5ed; font-family: 'Space Grotesk', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
  
  <!-- Preview Text (hidden) -->
  <div style="display: none; max-height: 0; overflow: hidden;">
    ${previewText || title}
  </div>
  
  <!-- Email Wrapper -->
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f6f5ed;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        
        <!-- Main Card -->
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 600px; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 40px rgba(88, 89, 71, 0.1);">
          
          <!-- Header with Logo -->
          <tr>
            <td style="background-color: #585947; padding: 32px 40px; text-align: center;">
              <a href="#" style="display: inline-block;">
                <img src="/assets/images/logo/logo-branca.svg" alt="Jarline Vieira" width="140" height="22" style="display: block;" />
              </a>
            </td>
          </tr>
          
          <!-- Decorative Line -->
          <tr>
            <td style="background-color: #e2e0d4; height: 4px;"></td>
          </tr>
          
          <!-- Email Content -->
          <tr>
            <td style="padding: 40px;">
              ${children}
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #f6f5ed; padding: 32px 40px; text-align: center; border-top: 1px solid rgba(88, 89, 71, 0.1);">
              <p style="margin: 0 0 8px; font-size: 12px; color: #8a8a80; letter-spacing: 0.5px; text-transform: uppercase;">
                Jarline Vieira Arquitetura & Interiores
              </p>
              <p style="margin: 0; font-size: 11px; color: #a8a8a0;">
                © ${new Date().getFullYear()} Todos os direitos reservados
              </p>
            </td>
          </tr>
          
        </table>
        <!-- End Main Card -->
        
      </td>
    </tr>
  </table>
  
</body>
</html>
  `.trim();
}

// ─── Email Typography Styles ───────────────────────────────────────────────────

export const emailStyles = {
  h1: `font-size: 32px; font-weight: 300; color: #585947; margin: 0 0 16px; letter-spacing: -1px; line-height: 1.2;`,
  h2: `font-size: 24px; font-weight: 500; color: #585947; margin: 0 0 16px; letter-spacing: -0.5px; line-height: 1.3;`,
  h3: `font-size: 18px; font-weight: 500; color: #585947; margin: 0 0 12px; line-height: 1.4;`,
  body: `font-size: 15px; color: #626262; line-height: 1.7; margin: 0 0 16px; letter-spacing: -0.3px;`,
  small: `font-size: 13px; color: #8a8a80; line-height: 1.5; margin: 0 0 12px;`,
  label: `font-size: 11px; color: #8a8a80; text-transform: uppercase; letter-spacing: 1px; margin: 0 0 4px;`,
  value: `font-size: 15px; color: #585947; margin: 0;`,
  divider: `border: none; border-top: 1px solid rgba(88, 89, 71, 0.15); margin: 24px 0;`,
  button: `
    display: inline-block;
    background-color: #585947;
    color: #ffffff !important;
    text-decoration: none;
    padding: 14px 32px;
    border-radius: 8px;
    font-size: 13px;
    font-weight: 500;
    letter-spacing: 1px;
    text-transform: uppercase;
  `,
  card: `background-color: #f6f5ed; border-radius: 12px; padding: 24px; margin: 20px 0;`,
  successIcon: `width: 48px; height: 48px; background-color: rgba(88, 89, 71, 0.1); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px;`,
};
