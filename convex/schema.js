import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // ======================
  // Users table
  // ======================
  users: defineTable({
    // Auth
    clerkId: v.optional(v.string()),
    tokenIdentifier: v.optional(v.string()),

    // Profile
    email: v.string(),
    name: v.string(),
    image: v.optional(v.string()),
    imageUrl: v.optional(v.string()),

    // Onboarding
    hasCompletedOnboarding: v.optional(v.boolean()),
    freeEventsCreated: v.optional(v.number()),

    // Preferences
    location: v.optional(
      v.object({
        city: v.string(),
        state: v.optional(v.string()),
        country: v.string(),
      })
    ),
    interests: v.optional(v.array(v.string())),

    // Timestamps
    createdAt: v.number(),
    updatedAt: v.optional(v.number()),
  }).index("by_token", ["tokenIdentifier"]),

  // ======================
  // Events table
  // ======================
  events: defineTable({
    // Basic info
    title: v.string(),
    description: v.string(),
    slug: v.string(),

    // Organizer
    organizerId: v.id("users"),
    organizerName: v.string(),

    // Classification
    category: v.string(),
    tags: v.array(v.string()),

    // Time
    startDate: v.number(),
    endDate: v.number(),
    timezone: v.string(),

    // Location
    locationType: v.union(
      v.literal("physical"),
      v.literal("online")
    ),
    venue: v.optional(v.string()),
    address: v.optional(v.string()),
    city: v.string(),
    state: v.optional(v.string()),
    country: v.string(),

    // Tickets
    capacity: v.number(),
    ticketType: v.union(
      v.literal("free"),
      v.literal("paid")
    ),
    ticketPrice: v.optional(v.number()),
    registrationCount: v.number(),

    // Media
    coverImage: v.optional(v.string()),
    themeColor: v.optional(v.string()),

    // Timestamps
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_organizer", ["organizerId"])
    .index("by_category", ["category"])
    .index("by_start_date", ["startDate"])
    .index("by_category_startDate", ["category", "startDate"])
    .index("by_slug", ["slug"])
    .searchIndex("search_title", {
      searchField: "title",
    }),

  // ======================
  // Registrations table
  // ======================
  registrations: defineTable({
    eventId: v.id("events"),
    userId: v.id("users"),

    attendeeName: v.string(),
    attendeeEmail: v.string(),

    qrCode: v.string(),

    checkedIn: v.boolean(),
    checkedInAt: v.optional(v.number()),

    status: v.union(
      v.literal("confirmed"),
      v.literal("cancelled")
    ),

    registeredAt: v.number(),
  })
    .index("by_event", ["eventId"])
    .index("by_user", ["userId"])
    .index("by_event_user", ["eventId", "userId"])
    .index("by_qr_code", ["qrCode"]),
});
