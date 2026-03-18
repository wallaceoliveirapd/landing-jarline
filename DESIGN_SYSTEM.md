# Design System — Jarline Vieira Arquitetura

> Documentação completa do design system extraído do Figma da landing page de Jarline Vieira. Este documento cobre tokens de design, tipografia, cores, espaçamento e todos os componentes reutilizáveis identificados na página.

---

## 1. Visão Geral da Marca

Landing page para uma arquiteta independente. O visual transmite sofisticação, calor humano e profissionalismo através de uma paleta terrosa, tipografia editorial e uso intencional de espaço negativo.

**Conceito visual:** Elegância minimalista com personalidade — fundo neutro quente, acentos em verde oliva escuro, hierarquia tipográfica forte com mix de serif display + sans-serif moderna.

---

## 2. Tokens de Design

### 2.1 Cores

| Token | Hex | Uso |
|-------|-----|-----|
| `color-primary` | `#585947` | Cor principal — backgrounds, botões preenchidos, texto dark |
| `color-primary-border` | `rgba(88, 89, 71, 0.35)` | Bordas sutis de cards e containers |
| `color-cream` | `#e2e0d4` | Fundo claro, botão cream, texto sobre fundo escuro |
| `color-cream-light` | `#f6f5ed` | Fundo de cards/seções com tom mais suave |
| `color-white` | `#ffffff` | Fundo padrão de página, cards, botões |
| `color-text-body` | `#626262` | Corpo de texto secundário |
| `color-text-muted` | `#8a8a80` | Placeholder de input, texto de apoio |
| `color-text-primary` | `#585947` | Títulos e texto principal no modo claro |

#### Paleta Visual

```
Primary Dark    Cream           Cream Light     White
#585947         #e2e0d4         #f6f5ed         #ffffff
█████████       █████████       █████████       █████████

Text Body       Text Muted      Border Subtle
#626262         #8a8a80         rgba(88,89,71,0.35)
█████████       █████████       ─────────────
```

---

### 2.2 Tipografia

O projeto usa **3 famílias tipográficas** com papéis distintos.

#### Famílias

| Família | Papel | Pesos usados |
|---------|-------|--------------|
| `CASTLE ROCKS` | Display / Hero — manchetes de alto impacto | ROCKS-Bold |
| `Space Grotesk` | Headings, corpo de texto, UI | Light (300), Regular (400), Medium (500) |
| `Instrument Sans` | Botões e navegação | Regular (400), Medium (500) |
| `Carla Sans` | Decorativo / watermark | Light |

#### Escala Tipográfica

| Tamanho | Line-height | Letter-spacing | Família | Peso | Uso |
|---------|-------------|----------------|---------|------|-----|
| `240px` | `1` (none) | `-9.6px` | Carla Sans | Light | Watermark decorativo |
| `64px` | `1` (none) | `-2.56px` | Space Grotesk | Light | Section headings (`Meus projetos`, `O que faço`) |
| `58px` | `1` (none) | `-2.32px` | Space Grotesk | Medium | Stats numbers (+56, +30...) |
| `56px` | `1` (none) | `-2.24px` | Space Grotesk | Light | AI section heading |
| `55px` | `1` (none) | `-2.2px` | CASTLE ROCKS | Bold | Hero headline |
| `42px` | `1` (none) | `-1.68px` | Space Grotesk | Light | "Prazer, sou" |
| `64px` | `1` (none) | `-2.56px` | CASTLE ROCKS | Bold | Nome da arquiteta |
| `32px` | `1.1` | `-1.28px` | Space Grotesk | Medium | Card titles, AI agent name |
| `24px` | `1` (none) | `-0.96px` | Space Grotesk | Regular | Project card titles |
| `20px` | `1` (none) | `-0.8px` | Space Grotesk | Medium | Footer column headings |
| `16px` | `1.5` | `-0.64px` | Space Grotesk | Regular | Corpo de texto padrão |
| `16px` | `1.3` | `-0.64px` | Space Grotesk | Regular | Stat card labels |
| `14px` | `normal` | `+1.12px` | Instrument Sans | Medium | Botões e nav (UPPERCASE) |
| `14px` | `1.4` | `+1.68px` | Space Grotesk | Light | Labels de eyebrow (UPPERCASE) |
| `14px` | `1` (none) | `-0.56px` | Space Grotesk | Regular | Project card description, footer body |

#### Padrões de Texto

```
/* Hero Headline */
font-family: 'CASTLE ROCKS';
font-size: 55px;
letter-spacing: -2.2px;
line-height: 1;
color: #e2e0d4; /* em fundo escuro */

/* Section Heading */
font-family: 'Space Grotesk';
font-weight: 300; /* Light */
font-size: 64px;
letter-spacing: -2.56px;
line-height: 1;

/* Body Text */
font-family: 'Space Grotesk';
font-weight: 400;
font-size: 16px;
letter-spacing: -0.64px;
line-height: 1.5;
color: #626262;

/* Button / Nav Label */
font-family: 'Instrument Sans';
font-weight: 500; /* Medium */
font-size: 14px;
letter-spacing: 1.12px;
text-transform: uppercase;
```

---

### 2.3 Espaçamento

| Token | Valor | Uso |
|-------|-------|-----|
| `space-xs` | `8px` | Gap entre botões irmãos, gap de ícone+texto |
| `space-sm` | `16px` | Gap entre elementos de formulário/botões |
| `space-md` | `24px` | Gap vertical entre elementos de card |
| `space-lg` | `32px` | Gap entre cards na grid, padding de card |
| `space-xl` | `40px` | Gap entre seções menores |
| `space-2xl` | `56px` | Padding interno do hero card |
| `space-3xl` | `72px` | Padding interno da caixa de IA |
| `space-section` | `80px` | Padding vertical das seções principais (`py-80px`) |

### 2.4 Border Radius

| Token | Valor | Uso |
|-------|-------|-----|
| `radius-button` | `8px` | Todos os botões |
| `radius-card` | `16px` | Cards, containers de seção, input boxes |
| `radius-avatar` | `999px` | Avatar circular do agente de IA |

### 2.5 Layout / Grid

| Token | Valor |
|-------|-------|
| `container-width` | `1128px` |
| `page-width` | `1728px` |
| `grid-columns` | `3` (service cards), `4` (stats), `2` (hero, about) |
| `grid-gap` | `32px` |

---

## 3. Componentes

### 3.1 Button

O componente Button tem **5 variantes visuais** e **1 variante de ícone**. Todas compartilham a mesma estrutura base.

#### Estrutura Base

```
[ label text ]

padding: 16px 24px
border-radius: 8px
font: Instrument Sans Medium 14px / letter-spacing 1.12px / UPPERCASE
```

---

#### Variante: Primary (Filled Dark)

Botão padrão de ação principal. Usado no navbar, seção de serviços.

```css
background: #585947;
color: #ffffff;
border: none;
```

**Exemplo de uso:** "ORÇAMENTO COM IA", "FALAR COMIGO AGORA", "ENVIAR MENSAGEM"

---

#### Variante: Secondary (Outline Dark)

Ação secundária sobre fundo claro.

```css
background: #ffffff;
color: #585947;
border: 1px solid #585947;
```

**Exemplo de uso:** "CONTATO", "ORÇAMENTO COM IA" (variante outline na seção de serviços)

---

#### Variante: Ghost Light (Outline White)

Ação secundária sobre fundo escuro (primary dark).

```css
background: transparent;
color: #ffffff;
border: 1px solid #ffffff;
```

**Exemplo de uso:** "SABER MAIS" no hero

---

#### Variante: Cream (Filled Cream)

Ação primária dentro de um container de fundo escuro.

```css
background: #e2e0d4;
color: #585947;
border: none;
```

**Exemplo de uso:** "VER PROJETOS" no hero

---

#### Variante: Icon Arrow (Carousel Navigation)

Botão quadrado para navegação de carrossel.

```css
width: 48px;
height: 48px;
padding: 16px 24px; /* centra o ícone */
background: transparent;
border: 1px solid #e2e0d4;
border-radius: 8px;
/* Contém ícone weui:arrow-outlined 32x32 */
```

**Exemplo de uso:** Navegação de "Meus Projetos" (seta esquerda / seta direita)

---

#### Resumo das Variantes

| Variante | Background | Texto | Borda | Contexto |
|----------|------------|-------|-------|---------|
| Primary | `#585947` | white | none | Ação principal em qualquer contexto |
| Secondary | white | `#585947` | `#585947` | Ação secundária fundo claro |
| Ghost Light | transparent | white | white | Ação secundária fundo escuro |
| Cream | `#e2e0d4` | `#585947` | none | Ação primária dentro de hero escuro |
| Icon Arrow | transparent | — | `#e2e0d4` | Navegação carrossel |

---

### 3.2 Stat Card

Card de métrica numérica. Exibidos em linha de 4, na seção de credenciais.

```
┌─────────────────────┐
│                     │
│  +56                │  ← 58px / Space Grotesk Medium / letter-spacing -2.32px
│                     │
│  Projetos entregues │  ← 16px / Space Grotesk Regular / line-height 1.3
│  e executados       │
│                     │
└─────────────────────┘
```

```css
background: #ffffff;
border: 1px solid rgba(88, 89, 71, 0.35);
border-radius: 16px;
padding: 32px;
overflow: hidden;
/* Flex col, gap 8px */
```

**Conteúdo:**
- `stat-value`: `font-size: 58px`, `font-weight: 500`, `letter-spacing: -2.32px`, `line-height: 1`, `color: #585947`
- `stat-label`: `font-size: 16px`, `font-weight: 400`, `line-height: 1.3`, `letter-spacing: -0.64px`, `color: #585947`

---

### 3.3 Service Card

Card de serviço. Aparece em grid 3 colunas (linha 1) + 2 colunas (linha 2) na seção "O que faço".

```
┌──────────────────────────┐
│                          │
│  Consultoria de          │  ← 32px / Space Grotesk Medium
│  Arquitetura             │
│                          │
│  Para quem precisa de    │  ← 16px / Space Grotesk Regular / line-height 1.5
│  direcionamento...       │
│                          │
└──────────────────────────┘
```

```css
background: transparent; /* herda cor da seção: #e2e0d4 */
border: 1px solid rgba(88, 89, 71, 0.35);
border-radius: 16px;
padding: 32px;
overflow: hidden;
/* Flex col, gap 24px */
```

**Conteúdo:**
- `card-title`: `font-size: 32px`, `font-weight: 500`, `line-height: 1.1`, `letter-spacing: -1.28px`, `color: #585947`
- `card-body`: `font-size: 16px`, `font-weight: 400`, `line-height: 1.5`, `letter-spacing: -0.64px`, `color: #585947`

---

### 3.4 Project Card

Card de projeto com imagem de fundo e overlay gradiente. Exibido em carrossel horizontal.

```
┌──────────────────────────┐
│                          │
│   [imagem de fundo]      │  ← object-cover, 376 × 366px
│                          │
│▓▓▓▓ gradient overlay ▓▓▓│  ← dark gradient inferior
│                          │
│  Título do projeto       │  ← 24px / Space Grotesk Regular / white
│  Breve descrição         │  ← 14px / Space Grotesk Regular / white
└──────────────────────────┘
```

```css
width: 376px;
height: 366px;
border-radius: 0; /* dentro da faixa da seção */
overflow: hidden;
padding: 32px;
display: flex;
flex-direction: column;
justify-content: flex-end;
gap: 8px;
position: relative;
```

**Overlay gradiente:**
```css
position: absolute;
bottom: 0;
left: -32px;
width: calc(100% + 64px);
height: 248px;
background: linear-gradient(
  179.82deg,
  rgba(88, 89, 71, 0) 0.26%,
  rgba(88, 89, 71, 0.8) 61.63%
);
backdrop-filter: blur(12px);
```

**Conteúdo:**
- `project-title`: `font-size: 24px`, `font-weight: 400`, `line-height: 1`, `letter-spacing: -0.96px`, `color: white`
- `project-desc`: `font-size: 14px`, `font-weight: 400`, `line-height: 1`, `letter-spacing: -0.56px`, `color: white`

---

### 3.5 Check List Item

Item de lista com ícone de check. Usado na seção do agente de IA.

```
✓  Você explica o que precisa do seu jeito
```

```css
display: flex;
align-items: center;
gap: 8px;
```

**Conteúdo:**
- `check-icon`: 24×24px (material-symbols:check, `color: #585947`)
- `check-text`: `font-size: 16px`, `font-weight: 400`, `line-height: 1.5`, `letter-spacing: -0.64px`, `color: #585947`, `white-space: nowrap`

---

### 3.6 AI Agent Header

Apresentação do agente de IA Jal. Composto por avatar circular + nome/subtítulo + lista de features.

```
[avatar] │ Olá, me chamo a Jal          ← 32px / Space Grotesk Medium
         │ Sou sua agente de IA...       ← 16px / Space Grotesk Regular
         │
         │ ✓ Você explica do seu jeito
         │ ✓ A IA faz perguntas essenciais
         │ ✓ Recebe orientação inicial clara
         │ ✓ Mensagem vai para o WhatsApp
```

**Avatar:**
```css
width: 66px;
height: 67px;
border-radius: 999px;
background: #d4d2c2;
overflow: hidden;
flex-shrink: 0;
```

**Layout:**
```css
display: flex;
gap: 16px;
align-items: flex-start;
```

---

### 3.7 AI Chat Input Box

Caixa de texto com placeholder e botão de envio. Usada na seção "Descubra por onde começar".

```
┌────────────────────────────────────────────────┐
│                                                │
│  Você pode escrever, com suas próprias...      │
│                                                │
│                              [ENVIAR MENSAGEM] │
└────────────────────────────────────────────────┘
```

```css
background: #ffffff;
border: 1px solid #585947;
border-radius: 16px;
padding: 24px;
overflow: hidden;
display: flex;
flex-direction: column;
gap: 24px;
```

**Placeholder:**
```css
font-family: 'Space Grotesk';
font-size: 16px;
font-weight: 400;
line-height: 1.5;
letter-spacing: -0.64px;
color: #8a8a80;
```

**Botão de envio:** variante **Primary** alinhado à direita.

---

### 3.8 Contact Info Item

Item de contato com ícone + texto. Usado no footer.

```
[ícone 24px]  Texto de contato
```

```css
display: flex;
align-items: center;
gap: 8px;
```

**Text style:**
```css
font-family: 'Space Grotesk';
font-size: 14px;
font-weight: 400;
line-height: 1.5;
letter-spacing: -0.56px;
color: #e2e0d4;
```

**Ícones utilizados:**
- `ic:baseline-whatsapp` — WhatsApp
- `material-symbols:mail-outline-rounded` — Email
- `boxicons:location-filled` — Endereço
- `mdi:instagram` — Instagram

---

### 3.9 Navigation Link

Links de navegação do navbar.

```css
font-family: 'Instrument Sans';
font-weight: 400;
font-size: 14px;
letter-spacing: 1.12px;
text-transform: uppercase;
color: #585947;
line-height: normal;
```

---

### 3.10 Eyebrow Label

Texto de label acima de manchetes (subtítulo de seção).

```css
font-family: 'Space Grotesk';
font-weight: 300; /* Light */
font-size: 14px;
letter-spacing: 1.68px;
text-transform: uppercase;
line-height: 1.4;
color: #ffffff; /* em fundo escuro */
```

**Exemplo de uso:** "Soluções em arquitetura e interiores" acima do hero headline.

---

## 4. Seções da Página

### 4.1 Navbar

**Altura:** 81px | **Background:** `#ffffff` | **Padding:** `16px 8px`

```
[Logo] ─────────── [INÍCIO] [SOBRE MIM] [PROJETOS] ─── [CONTATO] [ORÇAMENTO COM IA]
```

- Container centrado: max-width `1128px`
- Logo: componente SVG da marca (Jarline Vieira)
- Nav links: 3 itens, gap `46px`, estilo Navigation Link
- CTA direita: 2 botões — Secondary + Primary, gap `8px`

---

### 4.2 Hero Section

**Background da seção:** `#ffffff` | **Padding top:** `24px`

Dividido em **2 colunas** de `548px` com gap `32px` dentro do container de `1128px`.

**Coluna esquerda — Hero Card:**
```css
background: #585947;
border-radius: 16px;
padding: 56px;
```
Conteúdo: Eyebrow Label + Hero Headline (CASTLE ROCKS, 55px) + Body Text + 2 botões (Cream + Ghost Light)

**Coluna direita — Hero Image:**
```css
border-radius: 16px;
overflow: hidden;
/* Imagem de fundo com object-cover */
/* Foto da arquiteta centralizada na vertical */
```

---

### 4.3 Stats Section

**Background:** `#ffffff` | **Padding:** `32px 0 40px`

Grid de **4 Stat Cards** com `gap: 32px` dentro do container.

---

### 4.4 About Section

**Background:** `#ffffff` | **Padding:** `32px 0 80px`

Dividido em **2 colunas** dentro do container.

**Coluna esquerda — Texto:**
```
"Prazer, sou"          ← 42px / Space Grotesk Light / #585947
"Jarline Vieira"       ← 64px / CASTLE ROCKS Bold / #585947
[3 parágrafos corpo]   ← 16px / Space Grotesk Regular / #626262 / line-height 1.5
```

**Coluna direita — Imagem:**
- Foto da arquiteta com recorte PNG (sem background)
- Imagem decorativa de textura com `opacity: 21%` como layer

---

### 4.5 Projects Section

**Background:** `#585947` | **Padding:** `80px 0`

```
Meus projetos          ← 64px / Space Grotesk Light / white

[card] [card] [card] [card] [card]   ← carrossel horizontal, 5 cards visíveis
                                       cada card: 376 × 366px

                                    [←] [→]   ← Icon Arrow buttons
```

- Section heading: `font-size: 64px`, `Space Grotesk Light`, `color: white`
- Cards em overflow horizontal com 5 itens (3 visíveis no viewport)
- Navegação com 2 Icon Arrow Buttons alinhados à direita

---

### 4.6 Services Section

**Background:** `#e2e0d4` | **Padding:** `80px 0` | **Overflow:** hidden

**Decoração de fundo:**
```
"meus serviços" repetido em 240px / Carla Sans Light / white / opacity 20%
Duas linhas paralelas, posicionadas absolutamente no topo e no rodapé da seção.
```

**Conteúdo:**
```
O que faço             ← 64px / Space Grotesk Light / #585947

[ Card 1 ]  [ Card 2 ]  [ Card 3 ]   ← grid 3 col
[ Card 4 ]  [ Card 5 ]               ← grid 2 col (sem card na col 3)

[FALAR COMIGO AGORA]  [ORÇAMENTO COM IA]
```

Grid: `gap: 32px`, Service Cards com `border: 1px solid rgba(88,89,71,0.35)`

---

### 4.7 AI Agent Section

**Background:** `#ffffff` | **Padding:** `80px 0`

```
       Descubra por onde começar        ← 56px / Space Grotesk Light / #585947 / centered
    Nem sempre é fácil saber...         ← 16px / Space Grotesk Regular / #626262 / centered / w: 670px

┌──────────────────────────────────────────────────────┐
│  Background: #f6f5ed   border-radius: 16px   p: 72px │
│                                                      │
│  [AI Agent Header com avatar, nome e checklist]      │
│                                                      │
│  [AI Chat Input Box com placeholder + botão]         │
│                                                      │
└──────────────────────────────────────────────────────┘
```

---

### 4.8 Footer

**Background:** `#585947` | **Padding:** `80px 0`

Grid de **4 colunas** com `gap: 40px` dentro do container.

| Col 1 | Col 2 | Col 3 | Col 4 |
|-------|-------|-------|-------|
| Logo SVG + "Todos os direitos reservados © 2026" | Contato (WhatsApp + Email) | Endereço | Siga me (Instagram) |

**Heading de cada coluna:**
```css
font-family: 'Space Grotesk';
font-weight: 500;
font-size: 20px;
letter-spacing: -0.8px;
line-height: 1;
color: #e2e0d4;
```

---

### 4.9 Footer Image (Map)

**Largura:** 100% da página | **Aspect ratio:** 2972/1012

Imagem estática de mapa (Google Maps ou similar) servindo como encerramento visual da página.

---

## 5. Ícones

| Identificador | Uso | Tamanho |
|--------------|-----|---------|
| `weui:arrow-outlined` | Botões de navegação do carrossel | 32×32px |
| `material-symbols:check` | Check list items na seção IA | 24×24px |
| `ic:baseline-whatsapp` | Contato no footer | 24×24px |
| `material-symbols:mail-outline-rounded` | Email no footer | 24×24px |
| `boxicons:location-filled` | Endereço no footer | 24×24px |
| `mdi:instagram` | Instagram no footer | 24×24px |

---

## 6. Padrões de Comportamento

### Gradiente de Overlay em Cards de Projeto

Padrão visual para manter legibilidade do texto sobre imagem:

```css
background: linear-gradient(
  179.82deg,
  rgba(88, 89, 71, 0) 0.26%,
  rgba(88, 89, 71, 0.8) 61.63%
);
backdrop-filter: blur(12px);
```

### Decoração Tipográfica "Watermark"

Texto decorativo repetido em tamanho gigante, `opacity: 20%`, posicionado absolutamente para criar profundidade visual:

```css
font-family: 'Carla Sans';
font-weight: 300;
font-size: 240px;
letter-spacing: -9.6px;
line-height: 1;
color: #ffffff;
opacity: 0.20;
position: absolute;
white-space: nowrap;
```

### Imagem Decorativa de Arquitetura

Na seção About, uma imagem de planta arquitetônica é usada como textura de fundo com opacidade reduzida:

```css
opacity: 0.21;
position: absolute;
/* Dimensionamento maior que o container para criar efeito de preenchimento */
```

---

## 7. Tokens CSS Recomendados

```css
:root {
  /* Colors */
  --color-primary: #585947;
  --color-primary-border: rgba(88, 89, 71, 0.35);
  --color-cream: #e2e0d4;
  --color-cream-light: #f6f5ed;
  --color-white: #ffffff;
  --color-text-body: #626262;
  --color-text-muted: #8a8a80;

  /* Typography */
  --font-display: 'CASTLE ROCKS', serif;
  --font-heading: 'Space Grotesk', sans-serif;
  --font-ui: 'Space Grotesk', sans-serif;
  --font-decorative: 'Carla Sans', sans-serif;

  /* Spacing */
  --space-xs: 8px;
  --space-sm: 16px;
  --space-md: 24px;
  --space-lg: 32px;
  --space-xl: 40px;
  --space-2xl: 56px;
  --space-3xl: 72px;
  --space-section: 80px;

  /* Border Radius */
  --radius-button: 8px;
  --radius-card: 16px;
  --radius-avatar: 999px;

  /* Layout */
  --container-width: 1128px;
  --page-width: 1728px;
  --grid-gap: 32px;
}
```

---

## 8. Resumo de Componentes Reutilizáveis

| Componente | Instâncias na Página |
|-----------|----------------------|
| `Button / Primary` | Navbar, Hero, Serviços, IA, Footer |
| `Button / Secondary` | Navbar, Serviços |
| `Button / Ghost Light` | Hero |
| `Button / Cream` | Hero |
| `Button / Icon Arrow` | Carrossel de Projetos |
| `Stat Card` | Seção de Stats (×4) |
| `Service Card` | Seção de Serviços (×5) |
| `Project Card` | Carrossel de Projetos (×5) |
| `Check List Item` | Seção IA (×4) |
| `AI Agent Header` | Seção IA (×1) |
| `AI Chat Input Box` | Seção IA (×1) |
| `Contact Info Item` | Footer (×4) |
| `Navigation Link` | Navbar (×3) |
| `Eyebrow Label` | Hero (×1) |

---

## 9. Admin Dashboard (CMS)

> O painel administrativo segue uma estética **Premium Minimalist**. Diferente da landing page, que possui tons terrosos profundos, o admin utiliza um fundo branco puro para foco máximo na gestão, mantendo a sofisticação através da tipografia e do uso da cor primária apenas como acento.

### 9.1 Padrão de Navegação e Edição

### Admin Dashboard Standards

The administrative interface follows a more utilitarian yet premium aesthetic.

#### 1. Typography Hierarchy
- **Primary Titles (>= 40px)**: Use `font-display  ` with `font-medium`. Never use bold.
- **UI Elements (Labels, Tabs, Smaller Headings < 40px)**: Use `font-ui`.
- **Weights**: Never use `font-bold` for UI elements. Use `font-medium` for emphasis/active states.
- **Labels**: Small caps style (e.g., `text-[10px] font-medium uppercase tracking-[0.2em] font-ui text-zinc-400`).
- **Input Text**: Always use `font-ui` for readability.

#### 2. Specialized Components

##### Custom Tabs (Premium Admin)
The `TabsList` and `TabsTrigger` components follow these rules:
- `TabsList`: `bg-zinc-100/40`, `rounded-2xl`, `p-1.5`, `h-16` or `h-20`.
- `TabsTrigger`: `rounded-xl`, `px-12`, `font-medium` (not bold), `tracking-[0.15em]`, `font-ui`.
- **Active State**: Background `bg-primary`, text `text-white`, shadow `shadow-xl shadow-primary/20`.
- **Inactive State**: `text-zinc-500` or `text-zinc-900` depending on context.

##### Premium Inputs & Textareas
- **Base Background**: `bg-zinc-50`.
- **Border**: `border-zinc-100`.
- **Focus State**: `focus:bg-white` with `transition-all`.
- **Corners**: `rounded-2xl`.
- **Shadow**: Removed default focus rings for a cleaner, inset look.

##### Sticky Persistence Bar
- Located at the bottom of editor pages (`sticky bottom-10`).
- Features a `backdrop-blur-3xl` for high-end transparency.
- **Status Indicator**: Uses the primary color with a glowing shadow for the 'published' state: `shadow-[0_0_15px_rgba(88,89,71,0.2)]`.

##### Image Upload
- Consistently uses the `ImageUpload` and `MultiImageUpload` components.
- Integrated with Convex Storage for direct uploads instead of URL links.
- Uses `font-ui` for all labels and descriptions.

*   **Edição em Página Inteira**: Em vez de modais ou sheets laterais, a criação e edição de entidades (projetos, páginas, formulários) ocorrem em rotas dedicadas (`/admin/entity/[id]`). Isso permite foco total e espaço para interfaces complexas.
*   **Header de Contexto**: Cada editor possui um header fixo no topo com:
    *   Breadcrumb minimalista (botão voltar com ícone `ChevronLeft`).
    *   Título da entidade em `font-display  ` tamanho `5xl`.
*   **Tabs de Navegação (Premium)**:
    *   **Estrutura**: `h-20`, `bg-zinc-100/40`, `rounded-2xl`, `p-1.5`.
    *   **Trigger**: `rounded-xl`, `px-12`, `font-bold`, `tracking-[0.15em]`.
    *   **Estado Ativo**: `bg-primary`, `text-white`, `shadow-xl shadow-primary/20`.
*   **Barra de Persistência (Sticky Footer)**:
    *   **Posição**: Centralizada no rodapé (`bottom-10`), largura máxima que acompanha o conteúdo do formulário.
    *   **Estética**: `bg-white/80`, `backdrop-blur-3xl`, `border-zinc-100/50`, `shadow-2xl`.
    *   **Status Indicator**: Dot animado com `shadow-primary/20` (ativo) ou `bg-red-400` (pausado/rascunho).
    *   **Botão Primário**: Variante `premium` (Primary color, 8px radius, hover scale).

### 9.2 Tipografia Admin

*   **Display  **: Títulos de página usam a fonte `font-display` (Space Grotesk ou Castle Rocks) com ` ` e `tracking-tighter`.
*   **Labels Mono/Upppercase**: Rótulos de campo usam `text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400`.
*   **Inputs Premium**: Campos de texto com `rounded-3xl`, `bg-zinc-50` e transição para `bg-white` no foco.

### 9.3 Componentes de Gestão

*   **Image Upload (Single & Multi)**:
    *   **ImageUpload**: Componente para upload único via Convex Storage. Preview com `aspect-video` ou `aspect-square`, `rounded-2xl`.
    *   **MultiImageUpload (Gallery)**: Gestão de múltiplos uploads para galerias. Thumbnails em grid com ações de remover no hover.
    *   **Estética**: Bordas tracejadas `zinc-200`, `hover:border-primary`, ícones minimalistas.
*   **Block Editor**: Interface para montagem de conteúdo modular (Heading, Text, Image) com integração de `ImageUpload` nos blocos de imagem.
*   **Slug Automático**: Geração reativa de slug a partir do título, com opção de edição manual. Botão "Reset" com ícone `RefreshCw`.

### 9.4 Visão Geral Visual (Admin)

A estética **Premium Minimalist** do admin prioriza funcionalidade sem sacrificar o refinamento da marca.

| Atributo | Valor | Motivo |
|----------|-------|--------|
| **Background** | `#ffffff` (White) | Base limpa e editorial |
| **Texto Principal** | `text-zinc-900` | Legibilidade máxima |
| **Acento Sidebar** | `#18181B` (Zinc-900) | Destaque de estado ativo |
| **Cor de Marca** | `#585947` (Primary) | Usado em indicadores, estados ativos de tabs e botões premium |
| **Bordas** | `rgba(0,0,0,0.05)` | Separação física via sombras sutis |

### 9.5 Layout de Sistema

#### 9.5.1 Estrutura Global
- **Sidebar Provider:** Gerencia o estado do menu recolhível.
- **Sidebar Inset:** Container principal com `bg-white` e `backdrop-blur` no header.
- **Max Width:** Conteúdo centralizado em `max-w-[1400px]` (Dashboard) ou `max-w-[1000px]` (Editores) para foco.
- **Padding:** Padrão de `px-8 sm:px-12` para o corpo das páginas.

#### 9.5.2 Header
- **Altura:** `h-16` (64px).
- **Background:** `bg-white/80` com `backdrop-blur-md`.
- **Interação:** Borda inferior dinâmica `border-zinc-100` que aparece apenas no scroll.

### 9.6 Cursor Customizado
O admin compartilha o componente `<CustomCursor />` da landing page para manter a identidade imersiva.
- **Implementação**: Velocidade de acompanhamento ajustada para precisão (`0.15` a `0.2`).
- **CSS**: `cursor: none !important` em elementos interativos para forçar o dot customizado.

---

*Gerado a partir do design Figma: `NSWamtp8CrROsboxqdG3RM` — node `299:148`*
*Última atualização: Março 2026 — Refinamento CMS, Image Storage & Extended Persistence Bar*
