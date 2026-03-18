import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Get all media files
export const getMedia = query({
  handler: async (ctx) => {
    return await ctx.db.query("media").order("desc").collect();
  },
});

// Get media by folder
export const getMediaByFolder = query({
  args: { folder: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("media")
      .withIndex("by_folder", (q) => q.eq("folder", args.folder))
      .collect();
  },
});

// Get media by type
export const getMediaByType = query({
  args: { type: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("media")
      .withIndex("by_type", (q) => q.eq("type", args.type))
      .collect();
  },
});

// Get media by ID
export const getMediaById = query({
  args: { id: v.id("media") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

// Add media (called after upload)
export const addMedia = mutation({
  args: {
    filename: v.string(),
    storageId: v.string(),
    url: v.string(),
    type: v.string(),
    mimeType: v.string(),
    size: v.number(),
    alt: v.optional(v.string()),
    caption: v.optional(v.string()),
    folder: v.optional(v.string()),
    tags: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    return await ctx.db.insert("media", {
      ...args,
      createdAt: now,
      updatedAt: now,
    });
  },
});

// Update media metadata
export const updateMedia = mutation({
  args: {
    id: v.id("media"),
    alt: v.optional(v.string()),
    caption: v.optional(v.string()),
    folder: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    await ctx.db.patch(id, {
      ...updates,
      updatedAt: Date.now(),
    });
  },
});

// Delete media
export const deleteMedia = mutation({
  args: { id: v.id("media") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

// Search media
export const searchMedia = query({
  args: { search: v.string() },
  handler: async (ctx, args) => {
    const all = await ctx.db.query("media").collect();
    const search = args.search.toLowerCase();
    return all.filter(m => 
      m.filename.toLowerCase().includes(search) ||
      m.alt?.toLowerCase().includes(search) ||
      m.tags?.some(t => t.toLowerCase().includes(search))
    );
  },
});