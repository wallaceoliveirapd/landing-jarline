import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const getSubmissions = query({
  handler: async (ctx) => {
    return await ctx.db
      .query("submissions")
      .withIndex("by_created")
      .order("desc")
      .collect();
  },
});

export const getSubmissionsWithForms = query({
  handler: async (ctx) => {
    const [submissions, forms] = await Promise.all([
      ctx.db.query("submissions").withIndex("by_created").order("desc").collect(),
      ctx.db.query("forms").collect(),
    ]);

    const formsMap = new Map(
      forms.map((f) => [
        f._id.toString(),
        { title: f.title, fields: f.fields.map((field) => ({ id: field.id, label: field.label })) },
      ])
    );

    return submissions.map((sub) => {
      const form = formsMap.get(sub.formId.toString());
      return {
        ...sub,
        formTitle: form?.title ?? "Formulário removido",
        formFields: form?.fields ?? [],
      };
    });
  },
});

export const getSubmissionsByForm = query({
  args: { formId: v.id("forms") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("submissions")
      .withIndex("by_formId", (q) => q.eq("formId", args.formId))
      .order("desc")
      .collect();
  },
});

export const getSubmissionById = query({
  args: { id: v.id("submissions") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const createSubmission = mutation({
  args: {
    formId: v.id("forms"),
    data: v.any(),
  },
  handler: async (ctx, args) => {
    const form = await ctx.db.get(args.formId);
    
    const submissionId = await ctx.db.insert("submissions", {
      formId: args.formId,
      data: args.data,
      status: "new",
      createdAt: Date.now(),
    });

    return submissionId;
  },
});

export const updateStatus = mutation({
  args: {
    id: v.id("submissions"),
    status: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { status: args.status });
  },
});

export const deleteSubmission = mutation({
  args: { id: v.id("submissions") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

export const markAsRead = mutation({
  args: { id: v.id("submissions") },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { status: "read" });
  },
});

export const markAsAnswered = mutation({
  args: { id: v.id("submissions") },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { status: "answered" });
  },
});

export const getSubmissionCounts = query({
  handler: async (ctx) => {
    const all = await ctx.db.query("submissions").collect();
    const byStatus = {
      new: all.filter(s => s.status === "new").length,
      read: all.filter(s => s.status === "read").length,
      answered: all.filter(s => s.status === "answered").length,
    };
    return {
      total: all.length,
      ...byStatus,
    };
  },
});
