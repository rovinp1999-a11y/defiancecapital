import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Home,
  TrendingUp,
  Image as ImageIcon,
  Wallet,
  MoreHorizontal,
} from "lucide-react";

import { cn } from "@/lib/utils";

const items = [
  { to: "/", label: "Home", Icon: Home, end: true },
  { to: "/defi", label: "DeFi", Icon: TrendingUp },
  { to: "/nft-marketplace", label: "NFT", Icon: ImageIcon },
  { to: "/portfolio", label: "Portfolio", Icon: Wallet },
  { to: "/more", label: "More", Icon: MoreHorizontal },
];

export function MobileNav() {
  return (
    <nav
      className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-background/90 backdrop-blur-xl border-t border-border"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <ul className="grid grid-cols-5">
        {items.map(({ to, label, Icon, end }) => (
          <li key={to}>
            <NavLink
              to={to}
              end={end}
              className={({ isActive }) =>
                cn(
                  "flex flex-col items-center justify-center gap-0.5 py-2.5 text-[10px] font-medium transition-colors",
                  isActive
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )
              }
            >
              {({ isActive }) => (
                <>
                  <span className="relative h-9 w-9 grid place-items-center rounded-full">
                    {isActive && (
                      <motion.span
                        layoutId="mobile-nav-indicator"
                        className="absolute inset-0 bg-secondary rounded-full"
                        transition={{
                          type: "spring",
                          stiffness: 500,
                          damping: 36,
                        }}
                      />
                    )}
                    <Icon className="h-5 w-5 relative z-10" />
                  </span>
                  <span className="tracking-wide">{label}</span>
                </>
              )}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
