import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Get all pages
export const getPages = query({
  handler: async (ctx) => {
    return await ctx.db.query("pages").collect();
  },
});

export const getPageById = query({
  args: { id: v.id("pages") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

// Get a single page by slug
export const getPageBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("pages")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .unique();
  },
});

// Create a new page
export const createPage = mutation({
  args: {
    title: v.string(),
    slug: v.string(),
    description: v.optional(v.string()),
    coverImage: v.optional(v.string()),
    content: v.optional(v.any()), // Can be rich text JSON
    status: v.string(), // "draft" | "published"
    seoTitle: v.optional(v.string()),
    seoDescription: v.optional(v.string()),
    seoImage: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    return await ctx.db.insert("pages", {
      ...args,
      publishedAt: args.status === "published" ? now : undefined,
      createdAt: now,
      updatedAt: now,
    });
  },
});

// Update a page
export const updatePage = mutation({
  args: {
    id: v.id("pages"),
    title: v.optional(v.string()),
    slug: v.optional(v.string()),
    description: v.optional(v.string()),
    coverImage: v.optional(v.string()),
    content: v.optional(v.any()),
    status: v.optional(v.string()),
    seoTitle: v.optional(v.string()),
    seoDescription: v.optional(v.string()),
    seoImage: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    const existing = await ctx.db.get(id);
    
    let additionalUpdates = {};
    if (updates.status && updates.status !== existing?.status) {
      additionalUpdates = {
        publishedAt: updates.status === "published" ? Date.now() : undefined,
      };
    }
    
    await ctx.db.patch(id, {
      ...updates,
      ...additionalUpdates,
      updatedAt: Date.now(),
    });
  },
});

// Delete a page
export const deletePage = mutation({
  args: { id: v.id("pages") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
