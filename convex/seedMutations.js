import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const getOrCreateOrganizer = mutation({
  handler: async (ctx) => {
    let organizer = await ctx.db.query("users").first();

    if (!organizer) {
      const id = await ctx.db.insert("users", {
        email: "organizer@eventhub.com",
        tokenIdentifier: "seed-user-token",
        name: "EventHub Team",
        hasCompletedOnboarding: true,
        location: {
          city: "Bangalore",
          state: "Karnataka",
          country: "India",
        },
        interests: ["tech", "music", "business"],
        freeEventsCreated: 0,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });

      organizer = await ctx.db.get(id);
    }

    return organizer;
  },
});

export const insertEvent = mutation({
  args: {
    event: v.any(),
  },
  handler: async (ctx, { event }) => {
    return await ctx.db.insert("events", event);
  },
});

export const clearAllEvents = mutation({
  handler: async (ctx) => {
    const events = await ctx.db.query("events").collect();

    for (const event of events) {
      await ctx.db.delete(event._id);
    }

    return events.length;
  },
});

export const deleteEventByTitle = mutation({
  args: {
    title: v.string(),
  },
  handler: async (ctx, { title }) => {
    const event = await ctx.db
      .query("events")
      .filter((q) => q.eq(q.field("title"), title))
      .first();

    if (!event) {
      return { success: false, message: "Event not found" };
    }

    // Delete associated registrations
    const registrations = await ctx.db
      .query("registrations")
      .filter((q) => q.eq(q.field("eventId"), event._id))
      .collect();

    for (const registration of registrations) {
      await ctx.db.delete(registration._id);
    }

    // Delete the event
    await ctx.db.delete(event._id);

    return { 
      success: true, 
      message: `Deleted event "${title}" and ${registrations.length} associated registrations` 
    };
  },
});
