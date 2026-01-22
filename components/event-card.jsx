"use client";

import Image from "next/image";
import { Calendar, MapPin, Users } from "lucide-react";
import { format } from "date-fns";
import { Card, CardContent } from "@/components/ui/card";

export default function EventCard({
  event,
  variant = "compact",
  onClick,
}) {
  return (
    <Card
      className="cursor-pointer hover:shadow-lg transition-all"
      onClick={onClick}
    >
      <div className="relative h-40 overflow-hidden rounded-t-md">
        {event.coverImage ? (
          <Image
            src={event.coverImage}
            alt={event.title}
            fill
            sizes="(max-width: 768px) 100vw, 400px"
            className="object-cover"
          />
        ) : (
          <div
            className="absolute inset-0"
            style={{ backgroundColor: event.themeColor }}
          />
        )}
      </div>

      <CardContent className="p-4 space-y-2">
        <h3 className="font-semibold line-clamp-1">
          {event.title}
        </h3>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="w-4 h-4" />
          {format(event.startDate, "PPP")}
        </div>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="w-4 h-4" />
          {event.city}
        </div>

        {variant !== "compact" && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Users className="w-4 h-4" />
            {event.registrationCount} registered
          </div>
        )}
      </CardContent>
    </Card>
  );
}
