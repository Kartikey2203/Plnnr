import { query } from "./_generated/server";
import { v } from "convex/values";

export const getFeaturedEvents = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();

    // 1️ fetch upcoming events using index
    const events = await ctx.db
      .query("events")
      .withIndex("by_start_date", (q) =>
        q.gte("startDate", now)
      )
      .collect();

    // 2️ sort by registration count (featured logic)
    const featured = events
      .sort(
        (a, b) =>
          (b.registrationCount ?? 0) -
          (a.registrationCount ?? 0)
      )
      .slice(0, args.limit ?? 6);

    return featured;
  },
});

export const getEventsByLocation = query({
  args: {
    city: v.optional(v.string()),
    state: v.optional(v.string()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const limit = args.limit ?? 4;

    // Helper to fetch events
    const fetchEvents = async (city, state) => {
      let events = await ctx.db
        .query("events")
        .withIndex("by_start_date", (q) => q.gte("startDate", now))
        .collect();

      if (city) {
        events = events.filter((e) => e.city?.toLowerCase() === city.toLowerCase());
      }
      if (state) {
        events = events.filter((e) => e.state?.toLowerCase() === state.toLowerCase());
      }
      
      return events;
    };

    // 1. Try fetching for requested location
    let results = await fetchEvents(args.city, args.state);

    // 2. Fallback to Gurgaon if empty and a specific city was requested
    if (results.length === 0 && args.city) {
      results = await fetchEvents("Gurgaon", "Haryana");
    }

    // 3. Sort by date and slice
    return results
      .sort((a, b) => a.startDate - b.startDate)
      .slice(0, limit);
  },
});

export const getPopularEvents= query({
      args: {
    limit: v.optional(v.number()),
  },
   handler: async (ctx, args) => {
    const now = Date.now();

    //  must be let (we reassign it later)
    let events = await ctx.db
      .query("events")
      .withIndex("by_start_date", (q) =>
        q.gte("startDate", now)
      )
      .collect();
    // 2️ sort by registration count (featured logic)
    const popular = events
      .sort( (a, b) =>(b.registrationCount ?? 0) - (a.registrationCount ?? 0))
      .slice(0, args.limit ?? 6);


    //  optional limit
    return popular;
  },
});
export const getEventsByCategory= query({
      args: {
        category: v.string(),
    limit: v.optional(v.number()),
  },
   handler: async (ctx, args) => {
    const now = Date.now();

    //  must be let (we reassign it later)
    let events = await ctx.db
    .query("events")
    .withIndex("by_category_startDate", (q) =>q.eq("category", args.category))
    .filter((q)=>q.gte("startDate", now) )
    .collect();

return events.slice(0, args.limit ?? 12);

  },
});

export const getCategoryCounts = query({
  handler: async (ctx) => {
    const now = Date.now();
    const events = await ctx.db
      .query("events")
      .withIndex("by_start_date")
      .filter((q) => q.gte(q.field("startDate"), now))
      .collect();

    // Count events by category
    const counts = {};
    events.forEach((event) => {
      counts[event.category] = (counts[event.category] || 0) + 1;
    });

    return counts;
  },
});


