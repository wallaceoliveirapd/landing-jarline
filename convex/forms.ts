import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

type FormField = {
  id: string;
  type: string;
  label: string;
  placeholder?: string;
  helpText?: string;
  required: boolean;
  defaultValue?: string;
  mask?: string;
  width?: string;
  options?: { value: string; label: string }[];
  validation?: {
    minLength?: number;
    maxLength?: number;
    pattern?: string;
  };
  order: number;
  visible: boolean;
};

type FormDocument = {
  _id: string;
  _creationTime: number;
  title: string;
  slug?: string;
  displayTitle?: string;
  description?: string;
  successMessage?: string;
  targetEmail?: string;
  notifyAllAdmins: boolean;
  redirectUrl?: string;
  sendEmail: boolean;
  sendWhatsApp: boolean;
  whatsappNumber?: string;
  allowRecaptcha: boolean;
  fields: FormField[];
  status: string;
  createdAt: number;
  updatedAt: number;
};

export const getForms = query({
  handler: async (ctx) => {
    return await ctx.db.query("forms").collect();
  },
});

export const getActiveForms = query({
  handler: async (ctx) => {
    return await ctx.db
      .query("forms")
      .filter((q) => q.eq(q.field("status"), "active"))
      .collect();
  },
});

export const getFormById = query({
  args: { id: v.id("forms") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const getFormBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("forms")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .first();
  },
});

export const createForm = mutation({
  args: {
    title: v.string(),
    slug: v.optional(v.string()),
    displayTitle: v.optional(v.string()),
    description: v.optional(v.string()),
    successMessage: v.optional(v.string()),
    targetEmail: v.optional(v.string()),
    notifyAllAdmins: v.boolean(),
    redirectUrl: v.optional(v.string()),
    sendEmail: v.boolean(),
    sendWhatsApp: v.boolean(),
    whatsappNumber: v.optional(v.string()),
    allowRecaptcha: v.boolean(),
    fields: v.array(v.object({
      id: v.string(),
      type: v.string(),
      label: v.string(),
      placeholder: v.optional(v.string()),
      helpText: v.optional(v.string()),
      required: v.boolean(),
      defaultValue: v.optional(v.string()),
      mask: v.optional(v.string()),
      width: v.optional(v.string()),
      options: v.optional(v.array(v.object({ value: v.string(), label: v.string() }))),
      validation: v.optional(v.object({
        minLength: v.optional(v.number()),
        maxLength: v.optional(v.number()),
        pattern: v.optional(v.string()),
      })),
      order: v.number(),
      visible: v.boolean(),
    })),
    status: v.string(),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    return await ctx.db.insert("forms", {
      ...args,
      createdAt: now,
      updatedAt: now,
    });
  },
});

export const updateForm = mutation({
  args: {
    id: v.id("forms"),
    title: v.optional(v.string()),
    slug: v.optional(v.string()),
    displayTitle: v.optional(v.string()),
    description: v.optional(v.string()),
    successMessage: v.optional(v.string()),
    targetEmail: v.optional(v.string()),
    notifyAllAdmins: v.optional(v.boolean()),
    redirectUrl: v.optional(v.string()),
    sendEmail: v.optional(v.boolean()),
    sendWhatsApp: v.optional(v.boolean()),
    whatsappNumber: v.optional(v.string()),
    allowRecaptcha: v.optional(v.boolean()),
    fields: v.optional(v.array(v.object({
      id: v.string(),
      type: v.string(),
      label: v.string(),
      placeholder: v.optional(v.string()),
      helpText: v.optional(v.string()),
      required: v.boolean(),
      defaultValue: v.optional(v.string()),
      mask: v.optional(v.string()),
      width: v.optional(v.string()),
      options: v.optional(v.array(v.object({ value: v.string(), label: v.string() }))),
      validation: v.optional(v.object({
        minLength: v.optional(v.number()),
        maxLength: v.optional(v.number()),
        pattern: v.optional(v.string()),
      })),
      order: v.number(),
      visible: v.boolean(),
    }))),
    status: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    await ctx.db.patch(id, {
      ...updates,
      updatedAt: Date.now(),
    });
  },
});

export const deleteForm = mutation({
  args: { id: v.id("forms") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

export const duplicateForm = mutation({
  args: { id: v.id("forms") },
  handler: async (ctx, args) => {
    const original = await ctx.db.get(args.id);
    if (!original) {
      throw new Error("Formulário não encontrado");
    }
    
    const now = Date.now();
    const originalData = original as FormDocument;
    const { _id, _creationTime, createdAt, updatedAt, ...data } = originalData;
    
    return await ctx.db.insert("forms", {
      ...data,
      title: `${data.title} (Cópia)`,
      status: "inactive",
      createdAt: now,
      updatedAt: now,
    });
  },
});