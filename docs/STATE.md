# Jarline Vieira - Estado do Projeto CMS

> Documentação de progresso do projeto CMS Jarline Vieira. Last updated: Mars 2026.

---

## ✅ O QUE JÁ FOI IMPLEMENTADO

### 1. Landing Page → CMS (Conectada)

A landing page agora busca dados dinamicamente do Convex em vez de valores hardcoded:

| Seção | Status | Descrição |
|-------|--------|-----------|
| **Hero** | ✅ Completo | caption, title, subtitle, ctaPrimary, ctaSecondary |
| **Stats/Big Numbers** | ✅ Completo | Lista de cards com número, prefix, suffix, label |
| **About** | ✅ Completo | title, subtitle, description |
| **Services** | ✅ Completo | Lista de serviços com title, description, num |
| **AI Section** | ✅ Completo | title, subtitle, benefits |
| **Footer** | ✅ Completo | institucionalName, contact (whatsapp, email, address), social, copyright |

**Fallback**: Quando não há dados no CMS, a landing usa valores padrão hardcoded.

**Local**: `/src/app/page.tsx`

---

### 2. Autenticação do Admin

Sistema completo de autenticação com:

#### Backend (Convex)
- **Schema**: Novas tabelas `users` e `sessions` (`convex/schema.ts`)
- **Auth Functions** (`convex/auth.ts`):
  - `registerUser` - Criar novo usuário
  - `login` - Autenticar e criar sessão (7 dias)
  - `logout` - Encerrar sessão
  - `seedDefaultUser` - Criar usuário seed
  - `getCurrentUser` - Verificar sessão ativa

#### API Routes (Next.js)
- `/api/auth/login` - POST (retorna cookie HTTP-only)
- `/api/auth/logout` - POST (limpa cookie)
- `/api/auth/seed` - POST (criar usuário seed)

#### Frontend
- **Hook** `useAuth()` (`src/hooks/use-auth.tsx`) - Context API com:
  - `user` - Dados do usuário logado
  - `isLoading` - Estado de carregamento
  - `login(email, password)` - Fazer login
  - `logout()` - Fazer logout

- **Page** `/admin/login` - Página de login com botão para criar seed
- **Guard** `AdminAuthGuard` (`src/components/admin/admin-auth-guard.tsx`) - Protege rotas do admin
- **Sidebar** - Exibe nome do usuário logado e botão de logout

#### Credenciais Seed
```
Email: wallaceoliveiraux@gmail.com
Senha: Edc201706@ (criptografada com bcrypt)
```

---

### 3. Módulos do Admin (Existentes antes)

| Módulo | Arquivo | Status |
|--------|---------|--------|
| Dashboard | `/admin/page.tsx` | ✅ Completo |
| Home Editor | `/admin/home/page.tsx` | ✅ Completo |
| Projetos (lista) | `/admin/projects/page.tsx` | ✅ Completo |
| Projetos (editor) | `/admin/projects/[id]/page.tsx` | ✅ Completo |
| Páginas (lista) | `/admin/pages/page.tsx` | ✅ Completo |
| Páginas (editor) | `/admin/pages/[id]/page.tsx` | ✅ Completo |
| Formulários (lista) | `/admin/forms/page.tsx` | ✅ Completo |
| Formulários (editor) | `/admin/forms/[id]/page.tsx` | ✅ Completo |
| Submissões | `/admin/submissions/page.tsx` | ✅ Completo |
| Mídia | `/admin/media/page.tsx` | ✅ Completo |
| Configurações | `/admin/settings/page.tsx` | ✅ Completo |
| Chat IA | `/admin/ai/page.tsx` | ✅ Completo |
| Usuários | `/admin/users/page.tsx` | ✅ Completo |

---

## ❌ O QUE FALTA FAZER

### Prioridade ALTA

#### 1. Editor Rico (Tiptap)
**Descrição**: Implementar editor visual rico para projetos e páginas, permitindo:
- Título e subtítulo
- Parágrafos, cabeçalhos, listas
- Imagens inline
- Blocos lado a lado
- Botões com link
- Drag and drop de blocos
- Preview

**Local provável**: `/admin/projects/[id]/page.tsx` e `/admin/pages/[id]/page.tsx`

**Status**: ✅ Implementado - Usando @tiptap/react com suporte funcional a rich text.

**PRD reference**: Seção 7.4

---

#### 2. Galeria de Imagens Avançada
**Descrição**: No editor de projeto, a aba de galeria deve permitir arrastar e soltar (drag and drop) para reordenar as fotos.
- Poder definir facilmente qual a "foto principal" ou manter a capa separada.
- Campos de metadados: Alt text (para SEO) e Legenda/Crédito para cada foto (opcional).

**Local provável**: `/admin/projects/[id]/page.tsx` e componente `GalleryManager`.

**Status**: ✅ Implementado - Usando `GalleryManager` com HTML5 Drag & Drop e formulários inline.

**PRD reference**: Seção 7.35

---

#### 3. Form Builder Drag & Drop
**Descrição**: Criador visual de formulários com:
- Tipos de campo: texto, email, telefone, número, data, select, radio, checkbox, etc.
- Drag and drop para reordenar campos (bug Chrome resolvido sem animations)
- Configurações por campo: label, placeholder, help text, obrigatório, validação
- Destino de envio removido (enviado exclusivamente para CMS local)

**Local**: `/admin/forms/[id]/page.tsx` e `FormBuilder` component.

**Status**: ✅ Implementado - Drag & Drop corrigido na interface principal.

**PRD reference**: Seção 9

---

### Prioridade MÉDIA

#### 4. Autocomplete de Links
**Descrição**: Em botões editáveis, ao selecionar link interno, mostrar autocomplete com sugestões de páginas e projetos do MDB.
**Local**: Componente `LinkAutocomplete` (usado na `home/page.tsx`).
**Status**: ✅ Implementado.

** PRD reference**: Seção 6.1, item 6

---

#### 5. Preview em Tempo Real
**Descrição**: Na edição da home, mostrar preview de como a seção fica antes de salvar.

**PRD reference**: Seção 6.3

---

#### 6. Visualização de Submissões
**Descrição**: Melhorar a página de submissions com:
- Busca e filtros
- Exportação CSV/Excel
- Visualização detalhada de cada submissão

**Local**: `/admin/submissions/page.tsx`

**Status**: ✅ Implementado.

**PRD reference**: Seção 9.7

---

### Prioridade BAIXA (Futuro)

#### 7. Versionamento de Conteúdo
- Histórico de alterações
- Versionamento de configurações sensíveis

#### 8. Gestão de Equipe Completa
- Edição de usuários existentes
- Permissões avançadas por role (admin, editor)
- Controle de acesso granular

---

## COMO TESTAR

### 1. Iniciar Convex
```bash
cd /Users/wallace.andrade/Evoke/landing-jarline
npx convex dev
```

### 2. Criar Usuário Seed
1. Acesse `http://localhost:3000/admin/login`
2. Clique em "Criar usuário seed"
3. O usuário será criado no banco

### 3. Fazer Login
- Email: `wallaceoliveiraux@gmail.com`
- Senha: `Edc201706@`

### 4. Editar Home
1. Vá para `/admin/home`
2. Edite as seções (Hero, Stats, About, etc)
3. Salve
4. Acesse a landing page `/` para ver as alterações

---

## ESTRUTURA DE ARQUIVOS

```
landing-jarline/
├── convex/
│   ├── schema.ts          # Tabelas do banco (settings, projects, pages, forms, submissions, users, sessions)
│   ├── settings.ts        # Queries/mutations para settings
│   ├── projects.ts        # Queries/mutations para projects
│   ├── pages.ts           # Queries/mutations para pages
│   ├── forms.ts           # Queries/mutations para forms
│   ├── submissions.ts     # Queries/mutations para submissions
│   └── auth.ts            # Queries/mutations para autenticação
│
├── src/
│   ├── app/
│   │   ├── page.tsx              # Landing page (consome CMS)
│   │   ├── admin/
│   │   │   ├── login/page.tsx    # Página de login
│   │   │   ├── layout.tsx       # Layout admin (com AuthProvider)
│   │   │   ├── page.tsx         # Dashboard
│   │   │   ├── home/page.tsx    # Editor da home
│   │   │   ├── projects/        # CRUD de projetos
│   │   │   ├── pages/           # CRUD de páginas
│   │   │   ├── forms/           # CRUD de formulários
│   │   │   ├── submissions/     # Lista de submissões
│   │   │   ├── media/           # Biblioteca de mídia
│   │   │   ├── settings/        # Configurações gerais
│   │   │   └── ai/              # Configuração da IA
│   │   │
│   │   └── api/
│   │       └── auth/
│   │           ├── login/route.ts
│   │           ├── logout/route.ts
│   │           └── seed/route.ts
│   │
│   ├── components/
│   │   ├── admin/
│   │   │   ├── admin-auth-guard.tsx
│   │   │   ├── admin-sidebar.tsx
│   │   │   ├── section-card.tsx
│   │   │   ├── image-upload.tsx
│   │   │   └── multi-image-upload.tsx
│   │   └── ui/                  # shadcn/ui components
│   │
│   ├── hooks/
│   │   ├── use-auth.tsx         # Auth context
│   │   └── use-mobile.ts
│   │
│   └── lib/
│       └── utils.ts
│
├── docs/
│   ├── prd_landing_jarline_vieira_admin_cms.md  # PRD original
│   ├── DESIGN_SYSTEM.md                          # Design system
│   └── STATE.md                                  # Este arquivo
│
└── package.json
```

---

## DESIGN SYSTEM

O projeto segue rigorosamente o `DESIGN_SYSTEM.md` que define:
- Cores (primary, cream, white, etc)
- Tipografia (CASTLE ROCKS, Space Grotesk, Instrument Sans)
- Componentes (Button, StatCard, ServiceCard, ProjectCard, etc)
- Padrões de layout (container-width, grid-gap, etc)
- Seções da página (Navbar, Hero, Stats, About, Projects, Services, AI, Footer)

**IMPORTANTE**: Qualquer novo componente criado deve ser documentado no DESIGN_SYSTEM.md seguindo o padrão estabelecido.

---

## PRÓXIMOS PASSOS RECOMENDADOS

1. **Páginas Frontend de Projetos** - Criar e rotear `src/app/projetos/[slug]/page.tsx` para apresentar os detalhes dos projetos (já que CMS permite slug).
2. **Componentização da Home** - Quebrar a Home em seções componentes para manutenção e reuso.

*Documento criado automaticamente. Atualize conforme o progresso do projeto.*