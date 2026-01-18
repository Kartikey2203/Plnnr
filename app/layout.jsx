"use client";

import useStoreUser from "@/hooks/useStoreUser";
import { ConvexClientProvider } from "./convexclientProvider";

export default function RootLayout({ children }) {
  useStoreUser(); // 🔥 AB YEH ACTUALLY CHALEGA

  return (
    <ConvexClientProvider>
      {children}
    </ConvexClientProvider>
  );
}
