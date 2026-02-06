"use client";

import { ConvexReactClient } from "convex/react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { useAuth } from "@clerk/nextjs";

import useStoreUser from "@/hooks/useStoreUser";

const url = process.env.NEXT_PUBLIC_CONVEX_URL;

if (!url) {
  throw new Error("NEXT_PUBLIC_CONVEX_URL is missing");
}

const convex = new ConvexReactClient(url);

function UserSettingsWrapper({ children }) {
  useStoreUser();
  return <>{children}</>;
}

export default function ConvexClientProvider({ children }) {
  return (
    <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
      <UserSettingsWrapper>{children}</UserSettingsWrapper>
    </ConvexProviderWithClerk>
  );
}
