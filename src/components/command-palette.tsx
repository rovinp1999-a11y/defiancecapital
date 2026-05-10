import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Command } from "cmdk";
import * as Dialog from "@radix-ui/react-dialog";
import {
  Search,
  Home,
  Gamepad2,
  TrendingUp,
  Image as ImageIcon,
  Rocket,
  Vote,
  Wallet,
  Sun,
  Moon,
  ArrowRightLeft,
  ArrowUpRight,
  Bookmark,
  Sparkles,
  Coins,
  BarChart3,
  Users,
} from "lucide-react";

import { useTheme } from "@/components/theme-provider";
import { useNftCollections } from "@/hooks/use-nft-collections";
import { TokenIcon } from "@/components/icons/token-icon";

type Item = {
  id: string;
  group: string;
  label: string;
  hint?: string;
  Icon: typeof Home;
  shortcut?: string[];
  onSelect: () => void;
  keywords?: string[];
};

const ROUTES: { path: string; label: string; Icon: typeof Home; keywords: string[] }[] = [
  { path: "/", label: "Home", Icon: Home, keywords: ["overview", "landing"] },
  { path: "/portfolio", label: "Portfolio", Icon: Wallet, keywords: ["dashboard", "holdings", "balance"] },
  { path: "/defi", label: "DeFi", Icon: TrendingUp, keywords: ["swap", "trade", "pools", "yield"] },
  { path: "/nft-marketplace", label: "NFT Marketplace", Icon: ImageIcon, keywords: ["nfts", "collections", "drops"] },
  { path: "/launchpad", label: "Launchpad", Icon: Rocket, keywords: ["ido", "launch", "stake", "tier"] },
  { path: "/governance", label: "Governance", Icon: Vote, keywords: ["dao", "proposals", "vote"] },
  { path: "/gaming", label: "Gaming", Icon: Gamepad2, keywords: ["games", "play", "earn"] },
  { path: "/watchlist", label: "Watchlist", Icon: Bookmark, keywords: ["starred", "favorites"] },
  { path: "/token", label: "DEFY Token", Icon: Coins, keywords: ["tokenomics", "defy", "supply", "vesting", "distribution"] },
  { path: "/stats", label: "Live metrics", Icon: BarChart3, keywords: ["tvl", "volume", "users", "kpi", "dashboard"] },
  { path: "/about", label: "About", Icon: Users, keywords: ["team", "roadmap", "mission", "investors", "backers"] },
  { path: "/deck", label: "Pitch deck", Icon: ArrowUpRight, keywords: ["investors", "deck", "raise", "series a", "fundraise", "pdf"] },
];

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const { data: collections } = useNftCollections(12);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      }
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const go = (path: string) => {
    navigate(path);
    setOpen(false);
    setSearch("");
  };

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[60] bg-background/70 backdrop-blur-sm data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=closed]:animate-out data-[state=closed]:fade-out-0" />
        <Dialog.Content className="fixed left-1/2 top-[18%] z-[70] w-[92vw] max-w-2xl -translate-x-1/2 surface rounded-xl shadow-2xl overflow-hidden data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[state=open]:slide-in-from-top-4">
          <Dialog.Title className="sr-only">Command palette</Dialog.Title>
          <Command shouldFilter={true} className="bg-transparent">
            <div className="flex items-center gap-2 px-4 border-b border-border">
              <Search className="h-4 w-4 text-muted-foreground shrink-0" />
              <Command.Input
                value={search}
                onValueChange={setSearch}
                placeholder="Search anything…"
                className="flex-1 h-12 bg-transparent border-0 outline-none text-sm placeholder:text-muted-foreground"
              />
              <kbd className="hidden md:inline-flex items-center gap-1 rounded border border-border bg-muted px-1.5 py-0.5 text-[10px] font-mono text-muted-foreground">
                ESC
              </kbd>
            </div>

            <Command.List className="max-h-[60vh] overflow-y-auto p-2">
              <Command.Empty className="px-3 py-10 text-center text-sm text-muted-foreground">
                No results for &quot;{search}&quot;
              </Command.Empty>

              <Command.Group heading="Pages">
                {ROUTES.map((r) => (
                  <CmdItem
                    key={r.path}
                    label={r.label}
                    Icon={r.Icon}
                    keywords={r.keywords}
                    onSelect={() => go(r.path)}
                  />
                ))}
              </Command.Group>

              <Command.Group heading="Quick actions">
                <CmdItem
                  label="Swap tokens"
                  Icon={ArrowRightLeft}
                  hint="Open the DeFi swap"
                  keywords={["swap", "trade", "exchange"]}
                  onSelect={() => go("/defi#swap")}
                  shortcut={["S"]}
                />
                <CmdItem
                  label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
                  Icon={theme === "dark" ? Sun : Moon}
                  keywords={["theme", "dark", "light", "mode"]}
                  onSelect={() => {
                    toggleTheme();
                    setOpen(false);
                  }}
                  shortcut={["T"]}
                />
                <CmdItem
                  label="Connect wallet"
                  Icon={Wallet}
                  keywords={["connect", "metamask", "rainbow"]}
                  onSelect={() => {
                    setOpen(false);
                    document
                      .querySelector<HTMLButtonElement>(
                        "[data-rk] button[type='button']",
                      )
                      ?.click();
                  }}
                />
                <CmdItem
                  label="Submit a proposal"
                  Icon={Vote}
                  hint="Open governance"
                  keywords={["proposal", "dao", "submit"]}
                  onSelect={() => go("/governance")}
                />
                <CmdItem
                  label="Browse upcoming launches"
                  Icon={Sparkles}
                  keywords={["ido", "launch", "upcoming"]}
                  onSelect={() => go("/launchpad")}
                />
              </Command.Group>

              {collections && collections.length > 0 && (
                <Command.Group heading="NFT collections">
                  {collections.slice(0, 8).map((c) => (
                    <Command.Item
                      key={c.id}
                      value={`nft ${c.name} ${c.symbol}`}
                      onSelect={() => go("/nft-marketplace")}
                      className="flex items-center gap-3 px-3 py-2 rounded-md cursor-pointer aria-selected:bg-secondary text-sm"
                    >
                      <img
                        src={c.image}
                        alt=""
                        className="h-7 w-7 rounded-md object-cover bg-muted"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{c.name}</p>
                        <p className="text-[11px] text-muted-foreground tabular">
                          Floor{" "}
                          {c.floorPriceEth !== null
                            ? `${c.floorPriceEth.toFixed(2)} ETH`
                            : "—"}
                        </p>
                      </div>
                      <ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground" />
                    </Command.Item>
                  ))}
                </Command.Group>
              )}

              <Command.Group heading="Tokens">
                {["ETH", "WBTC", "USDC", "DEFY", "MATIC", "ARB"].map((sym) => (
                  <Command.Item
                    key={sym}
                    value={`token ${sym}`}
                    onSelect={() => go("/defi")}
                    className="flex items-center gap-3 px-3 py-2 rounded-md cursor-pointer aria-selected:bg-secondary text-sm"
                  >
                    <TokenIcon symbol={sym} size="sm" />
                    <span className="font-medium">{sym}</span>
                    <span className="text-xs text-muted-foreground ml-auto">
                      Open in DeFi
                    </span>
                  </Command.Item>
                ))}
              </Command.Group>
            </Command.List>

            <div className="px-4 py-2 border-t border-border flex items-center justify-between text-[10px] text-muted-foreground">
              <span className="flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <kbd className="rounded border border-border bg-muted px-1 py-0.5 font-mono">
                    ↑↓
                  </kbd>{" "}
                  navigate
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="rounded border border-border bg-muted px-1 py-0.5 font-mono">
                    ↵
                  </kbd>{" "}
                  select
                </span>
              </span>
              <span className="font-mono">Defiance Hub</span>
            </div>
          </Command>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

function CmdItem({
  label,
  hint,
  Icon,
  shortcut,
  onSelect,
  keywords,
}: Pick<Item, "label" | "hint" | "Icon" | "shortcut" | "onSelect" | "keywords">) {
  return (
    <Command.Item
      value={`${label} ${(keywords ?? []).join(" ")}`}
      onSelect={onSelect}
      className="flex items-center gap-3 px-3 py-2 rounded-md cursor-pointer aria-selected:bg-secondary text-sm"
    >
      <div className="h-7 w-7 grid place-items-center rounded-md surface-muted text-muted-foreground">
        <Icon className="h-4 w-4" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium truncate">{label}</p>
        {hint && (
          <p className="text-[11px] text-muted-foreground truncate">{hint}</p>
        )}
      </div>
      {shortcut && (
        <span className="flex gap-1">
          {shortcut.map((s) => (
            <kbd
              key={s}
              className="rounded border border-border bg-muted px-1.5 py-0.5 text-[10px] font-mono text-muted-foreground"
            >
              {s}
            </kbd>
          ))}
        </span>
      )}
    </Command.Item>
  );
}

/**
 * The trigger pill in the header. Looks like a search field
 * but really is a button that opens the palette.
 */
export function CommandPaletteTrigger() {
  const [isMac, setIsMac] = useState(false);

  useEffect(() => {
    setIsMac(/Mac|iPhone|iPad/i.test(navigator.platform || navigator.userAgent));
  }, []);

  const trigger = () => {
    const evt = new KeyboardEvent("keydown", {
      key: "k",
      metaKey: true,
      ctrlKey: true,
      bubbles: true,
    });
    document.dispatchEvent(evt);
  };

  return (
    <>
      {/* Compact icon-only trigger (md to xl-1) */}
      <button
        type="button"
        onClick={trigger}
        className="hidden md:grid xl:hidden h-9 w-9 place-items-center rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
        aria-label="Open command palette"
      >
        <Search className="h-5 w-5" />
      </button>
      {/* Full pill trigger (xl+) */}
      <button
        type="button"
        onClick={trigger}
        className="hidden xl:inline-flex items-center gap-2 h-9 pl-3 pr-2 rounded-full surface text-[12px] text-muted-foreground hover:text-foreground transition-colors"
        aria-label="Open command palette"
      >
        <Search className="h-3.5 w-3.5" />
        <span>Search…</span>
        <kbd className="ml-2 rounded border border-border bg-muted px-1.5 py-0.5 text-[10px] font-mono">
          {isMac ? "⌘" : "Ctrl"}K
        </kbd>
      </button>
    </>
  );
}
