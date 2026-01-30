
import { query } from "./_generated/server";
import { v } from "convex/values";

export const searchEvents = query({
  args: {
    query: v.string(),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    if (!args.query || args.query.trim().length < 2) {
      return [];
    }

    const now = Date.now();
    const limit = args.limit ?? 5;

    const searchResults = await ctx.db
      .query("events")
      .withSearchIndex("search_title", (q) => q.search("title", args.query))
      .take(30);

    return searchResults
      .filter((event) => event.startDate >= now)
      .slice(0, limit);
  },
});