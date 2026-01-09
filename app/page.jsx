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
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-black/90" />

      {/* Content */}
      <div
        className="
          relative z-10 w-full
          px-6 sm:px-12 lg:px-24
          pt-24 pb-20
          flex flex-col justify-center
        "
      >
        <div className="max-w-xl mx-auto lg:mx-0 text-center lg:text-left">
          <span className="block mb-4 text-xs tracking-[0.3em] uppercase text-purple-400">
            spott*
          </span>

          <h1
            className="
              text-4xl sm:text-6xl md:text-7xl
              font-black leading-tight
              mb-6 text-white
            "
          >
            Discover <br />
            create amazing <br />
            <span className="text-purple-500">events.</span>
          </h1>

          <p
            className="
              text-base sm:text-lg
              text-gray-300
              mb-8
              leading-relaxed
            "
          >
            Whether you're hosting or attending, Spott helps you discover,
            create, and manage events effortlessly.
          </p>

          {/* Buttons */}
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-start">
            <Button
              asChild
              className="
                w-full sm:w-auto
                rounded-full
                px-10 py-5
                bg-purple-600 hover:bg-purple-700
              "
            >
              <Link href="/explore">Get Started</Link>
            </Button>

            <Button
              asChild
              variant="outline"
              className="
                w-full sm:w-auto
                rounded-full
                px-10 py-5
                border-white/20
                bg-white/5
                text-white
              "
            >
              <Link href="/create-event">Create Event</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
