"use client";

import { useEffect, useState } from "react";
import { useAuth, useUser } from "@clerk/nextjs";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

export default function useStoreUser() {
  const { isSignedIn, userId } = useAuth();
  const { user } = useUser();
  const storeUser = useMutation(api.users.storeUser);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!isSignedIn || !user) return;

    setIsLoading(true);

    storeUser({
      tokenIdentifier: userId,
      name: user.fullName ?? "Anonymous",
      email: user.primaryEmailAddress?.emailAddress ?? "",
      imageUrl: user.imageUrl,
    }).finally(() => {
      setIsLoading(false);
    });
  }, [isSignedIn, user]);

  return { isLoading };
}
