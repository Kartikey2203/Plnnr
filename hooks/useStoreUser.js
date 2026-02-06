"use client";

import { useEffect, useState } from "react";
import { useAuth, useUser } from "@clerk/nextjs";
import { useMutation, useConvexAuth } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";

export default function useStoreUser() {
  const { isSignedIn, userId } = useAuth();
  const { isAuthenticated } = useConvexAuth();
  const { user } = useUser();
  const storeUser = useMutation(api.users.store);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    console.log("useStoreUser Effect:", { isSignedIn, isAuthenticated, user: !!user, userId });
    
    // If not signed in or not authenticated with Convex, or no user data, wait.
    if (!isSignedIn || !isAuthenticated || !user || !userId) {
       return;
    }

    setIsLoading(true);

    storeUser()
      .then((id) => {
         console.log("User stored successfully:", id);
      })
      .catch((e) => {
        console.error("Error storing user:", e);
        toast.error("Auth Sync Error: " + e.message);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [isSignedIn, isAuthenticated, user, userId]);

  return { isLoading };
}
