import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function LandingPage() {
  return (
    <section
      className="
        relative w-screen
        min-h-[100svh]
        bg-cover bg-center bg-no-repeat
        flex items-center
      "
      style={{ backgroundImage: "url('/bg_img.png')" }}
    >
      {/* Overlay - Rich Concert Gradient (Lighter to show image) */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-purple-900/20" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black" />

      {/* Content */}
      <div
        className="
          relative z-10 w-full
          px-6 sm:px-12 lg:px-24
          pt-20 pb-20
          flex flex-col justify-center h-full
        "
      >
        <div className="max-w-4xl mx-auto lg:mx-0 text-center lg:text-left space-y-8">
          {/* Tagline */}
          <span className="inline-block py-1 px-3 rounded-full bg-white/5 border border-white/10 text-purple-300 text-xs font-semibold tracking-widest uppercase mb-4 backdrop-blur-md">
            PLNNR* Event Intelligence
          </span>

          {/* Main Heading */}
          <h1 className="text-5xl sm:text-7xl md:text-8xl font-black leading-[0.9] text-white tracking-tight">
            Discover <br />
            create amazing <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 animate-gradient-x">
              events.
            </span>
          </h1>

          {/* Subtext */}
          <p className="text-lg sm:text-xl text-gray-300 max-w-2xl leading-relaxed font-light mx-auto lg:mx-0">
            Whether you're hosting or attending, Spott helps you discover,
            create, and manage events effortlessly. Join the revolution in event planning.
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center lg:justify-start pt-4">
            <Button 
                asChild 
                className="h-14 px-10 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold text-lg hover:scale-105 transition-all duration-300 shadow-[0_0_20px_rgba(168,85,247,0.4)]"
            >
              <Link href="/explore">Get Started</Link>
            </Button>

            <Button
              asChild
              variant="outline"
              className="h-14 px-10 rounded-full border-white/10 bg-white/5 hover:bg-white/10 text-white font-semibold text-lg backdrop-blur-sm transition-all duration-300"
            >
              <Link href="/create-event">Create Event</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
