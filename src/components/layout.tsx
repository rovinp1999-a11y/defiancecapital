import { Toaster } from "sonner";
import { useLocation } from "react-router-dom";

import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { CommandPalette } from "@/components/command-palette";
import { MobileNav } from "@/components/mobile-nav";
import { LoadingBar } from "@/components/loading-bar";
import { useTheme } from "@/components/theme-provider";

export function Layout({ children }: { children: React.ReactNode }) {
  const { theme } = useTheme();
  const { pathname } = useLocation();
  // Pitch deck is presented as a standalone document — no chrome
  const chromeless = pathname.startsWith("/deck");

  if (chromeless) {
    return (
      <div className="relative min-h-screen flex flex-col">
        {children}
        <Toaster
          theme={theme}
          position="bottom-right"
          toastOptions={{
            style: {
              background: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
              color: "hsl(var(--foreground))",
              fontFamily: "Geist, system-ui, sans-serif",
              fontSize: "13px",
            },
          }}
        />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen flex flex-col">
      <LoadingBar />
      <Header />
      <main className="flex-1 pt-16 pb-20 lg:pb-0">{children}</main>
      <Footer />
      <MobileNav />
      <CommandPalette />
      <Toaster
        theme={theme}
        position="bottom-right"
        toastOptions={{
          style: {
            background: "hsl(var(--card))",
            border: "1px solid hsl(var(--border))",
            color: "hsl(var(--foreground))",
            fontFamily: "Geist, system-ui, sans-serif",
            fontSize: "13px",
          },
        }}
      />
    </div>
  );
}
