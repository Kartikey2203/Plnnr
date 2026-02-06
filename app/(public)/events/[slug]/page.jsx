/* eslint-disable react-hooks/purity */
"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { format } from "date-fns";
import {
  Calendar,
  MapPin,
  Users,
  Clock,
  Share2,
  Ticket,
  ExternalLink,
  Loader2,
  CheckCircle,
} from "lucide-react";
import { useConvexQuery } from "@/hooks/use-convex-query";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";
import { useUser } from "@clerk/nextjs";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getCategoryIcon, getCategoryLabel } from "@/lib/data";
import { darkenColor } from "@/lib/utils";
import RegisterModal from "./_components/register-modal";

const EventPage = () => {
    // Get the slug from the URL parameters
    const params = useParams();
    
    // Get the current user authentication state from Clerk
    const { user } = useUser();
    
    const router = useRouter();

    // State to control the visibility of the registration modal
    const [showRegisterModal, setShowRegisterModal] = useState(false);
    
    // Fetch event details using the slug
    const { data: event, isLoading: isEventLoading } = useConvexQuery(
        api.events.getEventBySlug, 
        { slug: params.slug }
    );

    // Get current user from Convex to check if organizer
    const { data: currentUser } = useConvexQuery(api.users.getCurrentUser);

    // Check if the current user is already registered for this event
    // This query is skipped if the event details haven't loaded yet
    const { data: registration, isLoading: isRegistrationLoading } = useConvexQuery(
        api.registrations.checkRegistration,
        event?._id ? { eventId: event._id } : "skip" // Skip if event ID is not available
    );

    // Determine overall loading state
    const isLoading = isEventLoading || (event && isRegistrationLoading);

    // Show a loading spinner while data is being fetched
    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-black">
                <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
            </div>
        );
    }

    // Handle case where event is not found
    if (!event) {
         return (
             <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white">
                 <h1 className="text-2xl font-bold mb-4">Event not found</h1>
                 <p className="text-gray-400">The event you are looking for does not exist.</p>
             </div>
         );
    }

    // Logic definitions
    const isEventPast = new Date(event.startDate) < new Date();
    const isEventFull = event.registrationCount >= event.capacity;
    const isOrganizer = currentUser?._id === event.organizerId;

    const handleRegister = () => {
        if (!user) {
            // Redirect to sign-in or show generic auth modal (fallback to sign-in page for now)
            // You might want to use the Clerk openSignIn() if available, but router push is safe
            router.push("/sign-in?redirect_url=" + window.location.href);
            return;
        }
        setShowRegisterModal(true);
    };

    const handleShare = async () => {
        try {
            await navigator.clipboard.writeText(window.location.href);
            toast.success("Link copied to clipboard!");
        } catch (err) {
            console.error("Failed to copy: ", err);
            toast.error("Failed to copy link");
        }
    };

    // Render the event details
    return (
        <div 
  className="min-h-screen pt-24 md:pt-28 px-4 py-8 md:px-0"

            style={{
                background: `
                    radial-gradient(circle at 20% 30%, ${event.themeColor || "#4c1d95"}40 0%, transparent 50%),
                    radial-gradient(circle at 80% 20%, ${event.themeColor || "#4c1d95"}30 0%, transparent 50%),
                    radial-gradient(circle at 40% 80%, ${event.themeColor || "#4c1d95"}25 0%, transparent 50%),
                    radial-gradient(circle at 90% 70%, ${event.themeColor || "#4c1d95"}20 0%, transparent 50%),
                    #000000
                `,
                color: "white"
            }}
        >
           <div className="max-w-7xl mx-auto px-4 md:px-8">
               <div className="mb-8">
                   <Badge variant="secondary" className="mb-3 pointer-events-none bg-white/10 hover:bg-white/20 text-white border-0 px-3 py-1 text-sm">
                       <span className="mr-2">{getCategoryIcon(event.category)}</span> {getCategoryLabel(event.category)}
                   </Badge>

                   <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white leading-tight">{event.title}</h1>

                   <div className="flex flex-wrap items-center gap-4 text-white/80">
                       <div className="flex items-center gap-2">
                           <Calendar className="w-5 h-5" />
                           <span>{format(event.startDate, "EEEE, MMMM dd, yyyy")}</span>
                       </div>
                   </div>
               </div>
               {/* Hero image */}
               {event.coverImage && (
                <div className="relative w-full h-[50px] md:h-[100px] rounded-2xl overflow-hidden mb-6 shadow-xl border border-white/10">
                    <img 
                        src={event.coverImage}
                        alt={event.title}
                        className="w-full h-full object-cover center"
                    />
                </div>
               )}


               <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main content */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Description */}
                    <div 
                        className="bg-black/20 rounded-xl p-6 md:p-8 backdrop-blur-sm border border-white/10"
                    >
                      <h1 className="text-2xl font-bold mb-4 text-white">About This Event</h1>
                        <div className="text-lg text-white/90 leading-relaxed font-medium space-y-2">
                            {event.description.split('\n').map((line, i) => (
                                line.trim().startsWith('-') ? (
                                    <div key={i} className="flex gap-2 pl-4">
                                        <span className="text-white/60">•</span>
                                        <span>{line.trim().substring(1).trim()}</span>
                                    </div>
                                ) : (
                                    <p key={i} className="min-h-[1.5rem]">{line}</p>
                                )
                            ))}
                        </div>
                    </div>

                    {/* Location Details */}
                    <div className="bg-black/20 rounded-xl p-6 md:p-8 backdrop-blur-sm border border-white/10">
                        <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-white">
                            <MapPin className="w-5 h-5" />
                            Location
                        </h2>
                        <div className="space-y-4">
                            <div>
                                <p className="font-semibold text-lg text-white">
                                    {event.city}, {event.state || event.country}
                                </p>
                                {event.address && (
                                    <p className="text-white/70">
                                    {event.address}
                                    </p>
                                )}
                            </div>
                            
                            {event.venue && (
                                <Button 
                                    variant="outline" 
                                    asChild 
                                    className="gap-2 border-white/20 bg-transparent text-white hover:bg-white/10 hover:text-white"
                                >
                                <a
                                    href={event.venue}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    View on Map
                                    <ExternalLink className="w-4 h-4" />
                                </a>
                                </Button>
                            )}
                        </div>
                    </div>
                
                    {/* Organizer info */}
                    <div className="bg-black/20 rounded-xl p-6 md:p-8 backdrop-blur-sm border border-white/10 mb-8">
                        <h2 className="text-xl font-bold mb-4 text-white">Organizer</h2>
                        <div className="flex items-center gap-4">
                            <Avatar className="w-12 h-12 border-2 border-white/20">
                                <AvatarImage src="" />
                                <AvatarFallback className="bg-purple-600 text-white">
                                {event.organizerName.charAt(0).toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                            <div>
                                <p className="font-semibold text-lg text-white">{event.organizerName}</p>
                                <p className="text-sm text-white/60">
                                Event Organizer
                                </p>
                            </div>
                        </div>
                    </div>
                </div>


    {/* Sidebar - Registration Card */}
          <div className="lg:sticky lg:top-24 h-fit">
            <div
              className="bg-black/20 rounded-xl p-6 md:p-8 backdrop-blur-sm space-y-6 border border-white/10"
            >
                {/* Price */}
                <div>
                  <p className="text-sm text-white/60 mb-1">Price</p>
                  <p className="text-4xl font-bold text-white">
                    {event.ticketType === "free"
                      ? "Free"
                      : `₹${event.ticketPrice}`}
                  </p>
                  {event.ticketType === "paid" && (
                    <p className="text-sm text-white/50 mt-1">
                      Pay at event offline
                    </p>
                  )}
                </div>

                <Separator className="bg-white/10" />

                {/* Stats */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-white/90">
                    <div className="flex items-center gap-3 text-white/60">
                      <Users className="w-5 h-5" />
                      <span className="text-base">Attendees</span>
                    </div>
                    <p className="font-medium text-base">
                      {event.registrationCount} / {event.capacity}
                    </p>
                  </div>

                  <div className="flex items-center justify-between text-white/90">
                    <div className="flex items-center gap-3 text-white/60">
                      <Calendar className="w-5 h-5" />
                      <span className="text-base">Date</span>
                    </div>
                    <p className="font-medium text-base">
                      {format(event.startDate, "MMM dd")}
                    </p>
                  </div>

                  <div className="flex items-center justify-between text-white/90">
                    <div className="flex items-center gap-3 text-white/60">
                      <Clock className="w-5 h-5" />
                      <span className="text-base">Time</span>
                    </div>
                    <p className="font-medium text-base">
                      {format(event.startDate, "h:mm a")}
                    </p>
                  </div>
                </div>

                <div className="space-y-3 pt-4">
                {/* Registration Button */}
                {registration ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-green-400 bg-green-400/10 p-3 rounded-lg border border-green-400/20">
                      <CheckCircle className="w-5 h-5" />
                      <span className="font-medium">
                        You&apos;re registered!
                      </span>
                    </div>
                    <Button
                      className="w-full gap-2 font-semibold h-12 text-base"
                      style={{
                        backgroundColor: event.themeColor || "#4c1d95",
                        color: "white"
                      }}
                      onClick={() => router.push("/my-tickets")}
                    >
                      <Ticket className="w-5 h-5" />
                      View Ticket
                    </Button>
                  </div>
                ) : isEventPast ? (
                  <Button className="w-full h-12 text-base" disabled variant="secondary">
                    Event Ended
                  </Button>
                ) : isEventFull ? (
                  <Button className="w-full h-12 text-base" disabled variant="secondary">
                    Event Full
                  </Button>
                ) : isOrganizer ? (
                  <Button
                    className="w-full gap-2 font-semibold h-12 text-base"
                    style={{
                      backgroundColor: event.themeColor || "#4c1d95",
                      color: "white"
                    }}
                    onClick={() => router.push(`/events/${event.slug}/manage`)}
                  >
                    Manage Event
                  </Button>
                ) : (
                  <Button 
                    className="w-full gap-2 font-semibold h-12 text-base shadow-lg hover:shadow-xl transition-all" 
                    style={{
                      backgroundColor: event.themeColor || "#4c1d95",
                      color: "white"
                    }}
                    onClick={handleRegister}
                  >
                    <Ticket className="w-5 h-5" />
                    Register for Event
                  </Button>
                )}

                {/* Share Button */}
                <Button
                  variant="outline"
                  className="w-full gap-2 border-white/20 bg-transparent text-white hover:bg-white/10 hover:text-white h-12 text-base"
                  onClick={handleShare}
                >
                  <Share2 className="w-5 h-5" />
                  Share Event
                </Button>
                </div>
            </div>
          </div>
        </div>
      </div>

      {/* Register Modal */}
      
      {showRegisterModal && (
        <RegisterModal
          event={event}
          isOpen={showRegisterModal}
          onClose={() => setShowRegisterModal(false)}
        />
      )}
    </div>
  );
}

export default EventPage;
