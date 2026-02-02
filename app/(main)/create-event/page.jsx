/* eslint-disable react-hooks/incompatible-library */
"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { State, City } from "country-state-city";
import { CalendarIcon, Loader2, Sparkles, CalendarPlus } from "lucide-react";
import { useConvexMutation, useConvexQuery } from "@/hooks/use-convex-query";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";
import { useAuth } from "@clerk/nextjs";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import UnsplashImagePicker from "@/components/unsplash-image-picker";
import AIEventCreator from "./_components/ai-event-creator";
import UpgradeModal from "@/components/upgrade-modal";
import { CATEGORIES } from "@/lib/data";
import Image from "next/image";

// HH:MM in 24h
const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;

const eventSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  description: z.string().min(20, "Description must be at least 20 characters"),
  category: z.string().min(1, "Please select a category"),
  startDate: z.date({ required_error: "Start date is required" }),
  endDate: z.date({ required_error: "End date is required" }),
  startTime: z.string().regex(timeRegex, "Start time must be HH:MM"),
  endTime: z.string().regex(timeRegex, "End time must be HH:MM"),
  locationType: z.enum(["physical", "online"]).default("physical"),
  venue: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  address: z.string().optional(),
  city: z.string().min(1, "City is required"),
  state: z.string().optional(),
  capacity: z.number().min(1, "Capacity must be at least 1"),
  ticketType: z.enum(["free", "paid"]).default("free"),
  ticketPrice: z.number().optional(),
  coverImage: z.string().optional(),
  themeColor: z.string().default("#1e3a8a"),
});

export default function CreateEventPage() {
  const router = useRouter();
  const [showImagePicker, setShowImagePicker] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [upgradeReason, setUpgradeReason] = useState("limit"); // "limit" or "color"

  // Check if user has Pro plan
  const { has } = useAuth();
  const hasPro = has?.({ plan: "pro" });

  const { data: currentUser } = useConvexQuery(api.users.getCurrentUser);
  const { mutate: createEvent, isLoading } = useConvexMutation(
    api.events.createEvent
  );

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      locationType: "physical",
      ticketType: "free",
      capacity: 50,
      themeColor: "#1e3a8a",
      category: "",
      state: "",
      city: "",
      startTime: "",
      endTime: "",
    },
  });

  const themeColor = watch("themeColor");
  const ticketType = watch("ticketType");
  const selectedState = watch("state");
  const startDate = watch("startDate");
  const endDate = watch("endDate");
  const coverImage = watch("coverImage");

  const indianStates = useMemo(() => State.getStatesOfCountry("IN"), []);
  const cities = useMemo(() => {
    if (!selectedState) return [];
    const st = indianStates.find((s) => s.name === selectedState);
    if (!st) return [];
    return City.getCitiesOfState("IN", st.isoCode);
  }, [selectedState, indianStates]);

  // Color presets - show all for Pro, only default for Free
  const colorPresets = [
    "#1e3a8a", // Default color (always available)
    ...(hasPro ? ["#4c1d95", "#065f46", "#92400e", "#7f1d1d", "#831843"] : []),
  ];

  const handleColorClick = (color) => {
    // If not default color and user doesn't have Pro
    if (color !== "#1e3a8a" && !hasPro) {
      setUpgradeReason("color");
      setShowUpgradeModal(true);
      return;
    }
    setValue("themeColor", color);
  };

  const combineDateTime = (date, time) => {
    if (!date || !time) return null;
    const [hh, mm] = time.split(":").map(Number);
    const d = new Date(date);
    d.setHours(hh, mm, 0, 0);
    return d;
  };

  const onSubmit = async (data) => {
    try {
      const start = combineDateTime(data.startDate, data.startTime);
      const end = combineDateTime(data.endDate, data.endTime);

      if (!start || !end) {
        toast.error("Please select both date and time for start and end.");
        return;
      }
      if (end.getTime() <= start.getTime()) {
        toast.error("End date/time must be after start date/time.");
        return;
      }

      // Check event limit for Free users
      if (!hasPro && currentUser?.freeEventsCreated >= 1) {
        setUpgradeReason("limit");
        setShowUpgradeModal(true);
        return;
      }

      // Check if trying to use custom color without Pro
      if (data.themeColor !== "#1e3a8a" && !hasPro) {
        setUpgradeReason("color");
        setShowUpgradeModal(true);
        return;
      }

      await createEvent({
        title: data.title,
        description: data.description,
        category: data.category,
        tags: [data.category],
        startDate: start.getTime(),
        endDate: end.getTime(),
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        locationType: data.locationType,
        venue: data.venue || undefined,
        address: data.address || undefined,
        city: data.city,
        state: data.state || undefined,
        country: "India",
        capacity: data.capacity,
        ticketType: data.ticketType,
        ticketPrice: data.ticketPrice || undefined,
        coverImage: data.coverImage || undefined,
        themeColor: data.themeColor,
        hasPro,
      });

      toast.success("Event created successfully! 🎉");
      router.push("/my-events");
    } catch (error) {
      toast.error(error.message || "Failed to create event");
    }
  };

  const handleAIGenerate = (generatedData) => {
    setValue("title", generatedData.title);
    setValue("description", generatedData.description);
    setValue("category", generatedData.category);
    setValue("capacity", generatedData.suggestedCapacity);
    setValue("ticketType", generatedData.suggestedTicketType);
    toast.success("Event details filled! Customize as needed.");
  };

  return (
    <div
      className="min-h-screen transition-all duration-500 px-4 sm:px-6 pt-36 md:pt-24 pb-8 lg:rounded-md bg-gradient-to-br from-background via-background to-muted/30"
      style={{ 
        background: `linear-gradient(135deg, ${themeColor}15 0%, ${themeColor}05 100%)` 
      }}
    >
      <div className="max-w-6xl mx-auto mb-8 relative">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
              Create Event
            </h1>
            {!hasPro && (
              <p className="text-sm text-muted-foreground mt-2 font-medium">
                Free Plan: {currentUser?.freeEventsCreated || 0}/1 events created
              </p>
            )}
          </div>
          <AIEventCreator onEventGenerated={handleAIGenerate} />
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* LEFT COLUMN: Media & Theme */}
            <div className="lg:col-span-1 space-y-6">
              {/* Cover Image Card */}
              <div 
                className="group relative aspect-video w-full rounded-2xl overflow-hidden border border-border/50 bg-background/50 backdrop-blur-sm shadow-sm hover:shadow-md transition-all cursor-pointer"
                onClick={() => setShowImagePicker(true)}
              >
                {coverImage ? (
                  <>
                    <Image
                      src={coverImage}
                      alt="Cover"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      width={800}
                      height={450}
                      priority
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                      <span className="opacity-0 group-hover:opacity-100 text-white font-medium bg-black/40 px-4 py-2 rounded-full backdrop-blur-sm transition-opacity">
                        Change Cover
                      </span>
                    </div>
                  </>
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center gap-3 text-muted-foreground bg-muted/20 group-hover:bg-muted/30 transition-colors">
                    <div className="p-4 rounded-full bg-background shadow-sm">
                      <Sparkles className="w-6 h-6" />
                    </div>
                    <span className="font-medium">Add Cover Image</span>
                  </div>
                )}
              </div>

              {/* Theme Color Card */}
              <div className="p-6 rounded-2xl border border-border/50 bg-background/50 backdrop-blur-sm shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-base font-semibold">Theme Color</Label>
                  {!hasPro && (
                    <Badge variant="secondary" className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 text-purple-600 border-purple-200">
                      <Sparkles className="w-3 h-3 mr-1" /> Pro
                    </Badge>
                  )}
                </div>
                
                <div className="grid grid-cols-5 gap-3">
                  {colorPresets.map((color) => (
                    <button
                      key={color}
                      type="button"
                      className={`w-10 h-10 rounded-full border-2 transition-all duration-300 ${
                        themeColor === color 
                          ? "ring-2 ring-offset-2 ring-foreground scale-110" 
                          : "hover:scale-110 hover:shadow-lg"
                      } ${
                        !hasPro && color !== "#1e3a8a" ? "opacity-40 grayscale cursor-not-allowed" : ""
                      }`}
                      style={{
                        backgroundColor: color,
                        borderColor: themeColor === color ? "white" : "transparent",
                      }}
                      onClick={() => handleColorClick(color)}
                    />
                  ))}
                  
                  {!hasPro && (
                    <button
                      type="button"
                      onClick={() => {
                        setUpgradeReason("color");
                        setShowUpgradeModal(true);
                      }}
                      className="w-10 h-10 rounded-full border-2 border-dashed border-purple-300 flex items-center justify-center hover:border-purple-500 hover:bg-purple-50 transition-all"
                    >
                      <Sparkles className="w-4 h-4 text-purple-500" />
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: Form Details */}
            <div className="lg:col-span-2 space-y-8">
              <div className="space-y-6 p-6 rounded-2xl border border-border/50 bg-background/50 backdrop-blur-sm shadow-sm">
                
                {/* Title Input */}
                <div className="relative">
                  <Input
                    {...register("title")}
                    placeholder="Event Name"
                    className="text-3xl md:text-4xl font-bold bg-transparent border-none border-b-2 border-border/50 rounded-none px-0 focus-visible:ring-0 focus-visible:border-foreground transition-colors placeholder:text-muted-foreground h-auto py-2"
                  />
                  {errors.title && (
                    <p className="text-sm text-red-500 mt-2 font-medium animate-in slide-in-from-top-1">
                      {errors.title.message}
                    </p>
                  )}
                </div>

                {/* Category & Capacity Grid */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-muted-foreground">Category</Label>
                    <Controller
                      control={control}
                      name="category"
                      render={({ field }) => (
                        <Select value={field.value} onValueChange={field.onChange}>
                          <SelectTrigger className="bg-background/60 border-border/60 h-11">
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            {CATEGORIES.map((cat) => (
                              <SelectItem key={cat.id} value={cat.id}>
                                <div className="flex items-center gap-2">
                                  <span className="text-lg">{cat.icon}</span>
                                  <span>{cat.label}</span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errors.category && <p className="text-xs text-red-500">{errors.category.message}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-muted-foreground">Capacity</Label>
                    <Input
                      type="number"
                      {...register("capacity", { valueAsNumber: true })}
                      placeholder="Max attendees"
                      className="bg-background/60 border-border/60 h-11"
                    />
                    {errors.capacity && <p className="text-xs text-red-500">{errors.capacity.message}</p>}
                  </div>
                </div>

                {/* Date & Time Section */}
                <div className="space-y-4 pt-2">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <CalendarIcon className="w-5 h-5 text-primary" /> 
                    Date & Time
                  </h3>
                  
                  <div className="grid md:grid-cols-2 gap-6 p-4 rounded-xl bg-muted/20 border border-border/50">
                    <div className="space-y-3">
                      <Label className="text-sm font-medium">Starts</Label>
                      <div className="grid grid-cols-[1fr_auto] gap-3">
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="outline" className="w-full justify-start text-left font-normal bg-background/80 hover:bg-background">
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {startDate ? format(startDate, "PPP") : <span>Pick a date</span>}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={startDate}
                              onSelect={(date) => setValue("startDate", date)}
                              disabled={(date) => date < new Date().setHours(0, 0, 0, 0)}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <Input
                          type="time"
                          {...register("startTime")}
                          className="w-24 bg-background/80"
                        />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <Label className="text-sm font-medium">Ends</Label>
                      <div className="grid grid-cols-[1fr_auto] gap-3">
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="outline" className="w-full justify-start text-left font-normal bg-background/80 hover:bg-background" disabled={!startDate}>
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {endDate ? format(endDate, "PPP") : <span>{startDate ? "Pick a date" : "Select Start Date First"}</span>}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={endDate}
                              onSelect={(date) => setValue("endDate", date)}
                              disabled={(date) => {
                                const start = startDate ? new Date(startDate) : new Date();
                                start.setHours(0, 0, 0, 0);
                                return date < start;
                              }}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <Input
                          type="time"
                          {...register("endTime")}
                          className="w-24 bg-background/80"
                        />
                      </div>
                    </div>
                  </div>
                  {(errors.startDate || errors.startTime || errors.endDate || errors.endTime) && (
                    <div className="text-sm text-red-500 px-2">
                      {errors.startDate?.message || errors.startTime?.message || errors.endDate?.message || errors.endTime?.message}
                    </div>
                  )}
                </div>

                {/* Location Section */}
                <div className="space-y-4 pt-2">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <span className="bg-primary/10 p-1 rounded-md">📍</span>
                    Location Details
                  </h3>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <Controller
                      control={control}
                      name="state"
                      render={({ field }) => (
                        <Select
                          value={field.value}
                          onValueChange={(val) => {
                            field.onChange(val);
                            setValue("city", "");
                          }}
                        >
                          <SelectTrigger className="bg-background/60 h-11">
                            <SelectValue placeholder="Select State" />
                          </SelectTrigger>
                          <SelectContent>
                            {indianStates.map((s) => (
                              <SelectItem key={s.isoCode} value={s.name}>{s.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />

                    <Controller
                      control={control}
                      name="city"
                      render={({ field }) => (
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                          disabled={!selectedState}
                        >
                          <SelectTrigger className="bg-background/60 h-11">
                            <SelectValue placeholder={selectedState ? "Select City" : "Select State First"} />
                          </SelectTrigger>
                          <SelectContent>
                            {cities.map((c) => (
                              <SelectItem key={c.name} value={c.name}>{c.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </div>

                  <div className="space-y-3">
                    <Input
                      {...register("venue")}
                      placeholder="Venue Name or Google Maps Link"
                      type="url"
                      className="bg-background/60 h-11"
                    />
                    {errors.venue && <p className="text-sm text-red-500">{errors.venue.message}</p>}

                    <Textarea
                      {...register("address")}
                      placeholder="Detailed Address (Street, Building, etc.)"
                      className="bg-background/60 resize-none"
                      rows={2}
                    />
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label>Event Description</Label>
                  <Textarea
                    {...register("description")}
                    placeholder="Tell us all the exciting details..."
                    className="min-h-[150px] bg-background/60 focus:bg-background transition-colors"
                  />
                  {errors.description && <p className="text-sm text-red-500">{errors.description.message}</p>}
                </div>

                {/* Ticketing Section - Simplified */}
                <div className="p-4 rounded-xl bg-muted/20 border border-border/50">
                  <div className="flex flex-col md:flex-row md:items-center gap-6">
                    <div className="flex items-center gap-6">
                      <Label className="text-base font-semibold">Ticket Type</Label>
                      <div className="flex items-center gap-4 bg-background/50 p-1 rounded-lg border border-border/50">
                        <label className={`cursor-pointer px-4 py-1.5 rounded-md transition-all ${ticketType === 'free' ? 'bg-background shadow-sm font-medium' : 'text-muted-foreground'}`}>
                          <input type="radio" value="free" {...register("ticketType")} className="hidden" />
                          Free
                        </label>
                        <label className={`cursor-pointer px-4 py-1.5 rounded-md transition-all ${ticketType === 'paid' ? 'bg-background shadow-sm font-medium' : 'text-muted-foreground'}`}>
                          <input type="radio" value="paid" {...register("ticketType")} className="hidden" />
                          Paid
                        </label>
                      </div>
                    </div>

                    {ticketType === "paid" && (
                      <div className="flex-1 animate-in fade-in slide-in-from-left-4">
                        <Input
                          type="number"
                          placeholder="Price per ticket (₹)"
                          {...register("ticketPrice", { valueAsNumber: true })}
                          className="bg-background/80 h-11"
                        />
                      </div>
                    )}
                  </div>
                </div>

              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full py-7 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all text-white hover:brightness-110"
                style={{ backgroundColor: themeColor }}
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin" /> Publishing Event...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <CalendarPlus className="w-5 h-5" /> Create Event
                  </span>
                )}
              </Button>
            </div>
          </div>
        </form>
      </div>

      {/* Utilities */}
      <UnsplashImagePicker
        isOpen={showImagePicker}
        onClose={() => setShowImagePicker(false)}
        initialQuery={watch("category") || "event"}
        onSelect={(url) => {
          setValue("coverImage", url);
          setShowImagePicker(false);
        }}
      />
      
      <UpgradeModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        trigger={upgradeReason}
      />
    </div>
  );
}