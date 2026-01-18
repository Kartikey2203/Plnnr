import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const createUser = mutation({
  args: {
    email: v.string(),
    imageUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    console.log("📦 Convex mutation hit:", args.email);

    const existing = await ctx.db
      .query("users")
      .filter(q => q.eq(q.field("email"), args.email))
      .first();

    if (existing) return;

    await ctx.db.insert("users", {
      email: args.email,
      imageUrl: args.imageUrl,
      hasCompletedOnboard: false,
      freeEventsCreated: 0,
      createdAt: Date.now(),
    });
  },
});
