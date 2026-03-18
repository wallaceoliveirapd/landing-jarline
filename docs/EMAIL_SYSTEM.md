# Sistema de Email - Brevo Integration

## Estrutura de Arquivos

```
src/
├── lib/
│   └── email.ts                    # Cliente Brevo e funções auxiliares
├── emails/
│   ├── base-email.tsx             # Template base (header, footer, logo)
│   ├── form-notification.ts       # Notificação para admin (formulário)
│   ├── form-confirmation.ts       # Confirmação para usuário
│   └── ai-lead-notification.ts    # Notificação de lead IA
└── app/
    └── api/
        └── email/
            └── route.ts           # API route para envio
```

---

## Templates de Email

### 1. Notificação de Formulário (Admin)
**Arquivo:** `src/emails/form-notification.ts`  
**Função:** `formatFormDataForEmail(formTitle, formData)`  
**Destinatário:** Todos os admins  
**Conteúdo:**
- Nome do formulário
- Data/hora do envio
- Todos os campos com labels e valores

---

### 2. Confirmação de Envio (Usuário)
**Arquivo:** `src/emails/form-confirmation.ts`  
**Função:** `formatConfirmationForEmail(formTitle)`  
**Destinatário:** Email do usuário (campo email do formulário)  
**Conteúdo:**
- Mensagem de sucesso
- Nome do formulário
- Mensagem de contato

---

### 3. Lead IA (Admin)
**Arquivo:** `src/emails/ai-lead-notification.ts`  
**Função:** `formatAILeadNotification(contactData)`  
**Destinatário:** Todos os admins  
**Conteúdo:**
- Data/hora
- Todos os dados do lead

---

## Template Base

**Arquivo:** `src/emails/base-email.tsx`

Estrutura visual:
```
┌─────────────────────────────────────┐
│  [LOGO JARLINE VIEIRA]             │  ← Header (#585947)
├─────────────────────────────────────┤
│  ████████████████████████████       │  ← Linha decorativa (#e2e0d4)
├─────────────────────────────────────┤
│                                     │
│     Conteúdo do Email              │  ← Corpo (você edita aqui)
│                                     │
│                                     │
├─────────────────────────────────────┤
│  Jarline Vieira Arquitetura        │  ← Footer (#f6f5ed)
│  © 2026 Todos os direitos         │
└─────────────────────────────────────┘
```

### Como personalizar o template base

Para alterar cores, fontes ou estrutura, edite `base-email.tsx`:

```tsx
// Cores disponíveis
const BRAND = {
  primary: "#585947",      // Header, botões
  cream: "#e2e0d4",       // Linhas decorativas
  creamLight: "#f6f5ed", // Footer, backgrounds
  white: "#ffffff",
  textBody: "#626262",
  textMuted: "#8a8a80",
};
```

---

## Funções de Envio

### `sendFormSubmissionNotificationToAdmins`
Envia notificação para todos os admins quando um formulário é preenchido.

```typescript
import { sendFormSubmissionNotificationToAdmins } from "@/lib/email";

await sendFormSubmissionNotificationToAdmins(
  "Formulário de Contato",     // Título do form
  { nome: "João", email: "..." }, // Dados preenchidos
  [{ email: "admin@email.com", name: "Admin" }]
);
```

### `sendFormConfirmationToUser`
Envia confirmação para o usuário que preencheu o formulário.

```typescript
import { sendFormConfirmationToUser } from "@/lib/email";

await sendFormConfirmationToUser(
  "usuario@email.com",
  "Formulário de Contato"
);
```

### `sendAILeadNotificationToAdmins`
Envia notificação de novo lead IA para todos os admins.

```typescript
import { sendAILeadNotificationToAdmins } from "@/lib/email";

await sendAILeadNotificationToAdmins(
  { nome: "Maria", interesse: "Reforma" },
  [{ email: "admin@email.com" }]
);
```

---

## Configuração

### Variáveis de Ambiente (.env.local)

```env
BREVO_API_KEY=sua_chave_api_brevo
BREVO_SENDER_EMAIL=noreply@seudominio.com.br
BREVO_SENDER_NAME=Jarline Vieira
```

### Como obter API Key
1. Acesse [Brevo](https://app.brevo.com)
2. Configurações > SMTP e API
3. Copie a chave API v3

---

## Fluxo de Envio de Emails

### Formulários
```
Usuário preenche formulário
        ↓
Frontend: createSubmission()
        ↓
Backend: Salva no banco
        ↓
Frontend: Encontra campo email
        ↓
1. Envia notificação para todos os admins
2. Envia confirmação para o usuário (se tiver email)
```

### Leads IA
```
Usuário interage com assistente
        ↓
Frontend: Chama API de chat
        ↓
1. Envia notificação para todos os admins
2. Redireciona para WhatsApp
```

---

## Personalizando Templates

### Para editar o email de notificação de formulário:

1. Abra `src/emails/form-notification.ts`
2. Edite a função `formatFormDataForEmail`
3. O conteúdo é HTML string com estilos inline

```tsx
const content = `
  <h1 style="font-size: 28px; color: #585947;">
    Seu título aqui
  </h1>
  
  <div style="background: #f6f5ed; padding: 24px;">
    Seu conteúdo aqui
  </div>
`;
```

### Boas práticas para emails HTML

- Use estilos inline (não use classes CSS)
- Use tabelas para layout
- Largura máxima: 600px
- Teste em diferentes clientes de email

---

## Troubleshooting

### Email não enviado
1. Verificar `BREVO_API_KEY` no .env
2. Verificar se há admins cadastrados
3. Checar console do navegador
4. Verificar Network tab para erros

### Email na spam
1. Configurar DKIM no Brevo
2. Configurar SPF no DNS
3. Usar domínio verificado

### Limite de envios
- Plano gratuito: 300 emails/dia
- Planos pagos: Verificar limites do plano

---

## Cores do Design System

| Token | Hex | Uso |
|-------|-----|-----|
| primary | #585947 | Headers, botões |
| cream | #e2e0d4 | Linhas decorativas |
| creamLight | #f6f5ed | Footer, backgrounds |
| white | #ffffff | Fundo principal |
| textBody | #626262 | Texto corpo |
| textMuted | #8a8a80 | Labels, hints |

---

*Última atualização: Março 2026*
