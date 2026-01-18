import "./globals.css";
import { ThemeProvider } from "@/components/ui/theme-provider";
import ConvexClientProvider from "./convexclientProvider";
import Header from "@/components/ui/Header";
import { dark } from "@clerk/themes";
import { ClerkProvider } from "@clerk/nextjs";
import type { ReactNode } from "react";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <ClerkProvider appearance={{ theme: dark }}>
      <html lang="en" suppressHydrationWarning>
        <body className="m-0 p-0 w-screen overflow-x-hidden text-white">
          <ThemeProvider attribute="class" defaultTheme="dark">
            <ConvexClientProvider>
              {/* FULL WIDTH HEADER */}
              <Header />

              {/* FULL WIDTH MAIN */}
              <main className="w-screen min-h-screen">
                {children}
              </main>

              {/* FULL WIDTH FOOTER */}
              <footer className="w-screen bg-black/60 backdrop-blur-md border-t border-white/10">
                <div className="mx-auto max-w-7xl px-6 py-10 text-center text-sm text-gray-300">
                  From planning to perfection — we manage it all.
                </div>
              </footer>
            </ConvexClientProvider>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
