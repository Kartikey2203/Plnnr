"use client";

import { useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Calendar,
  MapPin,
  Users,
  ArrowRight,
  Loader2,
} from "lucide-react";
import { format } from "date-fns";
import Image from "next/image";
import Autoplay from "embla-carousel-autoplay";

import { useConvexQuery } from "@/hooks/use-convex-query";
import { api } from "@/convex/_generated/api";
import { createLocationSlug } from "@/lib/location-utils";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

import { CATEGORIES } from "@/lib/data";
import EventCard from "@/components/event-card";

export default function ExplorePage() {
  const router = useRouter();
  const plugin = useRef(
    Autoplay({ delay: 2000, stopOnInteraction: true })
  );

  /* ================= DATA ================= */

  const { data: currentUser } = useConvexQuery(
    api.users.getCurrentUser
  );

  const { data: featuredEvents, isLoading: loadingFeatured } =
    useConvexQuery(api.explore.getFeaturedEvents, {
      limit: 3,
    });

  const { data: localEvents, isLoading: loadingLocal } =
    useConvexQuery(api.explore.getEventsByLocation, {
      city: currentUser?.location?.city || "Gurugram",
      state: currentUser?.location?.state || "Haryana",
      limit: 4,
    });

  const { data: popularEvents, isLoading: loadingPopular } =
    useConvexQuery(api.explore.getPopularEvents, {
      limit: 6,
    });

  const { data: categoryCounts } = useConvexQuery(
    api.explore.getCategoryCounts
  );

  const isLoading =
    loadingFeatured || loadingLocal || loadingPopular;

  /* ================= HANDLERS ================= */

  const handleEventClick = (slug) => {
    router.push(`/events/${slug}`);
  };

  const handleCategoryClick = (categoryId) => {
    router.push(`/explore/${categoryId}`);
  };

  const handleViewLocalEvents = () => {
    const city = currentUser?.location?.city || "Gurugram";
    const state = currentUser?.location?.state || "Haryana";
    router.push(`/explore/${createLocationSlug(city, state)}`);
  };

  const categoriesWithCounts = CATEGORIES.map((cat) => ({
    ...cat,
    count: categoryCounts?.[cat.id] || 0,
  }));

  /* ================= LOADING ================= */

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
      </div>
    );
  }

  return (
    <>
      {/* ================= HERO ================= */}
      <div className="pb-14 text-center">
        <h1 className="text-5xl md:text-6xl font-bold mb-4">
          Discover Events
        </h1>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          Explore featured events, find what&apos;s happening locally,
          or browse events across India
        </p>
      </div>

      {/* ================= FEATURED HERO ================= */}
      {featuredEvents?.length > 0 && (
        <section className="mb-20">
          <Carousel
            plugins={[plugin.current]}
            onMouseEnter={plugin.current.stop}
            onMouseLeave={plugin.current.reset}
            className="relative"
          >
            <CarouselContent>
              {featuredEvents.map((event) => (
                <CarouselItem key={event._id}>
                  <div
                    className="relative h-[520px] md:h-[600px] rounded-3xl overflow-hidden cursor-pointer group"
                    onClick={() =>
                      handleEventClick(event.slug)
                    }
                  >
                    {event.coverImage && (
                      <Image
                        src={event.coverImage}
                        alt={event.title}
                        fill
                        sizes="100vw"
                        className="object-cover scale-105 group-hover:scale-110 transition-transform duration-700"
                        priority
                      />
                    )}

                    <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />

                    <div className="relative z-10 h-full flex items-end">
                      <div className="p-8 md:p-16 max-w-3xl space-y-4">
                        <Badge
                          variant="secondary"
                          className="backdrop-blur bg-white/10 text-white border-white/20"
                        >
                          {event.city},{" "}
                          {event.state || event.country}
                        </Badge>

                        <h2 className="text-4xl md:text-6xl font-extrabold text-white leading-tight">
                          {event.title}
                        </h2>

                        <p className="text-white/90 text-lg line-clamp-2">
                          {event.description}
                        </p>

                        <div className="flex items-center gap-6 text-white/80 text-sm pt-2">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            {format(
                              event.startDate,
                              "PPP"
                            )}
                          </div>

                          <div className="flex items-center gap-2">
                            <Users className="w-4 h-4" />
                            {event.registrationCount} registered
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>

            <CarouselPrevious className="left-6 bg-black/40 hover:bg-black/70 border-none text-white" />
            <CarouselNext className="right-6 bg-black/40 hover:bg-black/70 border-none text-white" />
          </Carousel>
        </section>
      )}

      {/* ================= LOCAL EVENTS ================= */}
      {localEvents?.length > 0 && (
        <div className="mb-20">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-3xl font-bold mb-1">
                Events Near You
              </h2>
              <p className="text-muted-foreground">
                Happening in{" "}
                {currentUser?.location?.city || "your area"}
              </p>
            </div>

            <Button
              variant="outline"
              className="gap-2"
              onClick={handleViewLocalEvents}
            >
              View All <ArrowRight className="w-4 h-4" />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {localEvents.map((event) => (
              <EventCard
                key={event._id}
                event={event}
                variant="compact"
                onClick={() =>
                  handleEventClick(event.slug)
                }
              />
            ))}
          </div>
        </div>
      )}

      {/* ================= CATEGORIES ================= */}
      <div className="mb-20">
        <h2 className="text-3xl font-bold mb-6">
          Browse by Category
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categoriesWithCounts.map((category) => (
            <Card
              key={category.id}
              className="group cursor-pointer hover:shadow-lg transition-all hover:border-purple-500/50"
              onClick={() =>
                handleCategoryClick(category.id)
              }
            >
              <CardContent className="p-6 flex items-center gap-3">
                <div className="text-3xl">
                  {category.icon}
                </div>
                <div>
                  <h3 className="font-semibold group-hover:text-purple-400">
                    {category.label}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {category.count} Event
                    {category.count !== 1 && "s"}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* ================= POPULAR ================= */}
      {popularEvents?.length > 0 && (
        <div className="mb-20">
          <h2 className="text-3xl font-bold mb-6">
            Popular Across India
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {popularEvents.map((event) => (
              <EventCard
                key={event._id}
                event={event}
                variant="list"
                onClick={() =>
                  handleEventClick(event.slug)
                }
              />
            ))}
          </div>
        </div>
      )}
    </>
  );
}
