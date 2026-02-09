"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { notFound } from "next/navigation";
import Image from "next/image";
import { format } from "date-fns";
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Users,
  TrendingUp,
  Clock,
  Trash2,
  QrCode,
  Loader2,
  CheckCircle,
  Download,
  Search,
  Eye,
  Sparkles,
} from "lucide-react";
import { useConvexQuery, useConvexMutation } from "@/hooks/use-convex-query";
import { api } from "@/convex/_generated/api";
import { useConvexAuth } from "convex/react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { getCategoryIcon, getCategoryLabel } from "@/lib/data";
import QRScannerModal from "../_components/qr-scanner-modal";
// Duplicate import removed
import { AttendeeCard } from "../_components/attendee-card";
import UnsplashImagePicker from "@/components/unsplash-image-picker";

const EventDashboardPage = () => {
  const params = useParams();
  const router = useRouter();
  const eventId = params.eventId;
  const { isAuthenticated, isLoading: authLoading } = useConvexAuth();

  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
// Duplicate state removed
  const [showQRScanner, setShowQRScanner] = useState(false);
  const [showImagePicker, setShowImagePicker] = useState(false);
  
  // State for inline editing
  const [editingField, setEditingField] = useState(null); // 'date' | 'capacity' | null
  const [tempDate, setTempDate] = useState(null);
  const [tempCapacity, setTempCapacity] = useState(null);

  // Fetch event dashboard data
  const { data: dashboardData, isLoading, error: dashboardError } = useConvexQuery(
    api.dashboard.getEventDashboard,
    isAuthenticated ? { eventId } : "skip"
  );

  // Fetch registrations
  const { data: registrations, isLoading: loadingRegistrations } =
    useConvexQuery(
      api.registrations.getEventRegistrations,
      isAuthenticated ? { eventId } : "skip"
    );

  // Delete event mutation
  const { mutate: deleteEvent, isLoading: isDeleting } = useConvexMutation(
    api.dashboard.deleteEvent
  );

  const handleDelete = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this event? This action cannot be undone and will permanently delete the event and all associated registrations."
    );

    if (!confirmed) return;

    try {
      await deleteEvent({ eventId });
      toast.success("Event deleted successfully");
      router.push("/my-events");
    } catch (error) {
      toast.error(error.message || "Failed to delete event");
    }
  };

  // Update event mutation
  const { mutate: updateEvent, isLoading: isUpdating } = useConvexMutation(
    api.events.updateEvent
  );

  const handleCoverUpdate = async (imageUrl) => {
    try {
      await updateEvent({ eventId, coverImage: imageUrl });
      toast.success("Cover image updated successfully");
      setShowImagePicker(false);
    } catch (error) {
       toast.error(error.message || "Failed to update cover image");
    }
  };

  const handleDateUpdate = async (newDate) => {
    try {
      await updateEvent({ eventId, startDate: new Date(newDate).getTime() });
      toast.success("Event date updated successfully");
      setEditingField(null);
    } catch (error) {
      toast.error(error.message || "Failed to update date");
    }
  };

  const handleCapacityUpdate = async (newCapacity) => {
    const capacity = parseInt(newCapacity);
    if (isNaN(capacity) || capacity < 1) {
      toast.error("Capacity must be a positive number");
      return;
    }
    
    if (capacity < stats.totalRegistrations) {
      toast.error(`Capacity must be at least ${stats.totalRegistrations} (current registrations)`);
      return;
    }
    
    try {
      await updateEvent({ eventId, capacity });
      toast.success("Capacity updated successfully");
      setEditingField(null);
    } catch (error) {
      toast.error(error.message || "Failed to update capacity");
    }
  };

  const handleExportCSV = () => {
    if (!registrations || registrations.length === 0) {
      toast.error("No registrations to export");
      return;
    }

    const csvContent = [
      [
        "Name",
        "Email",
        "Registered At",
        "Checked In",
        "Checked In At",
        "QR Code",
      ],
      ...registrations.map((reg) => [
        reg.attendeeName,
        reg.attendeeEmail,
        new Date(reg.registeredAt).toLocaleString(),
        reg.checkedIn ? "Yes" : "No",
        reg.checkedInAt ? new Date(reg.checkedInAt).toLocaleString() : "-",
        reg.qrCode,
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${dashboardData?.event.title || "event"}_registrations.csv`;
    a.click();
    toast.success("CSV exported successfully");
  };

  if (isLoading || loadingRegistrations || authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <h1 className="text-2xl font-bold mb-4">Authorization Required</h1>
        <p className="text-muted-foreground mb-4">Please log in to view this event dashboard.</p>
        <Button onClick={() => router.push("/")}>Go Home</Button>
      </div>
    );
  }





  if (!dashboardData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
      </div>
    );
  }

  const { event, stats } = dashboardData;
  console.log("DEBUG EVENT:", { id: event._id, title: event.title, startDate: event.startDate, coverImage: event.coverImage });
  const coverImage = event.coverImage;

  // Filter registrations based on active tab and search
  const filteredRegistrations = registrations?.filter((reg) => {
    const matchesSearch =
      reg.attendeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      reg.attendeeEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      reg.qrCode.toLowerCase().includes(searchQuery.toLowerCase());

    if (activeTab === "all") return matchesSearch && reg.status === "confirmed";
    if (activeTab === "checked-in")
      return matchesSearch && reg.checkedIn && reg.status === "confirmed";
    if (activeTab === "pending")
      return matchesSearch && !reg.checkedIn && reg.status === "confirmed";

    return matchesSearch;
  });

  return (
    <div className="min-h-screen pb-20 px-4 pt-24">
      <div className="max-w-7xl mx-auto">
        {/* Navigation */}
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => router.push("/my-events")}
            className="gap-2 -ml-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to My Events
          </Button>
        </div>


        {/* Event Header */}
        <div className="flex flex-col md:flex-row items-start justify-between gap-4 mb-6">
          <div className="flex-1">
            <h1 className="text-3xl md:text-4xl font-bold mb-3 text-white">{event.title}</h1>
            <div className="flex flex-wrap items-center gap-4 text-sm text-white/60">
              <Badge variant="outline" className="border-white/20 text-white/80">
                {getCategoryIcon(event.category)} <span className="ml-2">{getCategoryLabel(event.category)}</span>
              </Badge>
              <div 
                className="flex items-center gap-2 px-2 py-1 bg-white/5 rounded-full cursor-pointer hover:bg-white/10 transition-colors"
                onClick={() => {
                  if (editingField !== 'date') {
                    setEditingField('date');
                    setTempDate(format(event.startDate, "yyyy-MM-dd'T'HH:mm"));
                  }
                }}
              >
                <Calendar className="w-4 h-4 text-white/60" />
                {editingField === 'date' ? (
                  <Input
                    type="datetime-local"
                    value={tempDate}
                    onChange={(e) => setTempDate(e.target.value)}
                    onBlur={() => {
                      if (tempDate) {
                        handleDateUpdate(tempDate);
                      } else {
                        setEditingField(null);
                      }
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && tempDate) {
                        handleDateUpdate(tempDate);
                      }
                      if (e.key === 'Escape') {
                        setEditingField(null);
                      }
                    }}
                    onClick={(e) => e.stopPropagation()}
                    className="h-6 bg-white/10 border-white/20 text-white text-sm px-2"
                    autoFocus
                  />
                ) : (
                  <span>{format(event.startDate, "PPP")}</span>
                )}
              </div>
              <div className="flex items-center gap-2 px-2 py-1 bg-white/5 rounded-full">
                <MapPin className="w-4 h-4 text-white/60" />
                <span>
                  {event.locationType === "online"
                    ? "Online"
                    : `${event.city}, ${event.state || event.country}`}
                </span>
              </div>
            </div>
          </div>

          <div className="flex gap-2 w-full md:w-auto shrink-0">
            <Button
              variant="outline"
              onClick={() => router.push(`/events/${event.slug}`)}
              className="gap-2 flex-1 md:flex-initial h-10 border-white/20 bg-white/5 hover:bg-white/10 text-white"
            >
              <Eye className="w-4 h-4" />
              View
            </Button>
            <Button
              variant="outline"
              onClick={handleDelete}
              disabled={isDeleting}
              className="text-red-400 border-red-500/30 bg-red-500/10 hover:bg-red-500/20 hover:text-red-300 hover:border-red-500/50 gap-2 flex-1 md:flex-initial h-10"
            >
              <Trash2 className="w-4 h-4" />
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
          </div>
        </div>

        {/* Hero image */}
        <div className="relative w-full max-w-3xl mx-auto aspect-video bg-zinc-900 rounded-2xl overflow-hidden mb-8 shadow-xl ring-1 ring-white/10 group cursor-pointer">
          {console.log("Rendering Cover Image:", coverImage)}
          {coverImage ? (
            <>
              <img
                src={coverImage}
                alt="Cover"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                <span
                  className={`opacity-0 group-hover:opacity-100 text-white font-medium px-4 py-2 rounded-full backdrop-blur-sm transition-opacity ${!event.themeColor ? "bg-black/40" : ""}`}
                  style={event.themeColor ? { backgroundColor: event.themeColor } : {}}
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowImagePicker(true);
                  }}
                >
                  Change Cover
                </span>
              </div>
            </>
          ) : (
            <div 
              className="w-full h-full flex flex-col items-center justify-center gap-3 text-muted-foreground bg-muted/20 group-hover:bg-muted/30 transition-colors"
              onClick={() => setShowImagePicker(true)}
            >
              <div className="p-4 rounded-full bg-background shadow-sm">
                <Sparkles className="w-6 h-6" />
              </div>
              <span className="font-medium">Add Cover Image</span>
            </div>
          )}
        </div>

        {/* Image Picker */}
         {showImagePicker && (
          <UnsplashImagePicker
            isOpen={showImagePicker}
            onClose={() => setShowImagePicker(false)}
            onSelect={handleCoverUpdate}
            initialQuery={event.title}
          />
        )}
        




        {/* Quick Actions - Scan QR Code */}
        <div className="mb-8">
          <Button
            size="lg"
            className={`w-full gap-2 h-12 text-white shadow-lg hover:shadow-xl hover:scale-[1.01] transition-all font-semibold ${!event.themeColor ? "bg-linear-to-r from-orange-500 via-pink-500 to-red-500" : ""}`}
            style={event.themeColor ? { backgroundColor: event.themeColor } : {}}
            onClick={() => setShowQRScanner(true)}
          >
            <QrCode className="w-5 h-5" />
            Scan QR Code to Check-In
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card 
            className="bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-colors cursor-pointer"
            onClick={() => {
              if (editingField !== 'capacity') {
                setEditingField('capacity');
                setTempCapacity(stats.capacity);
              }
            }}
          >
            <CardContent className="p-6 flex items-center gap-3">
              <div className="p-3 bg-purple-500/20 rounded-xl ring-1 ring-purple-500/30">
                <Users className="w-6 h-6 text-purple-400" />
              </div>
              <div className="flex-1">
                {editingField === 'capacity' ? (
                  <Input
                    type="number"
                    value={tempCapacity}
                    onChange={(e) => setTempCapacity(e.target.value)}
                    onBlur={() => {
                      if (tempCapacity !== stats.capacity) {
                        handleCapacityUpdate(tempCapacity);
                      } else {
                        setEditingField(null);
                      }
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleCapacityUpdate(tempCapacity);
                      }
                      if (e.key === 'Escape') {
                        setEditingField(null);
                      }
                    }}
                    onClick={(e) => e.stopPropagation()}
                    className="w-24 h-8 bg-white/10 border-white/20 text-white"
                    autoFocus
                  />
                ) : (
                  <>
                    <p className="text-2xl font-bold text-white">
                      {stats.totalRegistrations}/{stats.capacity}
                    </p>
                    <p className="text-sm text-white/60">Capacity (click to edit)</p>
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-colors">
            <CardContent className="p-6 flex items-center gap-3">
              <div className="p-3 bg-green-500/20 rounded-xl ring-1 ring-green-500/30">
                <CheckCircle className="w-6 h-6 text-green-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{stats.checkedInCount}</p>
                <p className="text-sm text-white/60">Checked In</p>
              </div>
            </CardContent>
          </Card>

          {event.ticketType === "paid" ? (
            <Card className="bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-colors">
              <CardContent className="p-6 flex items-center gap-3">
                <div className="p-3 bg-blue-500/20 rounded-xl ring-1 ring-blue-500/30">
                  <TrendingUp className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">₹{stats.totalRevenue}</p>
                  <p className="text-sm text-white/60">Revenue</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-colors">
              <CardContent className="p-6 flex items-center gap-3">
                <div className="p-3 bg-orange-500/20 rounded-xl ring-1 ring-orange-500/30">
                  <TrendingUp className="w-6 h-6 text-orange-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{stats.checkInRate}%</p>
                  <p className="text-sm text-white/60">Check-in Rate</p>
                </div>
              </CardContent>
            </Card>
          )}

          <Card 
            className="bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-colors cursor-pointer"
            onClick={() => {
              if (editingField !== 'date') {
                setEditingField('date');
                setTempDate(format(event.startDate, "yyyy-MM-dd'T'HH:mm"));
              }
            }}
          >
            <CardContent className="p-6 flex items-center gap-3">
              <div className="p-3 bg-amber-500/20 rounded-xl ring-1 ring-amber-500/30">
                <Clock className="w-6 h-6 text-amber-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">
                  {stats.isEventPast
                    ? "Ended"
                    : stats.hoursUntilEvent > 24
                      ? `${Math.floor(stats.hoursUntilEvent / 24)}d`
                      : `${stats.hoursUntilEvent}h`}
                </p>
                <p className="text-sm text-white/60">
                  {stats.isEventPast ? "Event Over" : "Time Left (click to edit date)"}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Attendee Management */}
        <h2 className="text-2xl font-bold mb-4">Attendee Management</h2>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="all">
              All ({stats.totalRegistrations})
            </TabsTrigger>
            <TabsTrigger value="checked-in">
              Checked In ({stats.checkedInCount})
            </TabsTrigger>
            <TabsTrigger value="pending">
              Pending ({stats.pendingCount})
            </TabsTrigger>
          </TabsList>

          {/* Search and Actions */}
          <div className="flex gap-3 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, email, or QR code..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button
              variant="outline"
              onClick={handleExportCSV}
              className="gap-2"
            >
              <Download className="w-4 h-4" />
              Export CSV
            </Button>
          </div>

          {/* Attendee List */}
          <TabsContent value={activeTab} className="space-y-3 mt-0">
            {filteredRegistrations && filteredRegistrations.length > 0 ? (
              filteredRegistrations.map((registration) => (
                <AttendeeCard
                  key={registration._id}
                  registration={registration}
                />
              ))
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                No attendees found
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* QR Scanner Modal */}
      {showQRScanner && (
        <QRScannerModal
          isOpen={showQRScanner}
          onClose={() => setShowQRScanner(false)}
        />
      )}
    </div>
  );
};

export default EventDashboardPage;