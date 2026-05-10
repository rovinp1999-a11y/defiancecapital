import { useState } from "react";
import * as Popover from "@radix-ui/react-popover";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell,
  ArrowUpRight,
  Vote,
  Coins,
  Rocket,
  TrendingUp,
  Clock,
  CheckCircle2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Notif = {
  id: string;
  icon: typeof Vote;
  title: string;
  body: string;
  ago: string;
  read?: boolean;
  href?: string;
  tone: "default" | "success" | "warn";
};

const seed: Notif[] = [
  {
    id: "1",
    icon: Vote,
    title: "Proposal DEFY-014 closes in 1d 8h",
    body: "Add Base mainnet support across all modules. Currently at 78% For.",
    ago: "12m ago",
    tone: "warn",
    href: "/governance",
  },
  {
    id: "2",
    icon: Coins,
    title: "Your DEFY/ETH LP earned 0.041 ETH",
    body: "Claimable from the Gaming pool. Auto-compound is on.",
    ago: "2h ago",
    tone: "success",
    href: "/defi",
  },
  {
    id: "3",
    icon: Rocket,
    title: "Aetherchain IDO opens in 4h",
    body: "You qualify for the Builder tier — up to $1,500 allocation.",
    ago: "3h ago",
    tone: "default",
    href: "/launchpad",
  },
  {
    id: "4",
    icon: TrendingUp,
    title: "Azuki floor rose 8.1%",
    body: "Your watched collection moved from 0.91 ETH to 0.99 ETH.",
    ago: "6h ago",
    tone: "success",
    href: "/nft-marketplace",
  },
  {
    id: "5",
    icon: CheckCircle2,
    title: "Welcome to Defiance Hub",
    body: "Connect your wallet to personalize this feed.",
    ago: "1d ago",
    read: true,
    tone: "default",
  },
];

const toneStyles: Record<Notif["tone"], string> = {
  default: "bg-secondary text-foreground",
  success: "bg-[hsl(var(--success)/0.15)] text-[hsl(var(--success))]",
  warn: "bg-[hsl(var(--warn)/0.15)] text-[hsl(var(--warn))]",
};

export function NotificationDrawer() {
  const [items, setItems] = useState(seed);
  const unread = items.filter((i) => !i.read).length;

  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <button
          type="button"
          className="relative h-9 w-9 grid place-items-center rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
          aria-label={`Notifications (${unread} unread)`}
        >
          <Bell className="h-5 w-5" />
          {unread > 0 && (
            <span className="absolute top-1 right-1 h-4 min-w-[16px] px-1 rounded-full bg-primary text-primary-foreground text-[10px] font-medium grid place-items-center tabular">
              {unread}
            </span>
          )}
        </button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          align="end"
          sideOffset={8}
          className="z-[60] w-[360px] surface rounded-xl shadow-2xl overflow-hidden data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[state=open]:slide-in-from-top-1"
        >
          <div className="flex items-center justify-between px-4 py-3 border-b border-border">
            <p className="font-display text-sm font-semibold">Notifications</p>
            <Button
              variant="ghost"
              size="sm"
              className="text-[11px] h-7"
              onClick={() => setItems((x) => x.map((n) => ({ ...n, read: true })))}
              disabled={unread === 0}
            >
              Mark all read
            </Button>
          </div>
          <div className="max-h-[420px] overflow-y-auto">
            <AnimatePresence initial={false}>
              {items.map((n, i) => {
                const Icon = n.icon;
                const Wrapper = n.href ? "a" : "div";
                return (
                  <motion.div
                    key={n.id}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2, delay: i * 0.02 }}
                  >
                    <Wrapper
                      {...(n.href ? { href: n.href } : {})}
                      className={cn(
                        "flex gap-3 px-4 py-3 border-b border-border last:border-b-0 hover:bg-elevated transition-colors",
                        n.href && "cursor-pointer",
                      )}
                    >
                      <div
                        className={cn(
                          "h-8 w-8 rounded-md grid place-items-center shrink-0",
                          toneStyles[n.tone],
                        )}
                      >
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <p
                            className={cn(
                              "text-[13px] font-medium leading-snug",
                              !n.read && "text-foreground",
                              n.read && "text-muted-foreground",
                            )}
                          >
                            {n.title}
                          </p>
                          {!n.read && (
                            <span className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                          )}
                        </div>
                        <p className="text-[12px] text-muted-foreground mt-0.5 leading-snug">
                          {n.body}
                        </p>
                        <p className="text-[11px] text-muted-foreground mt-1.5 flex items-center gap-1 tabular">
                          <Clock className="h-3 w-3" />
                          {n.ago}
                          {n.href && <ArrowUpRight className="h-3 w-3 ml-auto" />}
                        </p>
                      </div>
                    </Wrapper>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
          <div className="px-4 py-2 border-t border-border text-center">
            <a
              href="#"
              className="text-[11px] text-muted-foreground hover:text-foreground"
            >
              View all activity
            </a>
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
