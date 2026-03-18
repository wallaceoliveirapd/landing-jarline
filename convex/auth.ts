import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { Id } from "./_generated/dataModel";

export const registerUser = mutation({
  args: {
    email: v.string(),
    passwordHash: v.string(),
    name: v.string(),
    role: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();

    if (existing) {
      throw new Error("Usuário já existe");
    }

    const userId = await ctx.db.insert("users", {
      email: args.email,
      passwordHash: args.passwordHash,
      name: args.name,
      role: args.role || "admin",
      createdAt: Date.now(),
    });

    return userId;
  },
});

export const login = mutation({
  args: {
    email: v.string(),
    passwordHash: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();

    if (!user) {
      throw new Error("Credenciais inválidas");
    }

    if (user.passwordHash !== args.passwordHash) {
      throw new Error("Credenciais inválidas");
    }

    const sessionId = await ctx.db.insert("sessions", {
      userId: user._id,
      expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000,
    });

    return {
      user: {
        _id: user._id,
        email: user.email,
        name: user.name || "Usuário",
        role: user.role,
      },
      sessionId,
    };
  },
});

export const logout = mutation({
  args: {
    sessionId: v.id("sessions"),
  },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.sessionId);
  },
});

export const getSession = query({
  args: {
    sessionId: v.id("sessions"),
  },
  handler: async (ctx, args) => {
    const session = await ctx.db.get(args.sessionId);
    if (!session || session.expiresAt < Date.now()) {
      return null;
    }
    const user = await ctx.db.get(session.userId);
    if (!user) {
      return null;
    }
    return {
      user: {
        _id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    };
  },
});

export const seedDefaultUser = mutation({
  args: {},
  handler: async (ctx) => {
    const existing = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", "wallaceoliveiraux@gmail.com"))
      .first();

    if (existing) {
      return { message: "Usuário já existe", userId: existing._id };
    }

    const userId = await ctx.db.insert("users", {
      email: "wallaceoliveiraux@gmail.com",
      passwordHash: "$2a$10$XQxEY5vK7hQv.nKx9xJ/5.Y5zK8K5zK8K5zK8K5zK8K5zK8K5zK", // will be replaced
      name: "Wallace Andrade",
      role: "admin",
      createdAt: Date.now(),
    });

    return { message: "Usuário criado com sucesso", userId };
  },
});

export const getCurrentUser = query({
  args: { sessionId: v.string() },
  handler: async (ctx, args): Promise<{ _id: string; email: string; name: string; role: string } | null> => {
    if (!args.sessionId) {
      return null;
    }

    try {
      const sessionIdObj = args.sessionId as Id<"sessions">;
      const session = await ctx.db.get(sessionIdObj);
      if (!session || session.expiresAt < Date.now()) {
        return null;
      }

      const user = await ctx.db.get(session.userId);
      if (!user) {
        return null;
      }

      return {
        _id: user._id,
        email: user.email,
        name: user.name || "Usuário",
        role: user.role,
      };
    } catch (error) {
      console.error("getCurrentUser error:", error);
      return null;
    }
  },
});

export const listUsers = query({
  args: {},
  handler: async (ctx) => {
    const users = await ctx.db.query("users").collect();
    return users.map((u) => ({
      _id: u._id,
      email: u.email,
      name: u.name,
      role: u.role,
      createdAt: u.createdAt,
    }));
  },
});

export const listAdmins = query({
  args: {},
  handler: async (ctx) => {
    const users = await ctx.db.query("users").collect();
    return users
      .filter((u) => u.role === "admin")
      .map((u) => ({
        _id: u._id,
        email: u.email,
        name: u.name,
      }));
  },
});

export const deleteUser = mutation({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.userId);
    return { success: true };
  },
});

export const updateUser = mutation({
  args: {
    userId: v.id("users"),
    name: v.string(),
    email: v.string(),
    role: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);
    if (!user) {
      throw new Error("Usuário não encontrado");
    }

    await ctx.db.patch(args.userId, {
      name: args.name,
      email: args.email,
      role: args.role || user.role,
    });

    return { success: true };
  },
});