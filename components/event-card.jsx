"use client";

import { Calendar, MapPin, Users, Trash2, X, QrCode, Eye } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { getCategoryIcon, getCategoryLabel } from "@/lib/data";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function EventCard({
  event,
  onClick,
  onDelete,
  variant = "grid", // "grid" or "list"
  action = null, // "event" | "ticket" | null
  className = "",
}) {
  // List variant (compact horizontal layout)
  if (variant === "list") {
    return (
      <Card
      className={cn(
        "group relative overflow-hidden bg-zinc-950 border-zinc-800 transition-all duration-500 hover:shadow-[0_0_20px_rgba(168,85,247,0.15)] hover:-translate-y-2 hover:border-purple-500/50",
        variant === "compact" && "h-full flex flex-col",
        className
      )}
      onClick={onClick}
    >
        <CardContent className="p-3 flex gap-3">
          {/* Event Image */}
          <div className="w-20 h-20 rounded-lg shrink-0 overflow-hidden relative">
            {event.coverImage ? (
              <Image
                src={event.coverImage}
                alt={event.title}
                fill
                className="object-cover"
              />
            ) : (
              <div
                className="absolute inset-0 flex items-center justify-center text-3xl"
                style={{ backgroundColor: event.themeColor }}
              >
                {getCategoryIcon(event.category)}
              </div>
            )}
          </div>

          {/* Event Details */}
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-sm mb-1 group-hover:text-purple-400 transition-colors line-clamp-2">
              {event.title}
            </h3>
            <p className="text-xs text-muted-foreground mb-1">
              {format(event.startDate, "EEE, dd MMM, HH:mm")}
            </p>
            <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
              <MapPin className="w-3 h-3" />
              <span className="line-clamp-1">
                {event.locationType === "online" ? "Online Event" : event.city}
              </span>
            </div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Users className="w-3 h-3" />
              <span>{event.registrationCount} attending</span>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Compact variant (Portrait full-image card for Explore)
  if (variant === "compact") {
    return (
      <Card
        className={cn(
          "group relative overflow-hidden h-96 border-zinc-800 bg-zinc-950 transition-all duration-500 hover:shadow-[0_0_20px_rgba(168,85,247,0.15)] hover:-translate-y-2 hover:border-purple-500/50",
          className
        )}
        onClick={onClick}
      >
        {/* Full Background Image */}
        <div className="absolute inset-0 z-0">
          {event.coverImage ? (
            <Image
              src={event.coverImage}
              alt={event.title}
              fill
              className="object-cover transition-transform duration-700 ease-in-out group-hover:scale-110"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div
              className="w-full h-full flex items-center justify-center text-4xl"
              style={{ backgroundColor: event.themeColor }}
            >
              {getCategoryIcon(event.category)}
            </div>
          )}
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
        </div>

        {/* Content Overlay */}
        <CardContent className="relative z-10 h-full flex flex-col justify-end p-5 text-white">
           <div className="space-y-3 transform transition-transform duration-500 group-hover:-translate-y-1">
              <Badge
                 variant="secondary"
                 className="w-fit bg-purple-500/20 text-purple-300 border-purple-500/30 backdrop-blur-md rounded-full px-3 py-1 text-xs font-semibold mb-2"
               >
                 {getCategoryIcon(event.category)}
                 <span className="ml-1.5">{getCategoryLabel(event.category)}</span>
               </Badge>

              <h3 className="font-bold text-2xl leading-tight text-white line-clamp-2 drop-shadow-md">
                {event.title}
              </h3>
              
              <div className="flex items-center gap-3 text-gray-200 text-sm font-medium">
                <div className="flex items-center gap-1.5">
                   <Calendar className="w-4 h-4 text-purple-400" />
                   <span>{format(event.startDate, "MMM d, yyyy")}</span>
                </div>
                 {event.ticketType === "free" && (
                    <Badge variant="outline" className="border-green-500/50 text-green-400 text-[10px] px-2 py-0.5 h-5">
                      Free
                    </Badge>
                 )}
              </div>
            </div>
            
            {/* Hover Action Hint (Optional) */}
             <div className="h-0 overflow-hidden group-hover:h-8 transition-all duration-500 ease-in-out opacity-0 group-hover:opacity-100 flex items-center mt-0 group-hover:mt-4">
               <span className="text-sm font-semibold text-purple-300 flex items-center gap-2">
                 View Details <Eye className="w-4 h-4" />
               </span>
             </div>
        </CardContent>
      </Card>
    );
  }
  return (
    <Card
      className={`overflow-hidden group border border-white/10 bg-white/5 hover:border-purple-500/50 hover:shadow-[0_0_30px_rgba(168,85,247,0.15)] transition-all duration-300 ${className}`}
      onClick={onClick}
    >
      <div className="relative h-80 overflow-hidden">
        {event.coverImage ? (
          <Image
            src={event.coverImage}
            alt={event.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out"
            width={500}
            height={192}
            priority
          />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center text-4xl"
            style={{ backgroundColor: event.themeColor }}
          >
            {getCategoryIcon(event.category)}
          </div>
        )}
        <div className="absolute top-3 right-3">
          <Badge className="bg-black/60 backdrop-blur-md border border-white/10 text-white hover:bg-black/70">
            {event.ticketType === "free" ? "Free" : "Paid"}
          </Badge>
        </div>
      </div>

      {/* Default Grid Content */}
      <CardContent className="p-5 space-y-4">
        <div>
          <Badge variant="secondary" className="mb-3 bg-purple-500/10 text-purple-400 border-purple-500/20 hover:bg-purple-500/20">
            {getCategoryIcon(event.category)} {getCategoryLabel(event.category)}
          </Badge>
          <h3 className="font-semibold text-xl line-clamp-2 group-hover:text-purple-400 transition-colors text-white">
            {event.title}
          </h3>
        </div>

        <div className="space-y-2 text-sm text-gray-400">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gray-500" />
            <span>{format(event.startDate, "PPP")}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-gray-500" />
            <span className="line-clamp-1">
              {event.locationType === "online"
                ? "Online Event"
                : `${event.city}, ${event.state || event.country}`}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-gray-500" />
            <span>
              {event.registrationCount} / {event.capacity} registered
            </span>
          </div>
        </div>

        {action && (
          <div className="flex gap-3 pt-2">
            {/* Primary button */}
            <Button
              className="flex-1 bg-white/5 border border-white/10 hover:bg-white/10 text-white hover:border-purple-500/50"
              onClick={(e) => {
                e.stopPropagation();
                onClick?.(e);
              }}
            >
              {action === "event" ? (
                <>
                  View
                </>
              ) : (
                <>
                  <QrCode className="w-4 h-4 mr-2" />
                  Show Ticket
                </>
              )}
            </Button>

            {/* Secondary button - delete / cancel */}
            {onDelete && (
              <Button
                variant="outline"
                size="icon"
                className="bg-transparent border-red-500/30 text-red-500 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/50 aspect-square"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(event._id);
                }}
              >
                {action === "event" ? (
                  <Trash2 className="w-4 h-4" />
                ) : (
                  <X className="w-4 h-4" />
                )}
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}