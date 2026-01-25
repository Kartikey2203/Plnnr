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
import Link from "next/link";
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
      limit: 10,
    });

  const { data: localEvents, isLoading: loadingLocal } =
    useConvexQuery(api.explore.getEventsByLocation, {
      city: currentUser?.location?.city || "Bangalore",
      state: currentUser?.location?.state || "Karnataka",
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
    const city = currentUser?.location?.city || "Bangalore";
    const state = currentUser?.location?.state || "Karnataka";
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
    <div className="min-h-screen bg-black text-white selection:bg-purple-500/30">
      
      {/* ================= HERO SECTION (Full Width) ================= */}
      {featuredEvents?.length > 0 ? (
        <section className="relative w-full overflow-hidden">
          <Carousel
            plugins={[plugin.current]}
            onMouseEnter={plugin.current.stop}
            onMouseLeave={plugin.current.reset}
            className="w-full"
            opts={{
              loop: true,
              align: "start",
            }}
          >
            <CarouselContent>
              {featuredEvents.map((event) => (
                <CarouselItem key={event._id} className="pl-0">
                  <div className="relative h-[90vh] w-full group">
                    {/* Background Image */}
                    {event.coverImage && (
                      <div className="absolute inset-0">
                        <Image
                          src={event.coverImage}
                          alt={event.title}
                          fill
                          priority
                          className="object-cover transition-transform duration-[2s] ease-in-out group-hover:scale-105"
                        />
                        {/* Cinematic Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/30 md:to-transparent" />
                        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/20 to-transparent" />
                      </div>
                    )}

                    {/* Content */}
                    <div className="relative h-full flex flex-col justify-center px-6 md:px-12 pt-24">
                      <div className="w-full max-w-7xl mx-auto">
                        <div className="max-w-4xl space-y-6 animate-in slide-in-from-bottom-10 fade-in duration-700">
                          
                          {/* Location Badge */}
                          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-white/20 backdrop-blur-md text-sm font-medium text-white/90 mb-2">
                            <MapPin className="w-4 h-4" />
                            {event.city}, {event.state || event.country}
                          </div>

                          {/* Title */}
                          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1] text-white drop-shadow-xl max-w-5xl">
                            {event.title}
                          </h1>

                          {/* Date & Description */}
                          <div className="flex flex-col items-start gap-4">
                             {/* Date Badge */}
                            <div className="inline-flex items-center gap-3 bg-[#32174d] text-purple-100 px-4 py-3 rounded-lg border-l-4 border-purple-500 shadow-lg backdrop-blur-md min-w-fit">
                              <Calendar className="w-5 h-5 text-purple-400" />
                              <div className="flex flex-col leading-none">
                                <span className="text-[10px] text-purple-300 uppercase font-semibold tracking-wider mb-1">Date</span>
                                <span className="text-base font-bold whitespace-nowrap">{format(event.startDate, "EEEE, MMMM do")}</span>
                              </div>
                            </div>
                            
                            <p className="line-clamp-2 max-w-2xl text-base md:text-lg text-gray-200/90 font-light">
                              {event.description}
                            </p>
                          </div>

                          {/* CTA Button */}
                          <div className="pt-2 pb-12">
                            <Button
                              size="lg"
                              className="h-12 px-8 rounded-full bg-white text-black hover:bg-gray-100 hover:scale-105 transition-all duration-300 text-base font-bold"
                              onClick={() => handleEventClick(event.slug)}
                            >
                              Get Tickets
                              <ArrowRight className="w-4 h-4 ml-2" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>

            {/* Navigation Buttons */}
            <div className="hidden md:block">
              <CarouselPrevious className="left-8 w-12 h-12 border-none bg-white/10 hover:bg-white/20 text-white backdrop-blur-md" />
              <CarouselNext className="right-8 w-12 h-12 border-none bg-white/10 hover:bg-white/20 text-white backdrop-blur-md" />
            </div>
          </Carousel>
        </section>
      ) : (
        <div className="h-[50vh] flex items-center justify-center bg-black">
          <Loader2 className="w-10 h-10 animate-spin text-purple-500" />
        </div>
      )}

      {/* ================= CONTENT CONTAINER ================= */}
      <div className="max-w-7xl mx-auto px-6 py-20 space-y-24">
        
      {/* ================= LOCAL EVENTS ================= */}
      <section className="space-y-8">
        <div className="flex items-end justify-between mb-8">
          <div className="flex flex-col gap-1">
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              Events Near You
            </h2>
            <p className="text-muted-foreground text-lg">
              Happening in{" "}
              <span className="text-white font-medium">{currentUser?.location?.city || "Bangalore"}</span>
            </p>
          </div>

          <Button
            asChild
            variant="outline"
            className="hidden sm:flex rounded-full border-white/10 bg-white/5 hover:bg-white/10 text-white gap-2 px-6"
          >
            <Link href="#" onClick={(e) => { e.preventDefault(); handleViewLocalEvents(); }}>
              View All <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </Button>
        </div>

        {localEvents?.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {localEvents.map((event) => (
              <EventCard
                key={event._id}
                event={event}
                variant="compact"
                onClick={() => handleEventClick(event.slug)}
                className="bg-white/5 border-white/10 hover:border-purple-500/50"
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white/5 rounded-2xl border border-white/10 border-dashed">
            <p className="text-gray-400">
              No upcoming events found in {currentUser?.location?.city || "Bangalore"}.
            </p>
            <Button variant="link" className="text-purple-400 mt-2" onClick={() => router.push("/create-event")}>
              Host an event here
            </Button>
          </div>
        )}

        <Button
            variant="outline"
            className="w-full sm:hidden mt-6"
            onClick={handleViewLocalEvents}
          >
            View All Events
        </Button>
      </section>

        {/* ================= CATEGORIES ================= */}
        <section>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-8">
            Explore Categories
          </h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {categoriesWithCounts.map((category) => (
              <div
                key={category.id}
                className="group relative overflow-hidden rounded-2xl bg-white/5 border border-white/10 p-6 hover:border-purple-500/50 transition-all duration-300 cursor-pointer hover:shadow-[0_0_30px_rgba(168,85,247,0.1)]"
                onClick={() => handleCategoryClick(category.id)}
              >
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity transform group-hover:scale-110 duration-500">
                  <div className="text-8xl grayscale group-hover:grayscale-0">{category.icon}</div>
                </div>
                
                <div className="relative z-10 h-full flex flex-col justify-end">
                  <div className="mb-4 text-4xl group-hover:scale-110 transition-transform duration-300 origin-left">
                    {category.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-200 group-hover:text-white mb-1">
                    {category.label}
                  </h3>
                  <p className="text-sm text-gray-500 group-hover:text-purple-300 transition-colors">
                    {category.count} events
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ================= POPULAR EVENTS ================= */}
        {popularEvents?.length > 0 && (
          <section className="space-y-8">
            <h2 className="text-3xl md:text-4xl font-bold mb-1">
              Popular Across India
            </h2>
            <p className="text-muted-foreground"> Trending events nationwide</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {popularEvents.map((event) => (
                <EventCard
                  key={event._id}
                  event={event}
                  variant="list"
                  onClick={() => handleEventClick(event.slug)}
                />
              ))}
            </div>
          </section>
        )}

        {/* ================= EMPTY STATE ================= */}
        {!loadingFeatured &&
          !loadingLocal &&
          !loadingPopular &&
          (!featuredEvents || featuredEvents.length === 0) &&
          (!localEvents || localEvents.length === 0) &&
          (!popularEvents || popularEvents.length === 0) && (
            <div className="flex justify-center pb-20">
              <Card className="p-12 text-center bg-white/5 border-white/10 max-w-md w-full backdrop-blur-sm">
                <div className="flex flex-col items-center space-y-4">
                  <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center text-3xl mb-2">
                    🎉
                  </div>
                  <h2 className="text-2xl font-bold text-white">No events yet</h2>
                  <p className="text-gray-400">
                    Be the first to create an event in your area!
                  </p>
                  <Button asChild className="gap-2 mt-4 bg-purple-600 hover:bg-purple-700 text-white rounded-full">
                    <Link href="/create-event">Create Event</Link>
                  </Button>
                </div>
              </Card>
            </div>
          )}
      </div>
    </div>
  );
}
