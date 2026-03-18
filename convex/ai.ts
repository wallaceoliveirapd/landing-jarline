import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Get AI config
export const getAiConfig = query({
  handler: async (ctx) => {
    return await ctx.db.query("aiConfig").first();
  },
});

// Create or update AI config
export const saveAiConfig = mutation({
  args: {
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
    isActive: v.boolean(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db.query("aiConfig").first();
    const now = Date.now();
    
    if (existing) {
      await ctx.db.patch(existing._id, {
        ...args,
        version: existing.version ? existing.version + 1 : 1,
        updatedAt: now,
      });
      return existing._id;
    } else {
      return await ctx.db.insert("aiConfig", {
        ...args,
        version: 1,
        createdAt: now,
        updatedAt: now,
      });
    }
  },
});

// Toggle AI active status
export const toggleAiActive = mutation({
  args: { isActive: v.boolean() },
  handler: async (ctx, args) => {
    const existing = await ctx.db.query("aiConfig").first();
    if (existing) {
      await ctx.db.patch(existing._id, { isActive: args.isActive });
    }
  },
});