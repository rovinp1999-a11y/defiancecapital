import { useEffect, useState, useRef, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import {
  ArrowLeft,
  ArrowRight,
  Printer,
  X,
  ChevronUp,
  ChevronDown,
  Lock,
  TrendingUp,
  Users,
  Coins,
  ShieldCheck,
  Globe,
  Zap,
  Flame,
  CheckCircle2,
  Circle,
  Mail,
  Calendar,
} from "lucide-react";
import { Link } from "react-router-dom";

import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TokenIcon } from "@/components/icons/token-icon";
import { ChainIcon } from "@/components/icons/chain-icon";
import { cn, formatCurrency, formatNumber } from "@/lib/utils";

/* ─── Slide wrapper ─────────────────────────────────────────────────── */

function Slide({
  num,
  total,
  eyebrow,
  children,
  className,
  bg = "default",
}: {
  num: number;
  total: number;
  eyebrow?: string;
  children: ReactNode;
  className?: string;
  bg?: "default" | "primary" | "dark";
}) {
  return (
    <section
      data-slide={num}
      className={cn(
        "deck-slide relative w-full min-h-screen flex flex-col",
        bg === "primary" && "bg-primary text-primary-foreground",
        bg === "dark" && "bg-[hsl(0_0%_3%)] text-[hsl(0_0%_98%)]",
      )}
    >
      <div
        className={cn(
          "container-page flex-1 flex flex-col py-16 md:py-20 lg:py-24",
          className,
        )}
      >
        {eyebrow && (
          <p className="eyebrow eyebrow-dot mb-6 print:mb-4">{eyebrow}</p>
        )}
        <div className="flex-1 flex flex-col">{children}</div>
        <div className="mt-auto pt-10 flex items-center justify-between text-[11px] tabular text-muted-foreground border-t border-border/60">
          <div className="flex items-center gap-2">
            <Logo size={20} />
            <span className="font-display font-semibold tracking-tight">
              DEFIANCE/HUB
            </span>
            <span>·</span>
            <span>Confidential</span>
          </div>
          <span>
            {String(num).padStart(2, "0")} / {String(total).padStart(2, "0")}
          </span>
        </div>
      </div>
    </section>
  );
}

/* ─── Data for charts ────────────────────────────────────────────────── */

const USE_OF_FUNDS = [
  { label: "Engineering & product", amount: 5_000_000, color: "hsl(75 100% 56%)" },
  { label: "Liquidity & treasury", amount: 3_500_000, color: "hsl(188 90% 52%)" },
  { label: "Marketing & growth", amount: 2_500_000, color: "hsl(322 95% 60%)" },
  { label: "Security & audits", amount: 2_000_000, color: "hsl(38 95% 58%)" },
  { label: "Operations & infra", amount: 1_800_000, color: "hsl(262 83% 62%)" },
  { label: "Legal & compliance", amount: 1_500_000, color: "hsl(145 70% 50%)" },
  { label: "Reserve / contingency", amount: 3_700_000, color: "hsl(0 0% 40%)" },
];
const TOTAL_RAISE = USE_OF_FUNDS.reduce((s, u) => s + u.amount, 0);

const PROJECTIONS = [
  { month: 0, users: 11_900, tvl: 41.9, revenue: 4.31 },
  { month: 3, users: 28_000, tvl: 78, revenue: 8.2 },
  { month: 6, users: 62_000, tvl: 142, revenue: 16.4 },
  { month: 9, users: 110_000, tvl: 220, revenue: 26.8 },
  { month: 12, users: 175_000, tvl: 320, revenue: 41.5 },
  { month: 15, users: 250_000, tvl: 440, revenue: 60.2 },
  { month: 18, users: 350_000, tvl: 580, revenue: 84.0 },
];

const TEAM_SPLIT = [
  { role: "Founders (3)", count: 3, salary: 250 },
  { role: "Engineers (8)", count: 8, salary: 200 },
  { role: "Designers (2)", count: 2, salary: 180 },
  { role: "Product / Growth (2)", count: 2, salary: 200 },
  { role: "Operations (1)", count: 1, salary: 150 },
];

const COMPETITORS = [
  {
    name: "Uniswap",
    swap: 5,
    nft: 2,
    launchpad: 0,
    governance: 4,
    portfolio: 2,
    crossModule: 1,
  },
  {
    name: "OpenSea",
    swap: 0,
    nft: 5,
    launchpad: 1,
    governance: 0,
    portfolio: 2,
    crossModule: 0,
  },
  {
    name: "Phantom",
    swap: 4,
    nft: 4,
    launchpad: 0,
    governance: 0,
    portfolio: 5,
    crossModule: 2,
  },
  {
    name: "Coinbase Wallet",
    swap: 3,
    nft: 3,
    launchpad: 1,
    governance: 0,
    portfolio: 4,
    crossModule: 1,
  },
  {
    name: "Defiance Hub",
    swap: 4,
    nft: 4,
    launchpad: 5,
    governance: 5,
    portfolio: 5,
    crossModule: 5,
  },
];

const TOTAL_SLIDES = 14;

/* ─── Page ───────────────────────────────────────────────────────────── */

export function DeckPage() {
  const [navOpen, setNavOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);

  // Track currently visible slide
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.find((e) => e.isIntersecting);
        if (visible) {
          const num = Number(
            (visible.target as HTMLElement).dataset.slide ?? "1",
          );
          setCurrentSlide(num);
        }
      },
      { threshold: 0.5 },
    );
    document
      .querySelectorAll<HTMLElement>(".deck-slide")
      .forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // Keyboard nav
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement) return;
      if (e.key === "ArrowDown" || e.key === "ArrowRight" || e.key === "PageDown") {
        e.preventDefault();
        goTo(Math.min(currentSlide + 1, TOTAL_SLIDES));
      }
      if (e.key === "ArrowUp" || e.key === "ArrowLeft" || e.key === "PageUp") {
        e.preventDefault();
        goTo(Math.max(currentSlide - 1, 1));
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [currentSlide]);

  const goTo = (n: number) => {
    document
      .querySelector(`[data-slide="${n}"]`)
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
    setNavOpen(false);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div ref={containerRef} className="deck-root relative">
      {/* Floating controls — hidden in print */}
      <div className="fixed top-4 right-4 z-50 flex items-center gap-2 print:hidden">
        <button
          type="button"
          onClick={() => setNavOpen((v) => !v)}
          className="surface rounded-md px-3 h-9 text-[12px] font-medium tabular flex items-center gap-2"
          aria-label="Slide navigator"
        >
          {String(currentSlide).padStart(2, "0")} / {String(TOTAL_SLIDES).padStart(2, "0")}
          <ChevronDown
            className={cn(
              "h-3 w-3 transition-transform",
              navOpen && "rotate-180",
            )}
          />
        </button>
        <Button
          variant="primary"
          size="sm"
          onClick={handlePrint}
          className="h-9"
        >
          <Printer className="h-3.5 w-3.5" />
          Save as PDF
        </Button>
      </div>

      {/* Prev/next navigation */}
      <div className="fixed left-4 top-1/2 -translate-y-1/2 z-40 flex flex-col gap-2 print:hidden">
        <button
          type="button"
          onClick={() => goTo(Math.max(currentSlide - 1, 1))}
          disabled={currentSlide === 1}
          className="surface rounded-md h-9 w-9 grid place-items-center text-muted-foreground hover:text-foreground disabled:opacity-30"
          aria-label="Previous"
        >
          <ChevronUp className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => goTo(Math.min(currentSlide + 1, TOTAL_SLIDES))}
          disabled={currentSlide === TOTAL_SLIDES}
          className="surface rounded-md h-9 w-9 grid place-items-center text-muted-foreground hover:text-foreground disabled:opacity-30"
          aria-label="Next"
        >
          <ChevronDown className="h-4 w-4" />
        </button>
      </div>

      {/* Slide-list overlay */}
      <AnimatePresence>
        {navOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-background/85 backdrop-blur-md print:hidden"
            onClick={() => setNavOpen(false)}
          >
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              className="container-page pt-20 pb-10"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <p className="font-display text-2xl font-semibold tracking-tight">
                  Pitch deck · 14 slides
                </p>
                <button
                  onClick={() => setNavOpen(false)}
                  className="h-9 w-9 grid place-items-center rounded-md hover:bg-secondary"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {SLIDE_TITLES.map((title, i) => {
                  const num = i + 1;
                  return (
                    <button
                      key={num}
                      onClick={() => goTo(num)}
                      className={cn(
                        "surface rounded-lg p-4 text-left hover:bg-elevated transition-colors",
                        currentSlide === num &&
                          "ring-1 ring-primary border-primary/50",
                      )}
                    >
                      <p className="font-mono text-[10px] text-muted-foreground tabular">
                        {String(num).padStart(2, "0")}
                      </p>
                      <p className="font-display font-semibold mt-2 leading-tight text-sm">
                        {title}
                      </p>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── Slides ────────────────────────────────────────────────── */}

      {/* 01: Title */}
      <Slide num={1} total={TOTAL_SLIDES} bg="dark">
        <div className="flex-1 flex flex-col justify-center">
          <Badge variant="default" className="self-start mb-8">
            Series A · 2026
          </Badge>
          <h1 className="display-1 text-[clamp(56px,9vw,160px)] text-balance">
            Defiance
            <br />
            <span className="font-serif italic font-normal text-muted-foreground">
              Hub.
            </span>
          </h1>
          <p className="mt-8 text-xl md:text-2xl text-muted-foreground max-w-2xl text-balance">
            One wallet. Six modules. The unified front door to on-chain finance,
            culture, and gaming.
          </p>
          <div className="mt-12 grid grid-cols-3 gap-8 max-w-2xl">
            <div>
              <p className="eyebrow">Raising</p>
              <p className="font-display text-3xl font-semibold tabular mt-2">$20M</p>
            </div>
            <div>
              <p className="eyebrow">Pre-money</p>
              <p className="font-display text-3xl font-semibold tabular mt-2">$80M</p>
            </div>
            <div>
              <p className="eyebrow">Committed</p>
              <p className="font-display text-3xl font-semibold tabular mt-2">$4M</p>
            </div>
          </div>
        </div>
      </Slide>

      {/* 02: Problem */}
      <Slide num={2} total={TOTAL_SLIDES} eyebrow="The problem">
        <h2 className="display-1 text-[clamp(48px,7vw,96px)] text-balance">
          Web3 is{" "}
          <span className="font-serif italic font-normal text-muted-foreground">
            fragmented.
          </span>
        </h2>
        <p className="mt-6 text-xl text-muted-foreground max-w-3xl text-balance">
          Users today juggle 12+ apps to do basic Web3 work. Each is excellent
          in its vertical — and a dead-end at the boundary.
        </p>
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-5 flex-1">
          <div className="surface rounded-xl p-6">
            <p className="font-display text-5xl font-semibold tabular tracking-tight">
              8.4
            </p>
            <p className="mt-3 font-display font-semibold">
              wallets per active user
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Each new chain or vertical means another app, another seed phrase, another inventory.
            </p>
          </div>
          <div className="surface rounded-xl p-6">
            <p className="font-display text-5xl font-semibold tabular tracking-tight">
              14
            </p>
            <p className="mt-3 font-display font-semibold">
              dapps used per week
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Trade on Uniswap, browse OpenSea, vote on Snapshot, stake on Lido — none of them know about each other.
            </p>
          </div>
          <div className="surface rounded-xl p-6">
            <p className="font-display text-5xl font-semibold tabular tracking-tight">
              0%
            </p>
            <p className="mt-3 font-display font-semibold">
              cross-vertical value
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Your gaming inventory can't collateralize a loan. Your NFT royalties can't auto-compound. The flywheel doesn't exist.
            </p>
          </div>
        </div>
      </Slide>

      {/* 03: Solution */}
      <Slide num={3} total={TOTAL_SLIDES} eyebrow="The solution">
        <h2 className="display-1 text-[clamp(48px,7vw,96px)] text-balance">
          One wallet,
          <br />
          <span className="font-serif italic font-normal text-muted-foreground">
            six modules.
          </span>
        </h2>
        <p className="mt-6 text-xl text-muted-foreground max-w-3xl text-balance">
          Defiance is the unified Web3 hub: trade tokens, mint and trade NFTs,
          launch projects, govern the DAO, play earn-enabled games — all from
          one account, with one token aligning every incentive.
        </p>
        <div className="mt-10 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 flex-1">
          {[
            { n: "01", t: "Trade", d: "Smart-routed swaps" },
            { n: "02", t: "Collect", d: "NFT marketplace" },
            { n: "03", t: "Launch", d: "Vetted IDOs" },
            { n: "04", t: "Govern", d: "On-chain DAO" },
            { n: "05", t: "Play", d: "Asset-owning games" },
            { n: "06", t: "Track", d: "Unified portfolio" },
          ].map((m) => (
            <div key={m.n} className="surface rounded-xl p-5">
              <p className="font-mono text-[11px] text-muted-foreground tabular">
                {m.n}
              </p>
              <p className="mt-4 font-display text-xl font-semibold tracking-tight">
                {m.t}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">{m.d}</p>
            </div>
          ))}
        </div>
      </Slide>

      {/* 04: Product */}
      <Slide num={4} total={TOTAL_SLIDES} eyebrow="Product · live today">
        <h2 className="display-1 text-[clamp(40px,6vw,80px)] text-balance">
          Built for the
          <br />
          <span className="font-serif italic font-normal text-muted-foreground">
            on-chain economy.
          </span>
        </h2>
        <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-8 flex-1">
          <div className="space-y-4">
            <div className="surface rounded-xl p-5">
              <p className="font-display font-semibold">Swap widget</p>
              <p className="text-sm text-muted-foreground mt-1">
                9 tokens, 6 chains, smart routing, sub-second quotes. 0.05% fee, 50% to stakers.
              </p>
            </div>
            <div className="surface rounded-xl p-5">
              <p className="font-display font-semibold">Portfolio</p>
              <p className="text-sm text-muted-foreground mt-1">
                Tokens + NFTs + LP positions + voting power, unified across every chain. Real-time.
              </p>
            </div>
            <div className="surface rounded-xl p-5">
              <p className="font-display font-semibold">NFT marketplace</p>
              <p className="text-sm text-muted-foreground mt-1">
                Live data via aggregated marketplace API. Curated drops, on-chain royalties, real provenance.
              </p>
            </div>
            <div className="surface rounded-xl p-5">
              <p className="font-display font-semibold">Governance + Launchpad</p>
              <p className="text-sm text-muted-foreground mt-1">
                Token-weighted voting with conviction multipliers. Stake-to-qualify IDOs.
              </p>
            </div>
          </div>
          <div className="surface rounded-xl p-6 flex flex-col justify-center">
            <div className="text-center">
              <Badge variant="success" className="self-start mb-4">
                <span className="h-1.5 w-1.5 rounded-full bg-current animate-pulse" />
                Live now
              </Badge>
              <p className="font-display text-2xl font-semibold tracking-tight">
                Try it yourself
              </p>
              <p className="text-sm text-muted-foreground mt-2 max-w-xs mx-auto">
                The product is live in the browser. Connect a wallet on testnet and execute a real swap end-to-end.
              </p>
              <p className="mt-6 font-mono text-xs tabular text-muted-foreground">
                defiancehub.xyz
              </p>
            </div>
          </div>
        </div>
      </Slide>

      {/* 05: Market */}
      <Slide num={5} total={TOTAL_SLIDES} eyebrow="Market opportunity">
        <h2 className="display-1 text-[clamp(40px,6vw,80px)] text-balance">
          A $200B+ market{" "}
          <span className="font-serif italic font-normal text-muted-foreground">
            still pre-aggregator.
          </span>
        </h2>
        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-5 flex-1 items-stretch">
          <div className="surface rounded-2xl p-7 flex flex-col">
            <p className="eyebrow">TAM</p>
            <p className="font-display text-5xl font-semibold tabular tracking-tight mt-3">
              $3T
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              Total crypto market cap. The user base of every wallet, exchange, and dapp combined.
            </p>
          </div>
          <div className="surface rounded-2xl p-7 flex flex-col">
            <p className="eyebrow">SAM</p>
            <p className="font-display text-5xl font-semibold tabular tracking-tight mt-3">
              $200B
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              Annual on-chain volume across DeFi swaps, NFT trading, and on-chain governance — the activity an aggregator captures.
            </p>
          </div>
          <div className="surface rounded-2xl p-7 flex flex-col">
            <p className="eyebrow">SOM (3-year)</p>
            <p className="font-display text-5xl font-semibold tabular tracking-tight mt-3">
              $20B
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              ~10% of cross-chain trading volume. At a 0.05% fee, this is $10M/yr in protocol revenue.
            </p>
          </div>
        </div>
        <p className="mt-8 text-sm text-muted-foreground max-w-3xl">
          <span className="text-foreground font-medium">Why now:</span>
          {" "}Account abstraction (ERC-4337), L2 stack maturity (Base, Arbitrum), and on-chain wallets crossing 50M MAU make a unified hub finally technically and culturally feasible.
        </p>
      </Slide>

      {/* 06: Business model */}
      <Slide num={6} total={TOTAL_SLIDES} eyebrow="Business model">
        <h2 className="display-1 text-[clamp(40px,6vw,80px)] text-balance">
          Revenue from{" "}
          <span className="font-serif italic font-normal text-muted-foreground">
            every basis point.
          </span>
        </h2>
        <p className="mt-6 text-xl text-muted-foreground max-w-3xl text-balance">
          Each module has its own fee, all flow back to the same DEFY treasury and stakers. No off-chain leakage.
        </p>
        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-5 flex-1">
          <div className="surface rounded-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-border">
              <p className="font-display font-semibold">Fee sources</p>
            </div>
            {[
              { source: "Swap router", rate: "0.05%", note: "On every trade" },
              { source: "NFT marketplace", rate: "2.5%", note: "Per sale" },
              { source: "Launchpad", rate: "1.0%", note: "Of raise" },
              { source: "Cross-chain bridge", rate: "0.10%", note: "Per bridged volume" },
              { source: "Premium tiers (planned)", rate: "$10–50/mo", note: "Power-user features" },
            ].map((r) => (
              <div
                key={r.source}
                className="flex items-center justify-between px-6 py-4 border-b border-border last:border-b-0 hover:bg-elevated transition-colors"
              >
                <div>
                  <p className="font-medium text-sm">{r.source}</p>
                  <p className="text-[11px] text-muted-foreground tabular">
                    {r.note}
                  </p>
                </div>
                <p className="font-display font-semibold text-primary tabular">
                  {r.rate}
                </p>
              </div>
            ))}
          </div>
          <div className="surface rounded-2xl p-6 flex flex-col">
            <p className="font-display font-semibold mb-2">Fee distribution</p>
            <p className="text-sm text-muted-foreground mb-6">
              100% accrues to DEFY holders + DAO. Zero leakage to a private entity.
            </p>
            <div className="space-y-4 flex-1">
              {[
                { label: "DEFY stakers", pct: 50, color: "hsl(75 100% 56%)" },
                { label: "Buyback + burn", pct: 25, color: "hsl(38 95% 58%)" },
                { label: "DAO treasury", pct: 20, color: "hsl(188 90% 52%)" },
                { label: "Insurance reserve", pct: 5, color: "hsl(0 0% 40%)" },
              ].map((s) => (
                <div key={s.label}>
                  <div className="flex items-center justify-between text-sm mb-1.5">
                    <span className="font-medium">{s.label}</span>
                    <span className="font-display font-semibold tabular">
                      {s.pct}%
                    </span>
                  </div>
                  <div className="h-2 bg-secondary rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${s.pct}%`, background: s.color }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 surface-muted rounded-md p-3 flex items-start gap-2">
              <Flame className="h-4 w-4 text-[hsl(var(--warn))] shrink-0 mt-0.5" />
              <p className="text-[11px] text-muted-foreground">
                As volume grows, supply shrinks. Currently burning ~820K DEFY/month.
              </p>
            </div>
          </div>
        </div>
      </Slide>

      {/* 07: Traction */}
      <Slide num={7} total={TOTAL_SLIDES} eyebrow="Traction">
        <h2 className="display-1 text-[clamp(40px,6vw,80px)] text-balance">
          From 0 to{" "}
          <span className="font-serif italic font-normal text-muted-foreground">
            $41M TVL in 12 months.
          </span>
        </h2>
        <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="surface rounded-xl p-5">
            <p className="eyebrow">TVL</p>
            <p className="font-display text-3xl font-semibold tabular mt-2">
              $41.8M
            </p>
            <p className="text-[11px] text-[hsl(var(--success))] tabular mt-1">
              +42.8% 30d
            </p>
          </div>
          <div className="surface rounded-xl p-5">
            <p className="eyebrow">Users</p>
            <p className="font-display text-3xl font-semibold tabular mt-2">
              184K
            </p>
            <p className="text-[11px] text-[hsl(var(--success))] tabular mt-1">
              +34.6% 30d
            </p>
          </div>
          <div className="surface rounded-xl p-5">
            <p className="eyebrow">30d revenue</p>
            <p className="font-display text-3xl font-semibold tabular mt-2">
              $4.31M
            </p>
            <p className="text-[11px] text-[hsl(var(--success))] tabular mt-1">
              +62.1% 30d
            </p>
          </div>
          <div className="surface rounded-xl p-5">
            <p className="eyebrow">Chains</p>
            <p className="font-display text-3xl font-semibold tabular mt-2">
              6
            </p>
            <p className="text-[11px] text-muted-foreground tabular mt-1">
              ETH · ARB · BASE · OP · MATIC · BNB
            </p>
          </div>
        </div>
        <div className="mt-8 surface rounded-2xl overflow-hidden flex-1">
          <div className="p-6 border-b border-border flex items-center justify-between flex-wrap gap-3">
            <div>
              <p className="eyebrow eyebrow-dot mb-1">12-month trajectory</p>
              <p className="font-display text-xl font-semibold tracking-tight">
                Onboarded users
              </p>
            </div>
            <Badge variant="success">+1,540% YoY</Badge>
          </div>
          <div className="h-56 p-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={PROJECTIONS.slice(0, 1).concat(PROJECTIONS).slice(0, 5)}>
                <defs>
                  <linearGradient id="trc" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => formatNumber(v, { notation: "compact" })} />
                <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }} />
                <Area type="monotone" dataKey="users" stroke="hsl(var(--primary))" strokeWidth={2.5} fill="url(#trc)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </Slide>

      {/* 08: Competition */}
      <Slide num={8} total={TOTAL_SLIDES} eyebrow="Competitive landscape">
        <h2 className="display-1 text-[clamp(40px,6vw,80px)] text-balance">
          Each is great in
          <br />
          <span className="font-serif italic font-normal text-muted-foreground">
            one vertical. We span six.
          </span>
        </h2>
        <p className="mt-6 text-lg text-muted-foreground max-w-3xl text-balance">
          The point-solution leaders are 9–10/10 in their lane. We&apos;re an 8/10 in 6 lanes — and the integration value none of them can match.
        </p>
        <div className="mt-10 surface rounded-2xl overflow-hidden flex-1">
          <div className="grid grid-cols-7 gap-2 px-6 py-3 text-[11px] uppercase tracking-widest text-muted-foreground border-b border-border">
            <div className="col-span-2">Product</div>
            <div className="text-center">Swap</div>
            <div className="text-center">NFT</div>
            <div className="text-center">Launch</div>
            <div className="text-center">DAO</div>
            <div className="text-center">Cross</div>
          </div>
          {COMPETITORS.map((c) => {
            const isUs = c.name === "Defiance Hub";
            const dot = (n: number) =>
              n === 0
                ? "—"
                : "●●●●●".slice(0, n) + "○○○○○".slice(0, 5 - n);
            return (
              <div
                key={c.name}
                className={cn(
                  "grid grid-cols-7 gap-2 px-6 py-4 text-sm border-b border-border last:border-b-0",
                  isUs && "bg-primary/5",
                )}
              >
                <div className="col-span-2 flex items-center gap-2">
                  <span className={cn("font-medium", isUs && "text-primary")}>
                    {c.name}
                  </span>
                  {isUs && <Badge variant="default" className="text-[10px]">us</Badge>}
                </div>
                <div className={cn("text-center font-mono text-[12px] tabular", isUs && "text-primary")}>
                  {dot(c.swap)}
                </div>
                <div className={cn("text-center font-mono text-[12px] tabular", isUs && "text-primary")}>
                  {dot(c.nft)}
                </div>
                <div className={cn("text-center font-mono text-[12px] tabular", isUs && "text-primary")}>
                  {dot(c.launchpad)}
                </div>
                <div className={cn("text-center font-mono text-[12px] tabular", isUs && "text-primary")}>
                  {dot(c.governance)}
                </div>
                <div className={cn("text-center font-mono text-[12px] tabular", isUs && "text-primary")}>
                  {dot(c.crossModule)}
                </div>
              </div>
            );
          })}
        </div>
        <p className="mt-6 text-sm text-muted-foreground max-w-3xl">
          <span className="text-foreground font-medium">The moat:</span>{" "}
          a flywheel that only emerges when all six modules share the same wallet, token, and incentive structure.
        </p>
      </Slide>

      {/* 09: Flywheel */}
      <Slide num={9} total={TOTAL_SLIDES} eyebrow="The flywheel">
        <h2 className="display-1 text-[clamp(40px,6vw,80px)] text-balance">
          Six loops,
          <br />
          <span className="font-serif italic font-normal text-muted-foreground">
            one accelerating wheel.
          </span>
        </h2>
        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-8 flex-1 items-center">
          <div className="space-y-4">
            {[
              { num: "01", action: "User stakes DEFY", outcome: "Earns 2.5× LP boost in DeFi" },
              { num: "02", action: "User provides liquidity", outcome: "Earns more DEFY + 50% of fees" },
              { num: "03", action: "User qualifies for Launchpad tier", outcome: "Buys IDO at discount" },
              { num: "04", action: "User holds new IDO token", outcome: "Trades it on our DEX" },
              { num: "05", action: "Trade generates fees", outcome: "50% buyback-burn DEFY" },
              { num: "06", action: "DEFY supply shrinks", outcome: "Stake yield rises → loop continues" },
            ].map((step) => (
              <div key={step.num} className="surface rounded-lg p-4 flex items-center gap-4">
                <span className="font-mono text-[11px] text-muted-foreground tabular w-6 shrink-0">
                  {step.num}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm">{step.action}</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    → {step.outcome}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <div className="surface rounded-2xl p-8 text-center">
            <p className="eyebrow eyebrow-dot mb-4 justify-center inline-flex">Compounding effect</p>
            <p className="font-display text-7xl font-semibold tabular tracking-tight">
              2.4×
            </p>
            <p className="mt-3 font-display font-semibold">
              LTV multiplier
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              A user who touches 3+ modules generates 2.4× the lifetime fees of a single-module user.
            </p>
            <p className="mt-8 text-[11px] tabular text-muted-foreground">
              Source: 90-day cohort analysis · Mar–May 2026
            </p>
          </div>
        </div>
      </Slide>

      {/* 10: Roadmap */}
      <Slide num={10} total={TOTAL_SLIDES} eyebrow="Roadmap">
        <h2 className="display-1 text-[clamp(40px,6vw,80px)] text-balance">
          The next{" "}
          <span className="font-serif italic font-normal text-muted-foreground">
            18 months.
          </span>
        </h2>
        <div className="mt-10 surface rounded-2xl overflow-hidden flex-1">
          {[
            { q: "Q3 2025", title: "Foundation", status: "shipped", items: ["Smart contracts v1 deployed", "Trail of Bits + OZ audits", "Mainnet swap router"] },
            { q: "Q4 2025", title: "Multi-chain", status: "active", items: ["Live on 6 networks", "Cross-chain bridge", "DEFY public sale + LP launch"] },
            { q: "Q1 2026", title: "Marketplace + Launchpad", status: "planned", items: ["NFT marketplace v1", "Stake-to-qualify IDOs", "Mobile PWA"] },
            { q: "Q2 2026", title: "Gaming SDK", status: "planned", items: ["Cross-game inventory standard", "First 3 partner games", "Solana via account abstraction"] },
            { q: "Q3 2026", title: "Protocol-as-a-service", status: "planned", items: ["White-label hub deployments", "Order-flow auctions", "Top-3 CEX listing"] },
          ].map((p) => {
            const Icon = p.status === "shipped" ? CheckCircle2 : p.status === "active" ? TrendingUp : Circle;
            return (
              <div key={p.q} className="grid grid-cols-12 gap-4 px-6 py-5 border-b border-border last:border-b-0">
                <div className="col-span-3 flex items-start gap-3">
                  <Icon className={cn(
                    "h-5 w-5 mt-0.5 shrink-0",
                    p.status === "shipped" && "text-[hsl(var(--success))]",
                    p.status === "active" && "text-primary",
                    p.status === "planned" && "text-muted-foreground/50",
                  )} />
                  <div>
                    <p className="font-display font-semibold">{p.title}</p>
                    <p className="text-[11px] text-muted-foreground font-mono tabular">{p.q}</p>
                  </div>
                </div>
                <div className="col-span-9 flex items-center gap-3 text-sm text-muted-foreground flex-wrap">
                  {p.items.map((i) => (
                    <span key={i} className="surface-muted rounded-full px-2.5 py-0.5 text-[11px]">
                      {i}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </Slide>

      {/* 11: Team */}
      <Slide num={11} total={TOTAL_SLIDES} eyebrow="Team">
        <h2 className="display-1 text-[clamp(40px,6vw,80px)] text-balance">
          Operators who&apos;ve
          <br />
          <span className="font-serif italic font-normal text-muted-foreground">
            shipped before.
          </span>
        </h2>
        <div className="mt-10 grid grid-cols-2 md:grid-cols-3 gap-4 flex-1">
          {[
            { name: "Ada Stein", role: "CEO", bio: "Founding PM at top-3 L2. Shipped wallets to 4M MAU." },
            { name: "Kenji Park", role: "CTO", bio: "Ex-staff eng at major DEX. Built routing for $30B+ volume." },
            { name: "Maya Okonjo", role: "Head of Product", bio: "Led growth at unicorn fintech. 12M consumer wallets." },
            { name: "Lukas Brandt", role: "Head of Protocol", bio: "PhD in formal verification. Audited tier-1 lending protocols." },
            { name: "Sara Lin", role: "Head of Design", bio: "Design lead at YC-backed Web3 apps." },
            { name: "Daniel Voss", role: "Head of Growth", bio: "Scaled top NFT marketplace 10K → 800K traders." },
          ].map((m) => (
            <div key={m.name} className="surface rounded-xl p-5">
              <img
                src={`https://api.dicebear.com/7.x/personas/svg?seed=${encodeURIComponent(m.name)}&backgroundColor=b6e3f4,d1d4f9,c0aede,ffd5dc,ffdfbf`}
                alt={m.name}
                className="h-12 w-12 rounded-full bg-secondary mb-4"
              />
              <p className="font-display font-semibold tracking-tight">{m.name}</p>
              <p className="text-[11px] uppercase tracking-widest text-muted-foreground font-mono mt-0.5">
                {m.role}
              </p>
              <p className="mt-3 text-xs text-muted-foreground leading-relaxed">{m.bio}</p>
            </div>
          ))}
        </div>
        <div className="mt-8 surface rounded-xl p-5 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <p className="eyebrow">FTEs</p>
            <p className="font-display text-xl font-semibold tabular mt-1">14</p>
          </div>
          <div>
            <p className="eyebrow">Combined exp</p>
            <p className="font-display text-xl font-semibold tabular mt-1">87 yrs</p>
          </div>
          <div>
            <p className="eyebrow">Prior exits</p>
            <p className="font-display text-xl font-semibold tabular mt-1">3</p>
          </div>
          <div>
            <p className="eyebrow">Advisors</p>
            <p className="font-display text-xl font-semibold tabular mt-1">5</p>
          </div>
        </div>
      </Slide>

      {/* 12: Use of funds */}
      <Slide num={12} total={TOTAL_SLIDES} eyebrow="Use of funds · 18-month plan">
        <h2 className="display-1 text-[clamp(40px,6vw,80px)] text-balance">
          $20M for
          <br />
          <span className="font-serif italic font-normal text-muted-foreground">
            18 months of runway.
          </span>
        </h2>
        <div className="mt-10 grid grid-cols-1 lg:grid-cols-12 gap-5 flex-1">
          <div className="lg:col-span-7 surface rounded-2xl p-6">
            <p className="font-display font-semibold mb-6">Allocation</p>
            <div className="space-y-3">
              {USE_OF_FUNDS.map((u) => {
                const pct = (u.amount / TOTAL_RAISE) * 100;
                return (
                  <div key={u.label}>
                    <div className="flex items-center justify-between text-sm mb-1.5">
                      <span className="flex items-center gap-2">
                        <span
                          className="h-2.5 w-2.5 rounded-sm"
                          style={{ background: u.color }}
                        />
                        <span className="font-medium">{u.label}</span>
                      </span>
                      <span className="font-display font-semibold tabular">
                        {formatCurrency(u.amount, { notation: "compact" })}
                        <span className="text-muted-foreground text-xs ml-2 tabular">
                          {pct.toFixed(0)}%
                        </span>
                      </span>
                    </div>
                    <div className="h-2 bg-secondary rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{ width: `${pct}%`, background: u.color }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="lg:col-span-5 surface rounded-2xl p-6">
            <p className="font-display font-semibold mb-2">Burn rate</p>
            <p className="font-display text-4xl font-semibold tabular tracking-tight">
              $1.1M
              <span className="text-base text-muted-foreground ml-1">/mo</span>
            </p>
            <p className="text-[11px] text-muted-foreground tabular mt-2">
              Avg over 18 months · scales with hires
            </p>
            <hr className="my-6 border-border" />
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Team (14 FTE)</span>
                <span className="font-medium tabular">$5.0M</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Liquidity bootstrap</span>
                <span className="font-medium tabular">$3.5M</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Marketing / BD</span>
                <span className="font-medium tabular">$2.5M</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Audits + bounty</span>
                <span className="font-medium tabular">$2.0M</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Infra + tools</span>
                <span className="font-medium tabular">$1.8M</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Legal + compliance</span>
                <span className="font-medium tabular">$1.5M</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Reserve (15%)</span>
                <span className="font-medium tabular">$3.7M</span>
              </div>
            </div>
            <hr className="my-6 border-border" />
            <div className="surface-muted rounded-md p-3">
              <p className="text-[11px] text-muted-foreground">Path to profitability</p>
              <p className="text-sm mt-1">
                Currently $4.3M monthly fees → 25% to treasury = <span className="text-foreground font-medium">$1.07M/mo</span>. Cashflow positive at current scale; 18-mo runway funds aggressive expansion.
              </p>
            </div>
          </div>
        </div>
      </Slide>

      {/* 13: The ask */}
      <Slide num={13} total={TOTAL_SLIDES} eyebrow="The ask" bg="primary">
        <h2 className="display-1 text-[clamp(48px,7vw,108px)] text-balance text-primary-foreground">
          $20M Series A
        </h2>
        <p className="mt-6 text-xl text-primary-foreground/80 max-w-3xl text-balance">
          $80M pre-money · $4M committed by Paradigm (lead) · open to right partners for the remaining $16M.
        </p>
        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-5 flex-1">
          {[
            {
              t: "What you get",
              items: [
                "18% of fully-vested DEFY supply",
                "3-year linear vest, 6-month cliff",
                "Pro-rata in next round",
                "1 board observer seat",
              ],
            },
            {
              t: "What we deliver",
              items: [
                "Multi-chain marketplace + launchpad",
                "Mobile PWA + gaming SDK",
                "$DEFY listed on top-3 CEX",
                "$500M TVL, 1M users",
              ],
            },
            {
              t: "Our commitment",
              items: [
                "Quarterly investor reports",
                "Real-time public metrics dashboard",
                "100% open-source frontend",
                "Audited at every release",
              ],
            },
          ].map((c) => (
            <div
              key={c.t}
              className="rounded-2xl p-7 bg-primary-foreground/10 backdrop-blur-md border border-primary-foreground/15"
            >
              <p className="font-display font-semibold text-primary-foreground mb-4">
                {c.t}
              </p>
              <ul className="space-y-2.5">
                {c.items.map((i) => (
                  <li
                    key={i}
                    className="text-sm text-primary-foreground/85 flex items-start gap-2"
                  >
                    <CheckCircle2 className="h-3.5 w-3.5 text-primary-foreground shrink-0 mt-0.5" />
                    {i}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Slide>

      {/* 14: Contact */}
      <Slide num={14} total={TOTAL_SLIDES} bg="dark">
        <div className="flex-1 flex flex-col justify-center">
          <p className="eyebrow eyebrow-dot mb-6">Get in touch</p>
          <h2 className="display-1 text-[clamp(48px,8vw,128px)] text-balance">
            Let&apos;s build it{" "}
            <span className="font-serif italic font-normal text-muted-foreground">
              together.
            </span>
          </h2>
          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-5 max-w-3xl">
            <a
              href="mailto:investors@defiancehub.xyz"
              className="surface rounded-xl p-6 flex items-center gap-4 hover:bg-elevated transition-colors"
            >
              <div className="h-10 w-10 grid place-items-center rounded-md bg-primary text-primary-foreground">
                <Mail className="h-5 w-5" />
              </div>
              <div>
                <p className="font-display font-semibold">Request the deck</p>
                <p className="text-sm text-muted-foreground">
                  investors@defiancehub.xyz
                </p>
              </div>
            </a>
            <a
              href="#"
              className="surface rounded-xl p-6 flex items-center gap-4 hover:bg-elevated transition-colors"
            >
              <div className="h-10 w-10 grid place-items-center rounded-md bg-primary text-primary-foreground">
                <Calendar className="h-5 w-5" />
              </div>
              <div>
                <p className="font-display font-semibold">Book 30-min intro</p>
                <p className="text-sm text-muted-foreground">
                  cal.com/defiancehub
                </p>
              </div>
            </a>
          </div>
          <div className="mt-12 pt-12 border-t border-border flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Logo size={36} />
              <div>
                <p className="font-display font-semibold tracking-tight">
                  DEFIANCE/HUB
                </p>
                <p className="text-[11px] text-muted-foreground">
                  defiancehub.xyz · Series A · 2026
                </p>
              </div>
            </div>
            <Link
              to="/"
              className="text-[11px] text-muted-foreground hover:text-foreground"
            >
              ← Back to product
            </Link>
          </div>
        </div>
      </Slide>

      {/* Print styles — applied only when printing */}
      <style>{`
        @media print {
          @page {
            size: A4 landscape;
            margin: 0;
          }
          .deck-slide {
            min-height: auto;
            height: 100vh;
            page-break-after: always;
            break-after: page;
          }
          .deck-slide:last-child {
            page-break-after: avoid;
          }
          header, footer, nav, .deck-root > div:not(.deck-slide) {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}

const SLIDE_TITLES = [
  "Cover",
  "Problem",
  "Solution",
  "Product",
  "Market",
  "Business model",
  "Traction",
  "Competition",
  "The flywheel",
  "Roadmap",
  "Team",
  "Use of funds",
  "The ask",
  "Contact",
];

export default DeckPage;
