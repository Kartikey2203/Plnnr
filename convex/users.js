import { mutation } from "./_generated/server";
import { v } from "convex/values";

// This mutation will be called when a user signs in
export const store = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    
    if (!identity) {
      throw new Error("Called storeUser without authentication present");
    }

    // Check if user already exists
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
      .unique();

    if (user !== null) {
      // User already exists, return the existing user
      return user._id;
    }

    // Create new user
    const userId = await ctx.db.insert("users", {
      clerkId: identity.subject,
      email: identity.email ?? "",
      name: identity.name ?? "",
      image: identity.pictureUrl ?? "",
      createdAt: Date.now(),
    });

    return userId;
  },
});