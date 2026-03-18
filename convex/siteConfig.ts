import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Get site config
export const getSiteConfig = query({
  handler: async (ctx) => {
    return await ctx.db.query("siteConfig").first();
  },
});

// Save site config
export const saveSiteConfig = mutation({
  args: {
    siteName: v.optional(v.string()),
    professionalName: v.optional(v.string()),
    logo: v.optional(v.string()),
    favicon: v.optional(v.string()),
    email: v.optional(v.string()),
    phone: v.optional(v.string()),
    whatsapp: v.optional(v.string()),
    instagram: v.optional(v.string()),
    address: v.optional(v.string()),
    externalLinks: v.optional(v.array(v.object({
      label: v.string(),
      url: v.string(),
      openInNewTab: v.boolean(),
    }))),
    businessHours: v.optional(v.string()),
    institutionalText: v.optional(v.string()),
    copyright: v.optional(v.string()),
    mapUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db.query("siteConfig").first();
    const now = Date.now();
    
    const data = {
      ...args,
      externalLinks: args.externalLinks || [],
    };
    
    if (existing) {
      await ctx.db.patch(existing._id, {
        ...data,
        updatedAt: now,
      });
      return existing._id;
    } else {
      return await ctx.db.insert("siteConfig", {
        ...data,
        updatedAt: now,
      });
    }
  },
});