import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // ═══════════════════════════════════════════════════════════
  // USUARIOS E AUTENTICAÇÃO
  // ═══════════════════════════════════════════════════════════
  
  users: defineTable({
    email: v.string(),
    passwordHash: v.string(),
    name: v.string(),
    role: v.string(), // "admin" | "editor"
    createdAt: v.number(),
  }).index("by_email", ["email"]),

  sessions: defineTable({
    userId: v.id("users"),
    expiresAt: v.number(),
  }).index("by_session", ["userId"]),

  // ═══════════════════════════════════════════════════════════
  // CONFIGURAÇÕES GERAIS DO SITE (Seção 11 do PRD)
  // ═══════════════════════════════════════════════════════════
  
  settings: defineTable({
    key: v.string(),
    value: v.any(),
  }).index("by_key", ["key"]),

  // ═══════════════════════════════════════════════════════════
  // HOME - CONFIGURAÇÕES COMPLETAS (Seção 6 do PRD)
  // ═══════════════════════════════════════════════════════════
  // Cada seção da home terá sua própria key no settings table:
  // - hero: caption, title, subtitle, image, ctaPrimary, ctaSecondary
  // - bignumbers: title, subtitle, cards[]
  // - about: title, subtitle, description, image, highlights[]
  // - projects: title, subtitle, description, featuredProjects[]
  // - services: title, subtitle, description, services[]
  // - aiSection: title, subtitle, benefits[], finalText, image, cta
  // - footer: institutionalName, institutionalText, contact{}, social{}, links[], copyright

  // ═══════════════════════════════════════════════════════════
  // PROJETOS (Seção 7 do PRD)
  // ═══════════════════════════════════════════════════════════
  
  projects: defineTable({
    title: v.string(),
    slug: v.string(),
    category: v.optional(v.string()),
    subtitle: v.optional(v.string()),
    summary: v.optional(v.string()),
    coverImage: v.optional(v.string()),
    content: v.optional(v.any()), // Editor rico - Tiptap JSON
    gallery: v.optional(v.array(v.object({
      url: v.string(),
      alt: v.optional(v.string()),
      caption: v.optional(v.string()),
      isMain: v.boolean(),
      order: v.number(),
    }))),
    seoTitle: v.optional(v.string()),
    seoDescription: v.optional(v.string()),
    seoImage: v.optional(v.string()),
    status: v.string(), // "draft" | "published"
    isFeatured: v.boolean(),
    order: v.number(),
    publishedAt: v.optional(v.number()),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_order", ["order"]).index("by_slug", ["slug"]).index("by_status", ["status"]),

  // ═══════════════════════════════════════════════════════════
  // PÁGINAS (Seção 8 do PRD)
  // ═══════════════════════════════════════════════════════════
  
  pages: defineTable({
    title: v.string(),
    slug: v.string(),
    description: v.optional(v.string()),
    coverImage: v.optional(v.string()),
    content: v.optional(v.any()), // Editor rico - Tiptap JSON
    status: v.string(), // "draft" | "published"
    seoTitle: v.optional(v.string()),
    seoDescription: v.optional(v.string()),
    seoImage: v.optional(v.string()),
    publishedAt: v.optional(v.number()),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_slug", ["slug"]).index("by_status", ["status"]),

  // ═══════════════════════════════════════════════════════════
  // FORMULÁRIOS (Seção 9 do PRD)
  // ═══════════════════════════════════════════════════════════
  
  forms: defineTable({
    title: v.string(), // Nome interno
    slug: v.optional(v.string()), // URL pública: /form/[slug]
    displayTitle: v.optional(v.string()), // Título visível
    description: v.optional(v.string()),
    successMessage: v.optional(v.string()),
    targetEmail: v.optional(v.string()),
    notifyAllAdmins: v.optional(v.boolean()), // Enviar para todos os admins (default: true)
    redirectUrl: v.optional(v.string()),
    sendEmail: v.boolean(),
    sendWhatsApp: v.boolean(),
    whatsappNumber: v.optional(v.string()),
    allowRecaptcha: v.boolean(),
    fields: v.array(v.object({
      id: v.string(),
      type: v.string(), // text, email, phone, number, date, select, radio, checkbox, dropdown, textarea, file, url, address, title, separator, description, hidden, acceptance
      label: v.string(),
      placeholder: v.optional(v.string()),
      helpText: v.optional(v.string()),
      required: v.boolean(),
      defaultValue: v.optional(v.string()),
      mask: v.optional(v.string()),
      width: v.optional(v.string()), // full, half, third
      options: v.optional(v.array(v.object({ value: v.string(), label: v.string() }))),
      validation: v.optional(v.object({
        minLength: v.optional(v.number()),
        maxLength: v.optional(v.number()),
        pattern: v.optional(v.string()),
      })),
      order: v.number(),
      visible: v.boolean(),
    })),
    status: v.string(), // "active" | "inactive"
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_slug", ["slug"]),

  // ═══════════════════════════════════════════════════════════
  // SUBMISSÕES (Seção 9.7 do PRD)
  // ═══════════════════════════════════════════════════════════
  
  submissions: defineTable({
    formId: v.id("forms"),
    data: v.any(), // Objeto com os dados dos campos
    status: v.string(), // "new" | "read" | "answered"
    createdAt: v.number(),
  }).index("by_formId", ["formId"]).index("by_status", ["status"]).index("by_created", ["createdAt"]),

  // ═══════════════════════════════════════════════════════════
  // CHAT COM IA (Seção 10 do PRD)
  // ═══════════════════════════════════════════════════════════
  
  aiConfig: defineTable({
    // Campos de treinamento
    nomeArquiteta: v.string(),
    posicionamento: v.string(),
    tomVoz: v.string(),
    objetivoIA: v.string(),
    instrucoesGerais: v.string(),
    faz: v.string(),
    naoFaz: v.string(),
    servicosOferecidos: v.string(),
    criteriosRecomendacao: v.string(),
    perguntasEssenciais: v.array(v.string()),
    perguntasOpcionais: v.array(v.string()),
    estruturaMensagemFinal: v.string(),
    textoEncerramento: v.string(),
    whatsappNumber: v.string(),
    regraPreservacao: v.string(),
    exemplosEntrada: v.array(v.string()),
    exemplosSaida: v.array(v.string()),
    
    // Configurações operacionais
    isActive: v.boolean(),
    version: v.number(),
    createdAt: v.number(),
    updatedAt: v.number(),
  }),

  // ═══════════════════════════════════════════════════════════
  // MÍDIA / BIBLIOTECA (Seção 12 do PRD)
  // ═══════════════════════════════════════════════════════════
  
  media: defineTable({
    filename: v.string(),
    storageId: v.string(), // ID do arquivo no Convex Storage
    url: v.string(),
    type: v.string(), // image, video, document
    mimeType: v.string(),
    size: v.number(),
    alt: v.optional(v.string()),
    caption: v.optional(v.string()),
    folder: v.optional(v.string()),
    tags: v.array(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_folder", ["folder"]).index("by_type", ["type"]),

  // ═══════════════════════════════════════════════════════════
  // CONFIGURAÇÕES GERAIS DO SITE (Seção 11 do PRD)
  // ═══════════════════════════════════════════════════════════
  
  siteConfig: defineTable({
    siteName: v.optional(v.string()),
    professionalName: v.optional(v.string()),
    logo: v.optional(v.string()),
    favicon: v.optional(v.string()),
    email: v.optional(v.string()),
    phone: v.optional(v.string()),
    whatsapp: v.optional(v.string()),
    instagram: v.optional(v.string()),
    address: v.optional(v.string()),
    externalLinks: v.array(v.object({
      label: v.string(),
      url: v.string(),
      openInNewTab: v.boolean(),
    })),
    businessHours: v.optional(v.string()),
    institutionalText: v.optional(v.string()),
    copyright: v.optional(v.string()),
    mapUrl: v.optional(v.string()),
    updatedAt: v.number(),
  }),
});