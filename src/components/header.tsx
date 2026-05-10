import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Menu, X, Bookmark, Wallet } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import { Logo, Wordmark } from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { CommandPaletteTrigger } from "@/components/command-palette";
import { NotificationDrawer } from "@/components/notification-drawer";
import { ConnectWalletButton } from "@/components/connect-wallet";
import { useWatchlist } from "@/hooks/use-watchlist";
import { cn } from "@/lib/utils";

const navItems = [
  { to: "/gaming", label: "Gaming" },
  { to: "/defi", label: "DeFi" },
  { to: "/nft-marketplace", label: "NFT" },
  { to: "/launchpad", label: "Launchpad" },
  { to: "/governance", label: "Governance" },
];

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { count: watchlistCount } = useWatchlist();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all",
        scrolled
          ? "bg-background/85 backdrop-blur-xl border-b border-border"
          : "bg-transparent",
      )}
    >
      <div className="container-page flex h-14 items-center justify-between gap-3">
        {/* Brand */}
        <Link to="/" className="flex items-center gap-2.5 shrink-0">
          <Logo size={28} />
          <Wordmark className="hidden sm:inline" />
        </Link>

        {/* Center: product nav (hidden below md, visible md+) */}
        <nav className="hidden md:flex items-center gap-0.5 surface rounded-full px-1 py-1 relative">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  "relative px-3 py-1.5 text-[13px] font-medium rounded-full transition-colors whitespace-nowrap",
                  isActive
                    ? "text-background"
                    : "text-muted-foreground hover:text-foreground",
                )
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <motion.span
                      layoutId="nav-indicator"
                      className="absolute inset-0 bg-foreground rounded-full -z-0"
                      transition={{
                        type: "spring",
                        stiffness: 500,
                        damping: 36,
                      }}
                    />
                  )}
                  <span className="relative z-10">{item.label}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Right: zones — utility | divider | account */}
        <div className="flex items-center gap-1 shrink-0">
          {/* Utility zone — full set at lg+, only bell at md, none below md */}
          <div className="hidden lg:contents">
            <CommandPaletteTrigger />
            <NavLink
              to="/watchlist"
              className={({ isActive }) =>
                cn(
                  "relative h-9 w-9 grid place-items-center rounded-md transition-colors",
                  isActive
                    ? "text-foreground bg-secondary"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary",
                )
              }
              aria-label={`Watchlist (${watchlistCount} items)`}
            >
              <Bookmark className="h-5 w-5" />
              {watchlistCount > 0 && (
                <span className="absolute top-1 right-1 h-4 min-w-[16px] px-1 rounded-full bg-primary text-primary-foreground text-[10px] font-medium grid place-items-center tabular">
                  {watchlistCount}
                </span>
              )}
            </NavLink>
            <NotificationDrawer />
            <ThemeToggle />
          </div>
          {/* At md only: just keep bell so users don't lose alerts */}
          <div className="hidden md:flex lg:hidden items-center gap-1">
            <NotificationDrawer />
          </div>

          {/* Divider — visual separation between utility and account */}
          <div className="hidden md:block h-5 w-px bg-border mx-1" aria-hidden />

          {/* Account zone */}
          <NavLink
            to="/portfolio"
            className={({ isActive }) =>
              cn(
                "hidden md:inline-flex items-center gap-1.5 h-9 px-2.5 rounded-md text-[13px] font-medium transition-colors",
                isActive
                  ? "bg-secondary text-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary",
              )
            }
            aria-label="Portfolio"
          >
            <Wallet className="h-4 w-4" />
            <span className="hidden xl:inline">Portfolio</span>
          </NavLink>
          <div className="hidden md:block">
            <ConnectWalletButton />
          </div>

          {/* Mobile menu */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsOpen((v) => !v)}
            aria-label="Toggle navigation"
          >
            {isOpen ? <X /> : <Menu />}
          </Button>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden overflow-hidden border-b border-border bg-background/95 backdrop-blur-xl"
          >
            <nav className="container-page py-4 flex flex-col gap-1">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => setIsOpen(false)}
                  className={({ isActive }) =>
                    cn(
                      "px-3 py-2.5 rounded-md font-medium",
                      isActive
                        ? "bg-secondary text-foreground"
                        : "text-muted-foreground hover:text-foreground hover:bg-secondary/60",
                    )
                  }
                >
                  {item.label}
                </NavLink>
              ))}
              <NavLink
                to="/portfolio"
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  cn(
                    "px-3 py-2.5 rounded-md font-medium flex items-center gap-2",
                    isActive
                      ? "bg-secondary text-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary/60",
                  )
                }
              >
                <Wallet className="h-4 w-4" />
                Portfolio
              </NavLink>
              <div className="pt-3">
                <ConnectWalletButton />
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
