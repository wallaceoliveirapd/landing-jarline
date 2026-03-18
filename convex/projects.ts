import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { Id } from "./_generated/dataModel";

// Get all projects, ordered by 'order'
export const getProjects = query({
  handler: async (ctx) => {
    return await ctx.db.query("projects").withIndex("by_order").collect();
  },
});

// Get published projects only
export const getPublishedProjects = query({
  handler: async (ctx) => {
    return await ctx.db
      .query("projects")
      .withIndex("by_status", (q) => q.eq("status", "published"))
      .collect();
  },
});

// Get featured projects
export const getFeaturedProjects = query({
  handler: async (ctx) => {
    return await ctx.db
      .query("projects")
      .filter((q) => q.and(q.eq(q.field("isFeatured"), true), q.eq(q.field("status"), "published")))
      .collect();
  },
});

// Get a single project
export const getProject = query({
  args: { id: v.id("projects") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const getProjectById = getProject;

// Get project by slug
export const getProjectBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("projects")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .first();
  },
});

// Create a new project
export const createProject = mutation({
  args: {
    title: v.string(),
    slug: v.string(),
    category: v.optional(v.string()),
    subtitle: v.optional(v.string()),
    summary: v.optional(v.string()),
    coverImage: v.optional(v.string()),
    content: v.optional(v.any()),
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
    status: v.string(),
    isFeatured: v.boolean(),
    order: v.number(),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    return await ctx.db.insert("projects", {
      ...args,
      publishedAt: args.status === "published" ? now : undefined,
      createdAt: now,
      updatedAt: now,
    });
  },
});

// Update a project
export const updateProject = mutation({
  args: {
    id: v.id("projects"),
    title: v.optional(v.string()),
    slug: v.optional(v.string()),
    category: v.optional(v.string()),
    subtitle: v.optional(v.string()),
    summary: v.optional(v.string()),
    coverImage: v.optional(v.string()),
    content: v.optional(v.any()),
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
    status: v.optional(v.string()),
    isFeatured: v.optional(v.boolean()),
    order: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    const existing = await ctx.db.get(id);
    
    // Handle publishedAt and updatedAt
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

// Delete a project
export const deleteProject = mutation({
  args: { id: v.id("projects") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

// Reorder projects
export const reorderProjects = mutation({
  args: {
    projects: v.array(v.object({
      id: v.id("projects"),
      order: v.number(),
    })),
  },
  handler: async (ctx, args) => {
    for (const p of args.projects) {
      await ctx.db.patch(p.id, { order: p.order });
    }
  },
});