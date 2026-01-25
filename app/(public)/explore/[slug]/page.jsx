"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { parseLocationSlug } from "@/lib/location-utils";
import { Loader2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useConvexQuery } from "@/hooks/use-convex-query";
import { api } from "@/convex/_generated/api";
import EventCard from "@/components/event-card";
import { getCategoryById } from "@/lib/data";

export default function DynamicExplorePage() {
  const router = useRouter();
  const params = useParams();
  const { slug } = params;

  // State
  const [mode, setMode] = useState("loading"); // "loading", "category", "location", "error"
  const [location, setLocation] = useState({ city: null, state: null });
  const [category, setCategory] = useState(null);

  useEffect(() => {
    if (slug) {
      // 1. Check if it's a category
      const categoryData = getCategoryById(slug);
      if (categoryData) {
        setCategory(categoryData);
        setMode("category");
        return;
      }

      // 2. Try parsing as location
      const parsed = parseLocationSlug(slug);
      if (parsed.isValid) {
        setLocation({ city: parsed.city, state: parsed.state });
        setMode("location");
        return;
      }

      // 3. Invalid
      setMode("error");
    }
  }, [slug]);

  // Fetch events based on mode
  const { data: categoryEvents, isLoading: loadingCategory } = useConvexQuery(
    api.explore.getEventsByCategory,
    mode === "category" ? { category: slug, limit: 20 } : "skip"
  );

  const { data: locationEvents, isLoading: loadingLocation } = useConvexQuery(
    api.explore.getEventsByLocation,
    mode === "location"
      ? {
          city: location.city,
          state: location.state,
          limit: 20,
        }
      : "skip"
  );

  const isLoading = loadingCategory || loadingLocation || mode === "loading";
  const events = mode === "category" ? categoryEvents : locationEvents;

  if (mode === "error") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white p-4">
        <h1 className="text-2xl font-bold mb-4">Page Not Found</h1>
        <p className="text-gray-400 mb-8">
          We couldn't find a category or location matching "{slug}".
        </p>
        <Button onClick={() => router.push("/explore")}>Back to Explore</Button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-6 md:p-12 pt-24">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="space-y-4">
          <Button
            variant="ghost"
            onClick={() => router.push("/explore")}
            className="pl-0 hover:bg-transparent hover:text-purple-400 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Explore
          </Button>

          {mode === "category" && category && (
             <div className="space-y-2">
                <div className="flex items-center gap-4">
                    <span className="text-5xl md:text-6xl">{category.icon}</span>
                    <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-white">
                        {category.label}
                    </h1>
                </div>
                <p className="text-xl text-gray-400 max-w-2xl">
                    {category.description}
                </p>
             </div>
          )}

          {mode === "location" && (
            <>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                Events in <span className="text-purple-500">{location.city}</span>
              </h1>
              <p className="text-xl text-gray-400">
                Discover {events?.length || 0} upcoming events in {location.city}, {location.state}
              </p>
            </>
          )}
        </div>

        {/* Events Grid */}
        {events?.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {events.map((event) => (
              <EventCard
                key={event._id}
                event={event}
                onClick={() => router.push(`/events/${event.slug}`)}
                className="bg-white/5 border-white/10 hover:border-purple-500/50"
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white/5 rounded-3xl border border-white/10 border-dashed">
            <h2 className="text-2xl font-semibold mb-2">No events found</h2>
            <p className="text-gray-400 mb-6">
              {mode === "category" 
                ? `No upcoming ${category?.label} events found.` 
                : `There are no upcoming events in ${location.city} at the moment.`}
            </p>
            <Button
              onClick={() => router.push("/create-event")}
              className="bg-purple-600 hover:bg-purple-700"
            >
              Host an Event
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
