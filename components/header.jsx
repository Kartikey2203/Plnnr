"use client";

import { SignInButton, UserButton, useAuth } from "@clerk/nextjs";
import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { BarLoader } from "react-spinners";
import useStoreUser from "@/hooks/useStoreUser";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Ticket, Building } from "lucide-react";
import ProLogo from "@/components/ui/pro-logo";
import OnboardingModal from "@/components/onboarding-modal";
import SearchLocationBar from "./search-location-bar";
import { useOnboarding } from "@/hooks/use-onboarding";
import UpgradeModal from "@/components/upgrade-modal";

const Header = () => {
  const { isLoading } = useStoreUser();
  const { isSignedIn } = useAuth();
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
    const {showOnboarding,handleOnboardingComplete,handleOnboardingSkip,needsOnboarding} = useOnboarding();
  const pathname = usePathname();
  const isLandingPage = pathname === "/" || pathname === "/explore";
  const {has} = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const hasPro = mounted && has?.({
    plan: "pro"
  });
  return (
    <>
    <nav className="fixed top-0 left-0 right-0 z-50">
      {/* Glass / Solid navbar depending on route */}
      <div
        className={`border-b border-white/5 backdrop-blur-xl transition-colors duration-300
          ${
            isLandingPage
              ? "bg-gradient-to-b from-black/40 via-black/30 to-transparent"
              : "bg-black/80"
          }
        `}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            {/* Logo */}
            <Link href="/" className="flex items-center transition-opacity hover:opacity-90">
              <img
                src="/plnnr_logo.jpg"
                alt="Plnnr logo"
                className="h-10 w-auto object-contain rounded-lg"
              />
            </Link>
            
            {/* Pro Icon */}
            {hasPro && (
              <Link href="/" className="transition-opacity hover:opacity-90">
                <ProLogo className="h-7 w-auto" />
              </Link>
            )}
          </div>
          {/* Actions */}
          <div className="flex items-center gap-4">
             {/* Search  & Location Bar*/}
             <div className="hidden md:flex flex-1 justify-center">
             <SearchLocationBar/>
             </div>

            {/* Pro */}
           { !hasPro && <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowUpgradeModal(true)}
            >
              Pro
            </Button>}
            {/* Explore */}
            <Button variant="ghost" size="sm" asChild>
              <Link href="/explore">Explore</Link>
            </Button>

            {/* Create Event */}
            <Button size="sm" asChild className="flex gap-2">
              <Link href="/create-event">
                <Plus className="h-4 w-4" />
                <span className="hidden sm:inline">Create Event</span>
              </Link>
            </Button>

            {/* Auth */}
            {isSignedIn ? (
              <UserButton appearance={{ elements: { avatarBox: "h-9 w-9" } }}>
                <UserButton.MenuItems>
                  <UserButton.Link
                    label="My Tickets"
                    labelIcon={<Ticket size={16} />}
                    href="/my-tickets"
                  />
                  <UserButton.Link
                    label="My Events"
                    labelIcon={<Building size={16} />}
                    href="/my-events"
                  />
                  <UserButton.Action label="manageAccount" />
                </UserButton.MenuItems>
              </UserButton>
            ) : (
              <SignInButton mode="modal" forceRedirectUrl="/">
                <button className="rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white hover:bg-white/20">
                  Sign In
                </button>
              </SignInButton>
            )}
          </div>
        </div>

        {/* Mobile Search & Location Bar - Separate Row */}
        <div className="md:hidden px-6 pb-4">
          <SearchLocationBar />
        </div>
      </div>

      {/* Loader */}
      {isLoading && (
        <div className="absolute bottom-0 left-0 w-full">
          <BarLoader width="100%" height={3} color="#a855f7" />
        </div>
      )}

      {/* Glow line */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-rose-500/50 to-transparent" />
    </nav>
                <OnboardingModal 
                isOpen={showOnboarding}
                onClose={handleOnboardingSkip}
                onComplete={handleOnboardingComplete}
                />
                <UpgradeModal 
                  isOpen={showUpgradeModal} 
                  onClose={setShowUpgradeModal} 
                  trigger="header" 
                />
                </>
  );
};

export default Header;