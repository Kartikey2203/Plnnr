"use client"

import { useState, useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useConvexQuery } from "./use-convex-query";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

// Pages that require onboarding (attendee-centered)
const ATTENDEE_PAGES = ["/explore"];

export function useOnboarding() {
  const [showOnboarding, setShowOnboarding] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const { data: currentUser, isLoading } = useConvexQuery(
    api.users.getCurrentUser
  );

  useEffect(() => {
    // Allow forcing onboarding via URL param for testing
    if (searchParams.get("onboarding") === "true") {
      setShowOnboarding(true);
      return;
    }

    if (isLoading || !currentUser) return;

    // Check if user hasn't completed onboarding
    if (!currentUser.hasCompletedOnboarding) {
      // Check if current page requires onboarding
      const requiresOnboarding = ATTENDEE_PAGES.some((page) =>
        pathname.startsWith(page)
      );

      if (requiresOnboarding) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setShowOnboarding(true);
      }
    }
  }, [currentUser, pathname, isLoading, searchParams]);

  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
    
    // Remove onboarding=true from URL if present to prevent it from re-opening
    const newSearchParams = new URLSearchParams(searchParams.toString());
    if (newSearchParams.has("onboarding")) {
       newSearchParams.delete("onboarding");
       const newUrl = newSearchParams.toString() 
         ? `${pathname}?${newSearchParams.toString()}`
         : pathname;
       router.push(newUrl);
    } else {
       // Refresh to get updated user data
       router.refresh();
    }
  };

  const handleOnboardingSkip = () => {
    setShowOnboarding(false);
    // Redirect back to homepage if they skip
    router.push("/");
  };

  return {
    showOnboarding,
    setShowOnboarding,
    handleOnboardingComplete,
    handleOnboardingSkip,
    needsOnboarding: currentUser && !currentUser.hasCompletedOnboarding,
  };
}