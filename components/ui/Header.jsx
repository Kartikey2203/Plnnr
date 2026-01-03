"use client";
import Link from "next/link";

const Header = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50">
      {/* Transparent glass navbar */}
      <div className="border-b border-white/5 bg-gradient-to-b from-black/40 via-black/30 to-transparent backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          {/* Logo without background */}
          <Link
            href="/"
            className="group flex items-center transition-all duration-300 hover:opacity-80"
          >
            <img
              src="/plnnr_logo.jpg"
              alt="Plnnr logo"
              className="h-12 w-auto object-contain"
            />
          </Link>

          {/* Center navigation links */}
          <div className="hidden lg:flex items-center gap-1 rounded-full bg-white/5 px-2 py-2 ring-1 ring-white/10 backdrop-blur-xl">
            <Link
              href="/features"
              className="rounded-full px-5 py-2 text-sm font-medium text-white/70 transition-all duration-200 hover:bg-white/10 hover:text-white"
            >
              Features
            </Link>
            <Link
              href="/pricing"
              className="rounded-full px-5 py-2 text-sm font-medium text-white/70 transition-all duration-200 hover:bg-white/10 hover:text-white"
            >
              Pricing
            </Link>
            <Link
              href="/about"
              className="rounded-full px-5 py-2 text-sm font-medium text-white/70 transition-all duration-200 hover:bg-white/10 hover:text-white"
            >
              About
            </Link>
            <Link
              href="/contact"
              className="rounded-full px-5 py-2 text-sm font-medium text-white/70 transition-all duration-200 hover:bg-white/10 hover:text-white"
            >
              Contact
            </Link>
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-3">
            <button className="hidden md:inline-flex rounded-full bg-white/10 px-5 py-2 text-sm font-medium text-white ring-1 ring-white/20 backdrop-blur-xl transition-all duration-200 hover:bg-white/20">
              Sign In
            </button>
            <button className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-rose-500 to-pink-600 px-5 py-2 text-sm font-medium text-white shadow-lg shadow-rose-500/25 transition-all duration-200 hover:shadow-rose-500/40 hover:scale-105">
              Subscribe
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Subtle glow effect */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-rose-500/50 to-transparent" />
    </nav>
  );
};

export default Header;