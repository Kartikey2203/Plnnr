import "./globals.css";
import { ThemeProvider } from "@/components/ui/theme-provider";
import Header from "@/components/ui/Header";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Plnnr",
  description: "AI Event Management Platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-gradient-to-br from-gray-950 via-zinc-900 to-stone-900 text-white">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Header />

          <main className="relative mx-auto min-h-screen max-w-7xl px-6 pt-32">
            {/* Glow */}
            <div className="pointer-events-none absolute inset-0 -z-10">
              <div className="absolute left-1/4 top-0 h-96 w-96 rounded-full bg-rose-500/20 blur-3xl" />
              <div className="absolute bottom-0 right-1/4 h-96 w-96 rounded-full bg-fuchsia-600/20 blur-3xl" />
            </div>

            <div className="relative z-10 min-h-[67.2vh]">
              {children}
            </div>

            <footer className="mx-auto max-w-7xl border-t border-gray-800/50 py-8 text-center text-sm text-gray-400">
              From planning to perfection — we manage it all.
            </footer>
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
