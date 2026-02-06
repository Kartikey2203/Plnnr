import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const create = mutation({
  args: {
    eventId: v.id("events"),
    attendeeName: v.string(),
    attendeeEmail: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Authentication required");
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) =>
        q.eq("tokenIdentifier", identity.tokenIdentifier)
      )
      .unique();

    if (!user) {
      throw new Error("User not found");
    }

    const event = await ctx.db.get(args.eventId);

    if (!event) {
      throw new Error("Event not found");
    }

    // Check capacity
    if (event.registrationCount >= event.capacity) {
      throw new Error("Event is full");
    }

    // Check if already registered
    const existingRegistration = await ctx.db
      .query("registrations")
      .withIndex("by_event_user", (q) => 
        q.eq("eventId", args.eventId).eq("userId", user._id)
      )
      .unique();

    if (existingRegistration) {
      throw new Error("You are already registered for this event");
    }

    // Generate unique QR Code
    const generateQRCode = () => {
      return `EVT-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    };

    const qrCode = generateQRCode();

    const registrationId = await ctx.db.insert("registrations", {
      eventId: args.eventId,
      userId: user._id,
      attendeeName: args.attendeeName,
      attendeeEmail: args.attendeeEmail,
      qrCode,
      checkedIn: false,
      status: "confirmed",
      registeredAt: Date.now(),
    });

    // Update event registration count
    await ctx.db.patch(args.eventId, {
      registrationCount: event.registrationCount + 1,
    });

    return { registrationId, qrCode };
  },
});

export const getRegistrationByQRCode = query({
    args: {
        eventId: v.id("events"),
        qrCode: v.string(),
    },
    handler: async (ctx, args) => {
        const registration = await ctx.db
            .query("registrations")
            .withIndex("by_event_qrcode", (q) =>
                q.eq("eventId", args.eventId).eq("qrCode", args.qrCode)
            )
            .unique();

        if (!registration) {
            throw new Error("Registration not found");
        }

        return registration;
    },
});

export const checkRegistration = query({
    args: {
        eventId: v.id("events"),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();

        if (!identity) {
            return null;
        }

        const user = await ctx.db
            .query("users")
            .withIndex("by_token", (q) =>
                q.eq("tokenIdentifier", identity.tokenIdentifier)
            )
            .unique();

        if (!user) {
            return null;
        }

        const registration = await ctx.db
            .query("registrations")
            .withIndex("by_event_user", (q) =>
                q.eq("eventId", args.eventId).eq("userId", user._id)
            )
            .unique();

        return registration;
    },
});

export const getMyRegistrations = query({
    args: {},
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity();

        if (!identity) {
            return [];
        }

        const user = await ctx.db
            .query("users")
            .withIndex("by_token", (q) =>
                q.eq("tokenIdentifier", identity.tokenIdentifier)
            )
            .unique();

        if (!user) {
            return [];
        }

        const registrations = await ctx.db
            .query("registrations")
            .withIndex("by_user", (q) => q.eq("userId", user._id))
            .collect();

        // Fetch event details for each registration
        const registrationsWithEvents = await Promise.all(
            registrations.map(async (reg) => {
                const event = await ctx.db.get(reg.eventId);
                return { ...reg, event };
            })
        );

        return registrationsWithEvents;
    },
});


export const cancelRegistration = mutation({
    args: {
        registrationId: v.id("registrations"),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();

        if (!identity) {
            throw new Error("Authentication required");
        }

        const user = await ctx.db
            .query("users")
            .withIndex("by_token", (q) =>
                q.eq("tokenIdentifier", identity.tokenIdentifier)
            )
            .unique();

        if (!user) {
            throw new Error("User not found");
        }

        const registration = await ctx.db.get(args.registrationId);

        if (!registration) {
            throw new Error("Registration not found");
        }

        if (registration.userId !== user._id) {
            throw new Error("Unauthorized");
        }

        await ctx.db.patch(args.registrationId, {
            status: "cancelled",
        });

        // Decrement event registration count
        const event = await ctx.db.get(registration.eventId);
        if (event) {
            await ctx.db.patch(registration.eventId, {
                registrationCount: event.registrationCount - 1,
            });
        }

        return { success: true };
    },
});

