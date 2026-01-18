"use client";

import { SignInButton, UserButton, useAuth } from "@clerk/nextjs";
import Link from "next/link";
import { useState } from "react";
import { BarLoader } from "react-spinners";
import useStoreUser from "@/hooks/useStoreUser";
import { Button } from "@/components/ui/button";
import { Plus, Ticket, Building } from "lucide-react";

const Header = () => {
  // const { isLoading } = useStoreUser();
  const { isSignedIn } = useAuth();
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50">
      {/* Glass navbar */}
      <div className="border-b border-white/5 bg-gradient-to-b from-black/40 via-black/30 to-transparent backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <img
              src="/plnnr_logo.jpg"
              alt="Plnnr logo"
              className="h-12 w-auto object-contain"
            />
          </Link>

          {/* Actions */}
          <div className="flex items-center gap-4">
            {/* Pro */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowUpgradeModal(true)}
            >
              Pro
            </Button>

            {/* Explore */}
            <Button variant="ghost" size="sm" asChild>
              <Link href="/explore">Explore</Link>
            </Button>

            {/* Create Event */}
            <Button size="sm" asChild className="flex gap-2">
              <Link href="/create-event">
                <Plus className="w-4 h-4" />
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
      </div>

      {/* Loader */}
      {/* {isLoading && (
        <div className="absolute bottom-0 left-0 w-full">
          <BarLoader width="100%" height={3} color="#a855f7" />
        </div>
      )} */}

      {/* Glow line */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-rose-500/50 to-transparent" />
    </nav>
  );
};

export default Header;
