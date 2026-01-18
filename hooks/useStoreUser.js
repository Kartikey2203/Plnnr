"use client";

import { useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

export default function useStoreUser() {
  const { user, isLoaded } = useUser();
  const createUser = useMutation(api.users.createUser);

  useEffect(() => {
    if (!isLoaded || !user) return;

    console.log("🔥 creating user in convex", user.primaryEmailAddress.emailAddress);

    createUser({
      email: user.primaryEmailAddress.emailAddress,
      imageUrl: user.imageUrl,
    });
  }, [isLoaded, user, createUser]);
}
