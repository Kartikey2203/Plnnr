"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import EventCard from "@/components/event-card";
import { Button } from "@/components/ui/button";
import { Plus, Calendar } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export default function MyEventsPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const events = useQuery(api.events.getUserEvents);
  const deleteEvent = useMutation(api.events.deleteEvent);

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-gray-400">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <h2 className="text-2xl font-bold mb-4 text-white">
          You need to be signed in
        </h2>
        <p className="text-gray-400 mb-6">
          Please sign in to view your events.
        </p>
      </div>
    );
  }

  const handleDelete = async (eventId) => {
    if (confirm("Are you sure you want to delete this event?")) {
      try {
        await deleteEvent({ eventId });
        toast.success("Event deleted successfully");
      } catch (error) {
        console.error("Failed to delete event:", error);
        toast.error("Failed to delete event");
      }
    }
  };

  const handleCardClick = (eventId) => {
    router.push(`/events/${eventId}`);
  };

  return (
    <div className="min-h-screen bg-black bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/20 via-black to-black">
      <div className="max-w-7xl mx-auto px-6 pt-32 pb-12">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">My Events</h1>
            <p className="text-gray-400 text-lg">Manage your created events</p>
          </div>
          <Button asChild className="bg-white text-black hover:bg-white/90 rounded-full px-6 transition-transform hover:scale-105">
            <Link href="/create-event">
              <Plus className="w-4 h-4 mr-2" />
              Create Event
            </Link>
          </Button>
        </div>

      {events === undefined ? (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center space-y-4">
             <div className="w-16 h-16 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mx-auto"/>
             <p className="text-gray-400">Loading your events...</p>
          </div>
        </div>
      ) : events.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[400px] py-20 bg-white/5 rounded-3xl border border-white/10 text-center backdrop-blur-sm">
           <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6">
              <Calendar className="w-10 h-10 text-gray-500" />
           </div>
          <h3 className="text-2xl font-bold text-white mb-2">No events found</h3>
          <p className="text-gray-400 mb-8 max-w-md mx-auto">
            You haven't created any events yet. Start building your community by hosting your first event.
          </p>
          <Button asChild size="lg" className="bg-purple-600 hover:bg-purple-700 text-white rounded-full px-8 h-12 text-base font-medium transition-all hover:scale-105 hover:shadow-[0_0_20px_rgba(168,85,247,0.4)]">
            <Link href="/create-event">
              <Plus className="w-5 h-5 mr-2" />
              Create Your First Event
            </Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.map((event) => (
            <EventCard
              key={event._id}
              event={event}
              action="event"
              onDelete={handleDelete}
              onClick={() => handleCardClick(event._id)}
            />
          ))}
        </div>
      )}
      </div>
    </div>
  );
}
