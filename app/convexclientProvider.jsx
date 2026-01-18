"use client";

import { ConvexReactClient } from "convex/react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { useAuth } from "@clerk/nextjs";

const url = process.env.NEXT_PUBLIC_CONVEX_URL;

if (!url) {
  throw new Error("NEXT_PUBLIC_CONVEX_URL is missing");
}

const convex = new ConvexReactClient(url);

export default function ConvexClientProvider({ children }) {
  return (
    <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
      {children}
    </ConvexProviderWithClerk>
  );
}
