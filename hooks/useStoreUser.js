"use client";

import { useEffect, useState } from "react";
import { useAuth, useUser } from "@clerk/nextjs";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

export default function useStoreUser() {
  const { isSignedIn, userId } = useAuth();
  const { user } = useUser();
  const storeUser = useMutation(api.users.store);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!isSignedIn || !user || !userId) return;

    setIsLoading(true);

    storeUser()
      .catch((e) => {
        console.error("Error storing user:", e);
      })
      .finally(() => {
        setIsLoading(false);
      });
}, [isSignedIn, user, userId]); //  FIXED


  return { isLoading };
}
