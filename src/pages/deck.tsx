import { useEffect, useState, useRef, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ResponsiveContainer,
  Tooltip,
  AreaChart,
  Area,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from "recharts";
import {
  Printer,
  X,
  ChevronUp,
  ChevronDown,
  TrendingUp,
  ShieldCheck,
  Zap,
  Flame,
  CheckCircle2,
  Circle,
  Mail,
  Calendar,
  Target,
  Sparkles,
  AlertTriangle,
  KeyRound,
  Building2,
  Layers,
  ArrowUpRight,
} from "lucide-react";
import { Link } from "react-router-dom";

import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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

/* ─── Data ────────────────────────────────────────────────────────────── */

const USE_OF_FUNDS = [
  { label: "Engineering & product", amount: 7_200_000, color: "hsl(75 100% 56%)" },
  { label: "GTM & partnerships", amount: 3_400_000, color: "hsl(322 95% 60%)" },
  { label: "Liquidity bootstrap", amount: 3_000_000, color: "hsl(188 90% 52%)" },
  { label: "Security & audits", amount: 1_800_000, color: "hsl(38 95% 58%)" },
  { label: "Operations & infra", amount: 1_400_000, color: "hsl(262 83% 62%)" },
  { label: "Legal & compliance", amount: 1_200_000, color: "hsl(145 70% 50%)" },
  { label: "Reserve / contingency", amount: 2_000_000, color: "hsl(0 0% 40%)" },
];
const TOTAL_RAISE = USE_OF_FUNDS.reduce((s, u) => s + u.amount, 0);

// users in thousands, tvl in $M, revenue in $M / month
const PROJECTIONS = [
  { month: "M0", users: 184, tvl: 41.8, revenue: 0.68 },
  { month: "M3", users: 280, tvl: 78, revenue: 1.10 },
  { month: "M6", users: 420, tvl: 145, revenue: 1.85 },
  { month: "M9", users: 600, tvl: 220, revenue: 2.80 },
  { month: "M12", users: 850, tvl: 320, revenue: 4.20 },
  { month: "M15", users: 1100, tvl: 440, revenue: 5.80 },
  { month: "M18", users: 1450, tvl: 580, revenue: 7.50 },
];

const COHORT_RETENTION = [
  { month: "M0", us: 100, benchmark: 100 },
  { month: "M1", us: 68, benchmark: 51 },
  { month: "M3", us: 47, benchmark: 28 },
  { month: "M6", us: 38, benchmark: 19 },
  { month: "M12", us: 31, benchmark: 12 },
];

const GTM_CHANNELS = [
  { channel: "Organic / SEO", share: 32, cac: 0, color: "hsl(75 100% 56%)" },
  { channel: "L2 partnerships", share: 24, cac: 4, color: "hsl(188 90% 52%)" },
  { channel: "Launchpad funnel", share: 18, cac: 2, color: "hsl(322 95% 60%)" },
  { channel: "Influencer / CT", share: 14, cac: 14, color: "hsl(38 95% 58%)" },
  { channel: "Paid social", share: 12, cac: 22, color: "hsl(262 83% 62%)" },
];
const BLENDED_CAC = GTM_CHANNELS.reduce(
  (s, c) => s + (c.share / 100) * c.cac,
  0,
); // ≈ $5.96

const COMPETITORS = [
  { name: "Zerion", lane: "Portfolio + multi-chain", gap: "No launchpad. No NFT marketplace. Thin DAO tooling." },
  { name: "Rabby", lane: "EVM wallet", gap: "No NFT, no launchpad. Ethereum-centric." },
  { name: "Phantom", lane: "Solana → multi-chain wallet", gap: "Solana-first. Weak DAO + launchpad." },
  { name: "Coinbase Wallet", lane: "Wallet + portfolio", gap: "Distribution. But no cross-module integration." },
  { name: "Jupiter", lane: "Solana DEX → super-app", gap: "Solana-only. Can't span EVM natively." },
  { name: "LI.FI / Jumper", lane: "Cross-chain swap UX", gap: "Pure swap. No wallet, portfolio, or governance." },
  { name: "1inch", lane: "DEX aggregation", gap: "Pure DEX. No other modules." },
];

const ROADMAP = [
  { q: "Q3 2026", title: "Foundation locked", status: "active", kpis: ["250K MAU", "$80M TVL", "$1.0M MRR"], items: ["Cross-chain swap v2", "Portfolio rebuild", "Audits: ToB + OZ + Spearbit"] },
  { q: "Q4 2026", title: "NFT + Launchpad live", status: "planned", kpis: ["400K MAU", "$150M TVL", "$1.8M MRR"], items: ["NFT marketplace v1", "Stake-to-qualify IDOs", "Mobile PWA"] },
  { q: "Q1 2027", title: "Mobile + DAO", status: "planned", kpis: ["600K MAU", "$250M TVL", "$3.0M MRR"], items: ["iOS + Android native", "On-chain governance v1", "Solana via 4337"] },
  { q: "Q2 2027", title: "Gaming + B2B", status: "planned", kpis: ["850K MAU", "$400M TVL", "$5.0M MRR"], items: ["Gaming SDK", "First 3 partner games", "White-label hub v1"] },
  { q: "Q3 2027", title: "Scale + listings", status: "planned", kpis: ["1.2M MAU", "$600M TVL", "$8.0M MRR"], items: ["Order-flow auctions", "B2B $2M+/qtr", "Top-3 CEX listing"] },
];

const TEAM = [
  { name: "Ada Stein", role: "CEO", bio: "Founding PM at top-3 L2 (shipped Bedrock to mainnet). Prior: Stripe payments. Wharton MBA." },
  { name: "Kenji Park", role: "CTO", bio: "Ex-Staff Eng, Uniswap Labs (v3 routing, $30B+ volume). Prior: Google Search infra. MIT EECS." },
  { name: "Maya Okonjo", role: "Head of Product", bio: "Ex-PM, Robinhood Crypto Wallet (shipped to 4M MAU). Prior: Stripe Issuing. Stanford GSB." },
  { name: "Lukas Brandt", role: "Head of Protocol", bio: "PhD formal verification, UCL. Audited Aave v3 + Compound III at OpenZeppelin." },
  { name: "Sara Lin", role: "Head of Design", bio: "Lead Designer, Phantom (2024 multi-chain rebrand). Prior: Linear, Stripe." },
  { name: "Daniel Voss", role: "Head of Growth", bio: "Scaled Magic Eden 50K → 1M traders. Prior: OpenSea growth, Series B exit." },
];

const RISKS = [
  {
    icon: ShieldCheck,
    label: "Smart contract",
    detail:
      "Trail of Bits + OpenZeppelin + Spearbit audited every release. $250K live Immunefi bounty. $5M insurance reserve from treasury.",
  },
  {
    icon: KeyRound,
    label: "Regulatory",
    detail:
      "Foundation in Switzerland (token), Cayman C-corp (equity). MiCA-ready. No US persons in token sale (Reg S). DEFY launched as utility, with SAFT path for institutions.",
  },
  {
    icon: Target,
    label: "Competitive",
    detail:
      "Incumbents can copy any single module. The cross-module data layer — stake → tier → IDO → trade → burn — compounds at the integration boundary, not the feature.",
  },
  {
    icon: Zap,
    label: "Execution",
    detail:
      "Lean team. 87 years combined experience, 3 prior exits. Roadmap is KPI-gated, not calendar-gated — each phase ships only when prior milestone metrics are hit.",
  },
];

const TOTAL_SLIDES = 18;

/* ─── Page ───────────────────────────────────────────────────────────── */

export function DeckPage() {
  const [navOpen, setNavOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);

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
      {/* Floating controls */}
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
                  Pitch deck · {TOTAL_SLIDES} slides
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

      {/* 01: Cover */}
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
            The cross-chain DeFi hub where your portfolio, swaps, and on-chain
            identity finally live in one place — and earn together.
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

      {/* 02: Why now */}
      <Slide num={2} total={TOTAL_SLIDES} eyebrow="Why now">
        <h2 className="display-1 text-[clamp(48px,7vw,96px)] text-balance">
          Three forces converged{" "}
          <span className="font-serif italic font-normal text-muted-foreground">
            in the last 18 months.
          </span>
        </h2>
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-5 flex-1">
          <div className="surface rounded-2xl p-7 flex flex-col">
            <div className="h-10 w-10 rounded-md bg-primary/10 grid place-items-center text-primary mb-5">
              <Sparkles className="h-5 w-5" />
            </div>
            <p className="font-display text-xl font-semibold tracking-tight">
              Smart accounts went mainstream
            </p>
            <p className="mt-3 text-sm text-muted-foreground">
              ERC-4337 deployments crossed 12M active accounts in 2025. Seedless
              onboarding, gasless first txns, and session keys are now table
              stakes — not roadmap.
            </p>
          </div>
          <div className="surface rounded-2xl p-7 flex flex-col">
            <div className="h-10 w-10 rounded-md bg-primary/10 grid place-items-center text-primary mb-5">
              <Layers className="h-5 w-5" />
            </div>
            <p className="font-display text-xl font-semibold tracking-tight">
              L2 stack hit critical mass
            </p>
            <p className="mt-3 text-sm text-muted-foreground">
              $90B+ total DeFi TVL, with Base / Arbitrum / Optimism each at $5B+.
              Users are stuck switching networks 6× per session. The cost of a
              unified hub finally exceeds the cost of building one.
            </p>
          </div>
          <div className="surface rounded-2xl p-7 flex flex-col">
            <div className="h-10 w-10 rounded-md bg-primary/10 grid place-items-center text-primary mb-5">
              <Building2 className="h-5 w-5" />
            </div>
            <p className="font-display text-xl font-semibold tracking-tight">
              Institutional capital arrived
            </p>
            <p className="mt-3 text-sm text-muted-foreground">
              MiCA in force, BlackRock BUIDL at $2B AUM, ETF AUM at $130B+.
              Sophisticated users want pro-grade tooling. The retail wallet UX
              of 2021 is now the wrong product.
            </p>
          </div>
        </div>
        <p className="mt-8 text-sm text-muted-foreground max-w-3xl">
          Source: DefiLlama (May 2026), Dune (Pimlico, Biconomy account-abstraction dashboards), Grayscale 2026 Outlook.
        </p>
      </Slide>

      {/* 03: Problem */}
      <Slide num={3} total={TOTAL_SLIDES} eyebrow="The problem">
        <h2 className="display-1 text-[clamp(48px,7vw,96px)] text-balance">
          Power users are{" "}
          <span className="font-serif italic font-normal text-muted-foreground">
            paying the integration tax.
          </span>
        </h2>
        <p className="mt-6 text-xl text-muted-foreground max-w-3xl text-balance">
          Crypto-native users still juggle 6+ apps to do one job. Each is excellent
          in its vertical — and a dead end at the boundary.
        </p>
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-5 flex-1">
          <div className="surface rounded-xl p-6">
            <p className="font-display text-5xl font-semibold tabular tracking-tight">
              6.2
            </p>
            <p className="mt-3 font-display font-semibold">
              dapps per active user
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Median active wallet touches Uniswap, OpenSea, Snapshot, Lido,
              a bridge, and a portfolio tracker monthly. None talk to each other.
            </p>
            <p className="mt-3 text-[11px] text-muted-foreground tabular">
              Source: Dune (May 2026, top 1% wallets, 30-day window)
            </p>
          </div>
          <div className="surface rounded-xl p-6">
            <p className="font-display text-5xl font-semibold tabular tracking-tight">
              42<span className="text-2xl">m</span>
            </p>
            <p className="mt-3 font-display font-semibold">
              average swap-to-stake friction
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Time to bridge funds, swap to LP token, stake into vault, and
              confirm position across 4 different UIs. Should be one transaction.
            </p>
            <p className="mt-3 text-[11px] text-muted-foreground tabular">
              Source: internal user-test cohort, n=42, Q1 2026
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
              Your IDO allocation can&apos;t auto-LP. Your NFT royalties can&apos;t auto-compound.
              Your governance stake can&apos;t boost your trading yield. The flywheel doesn&apos;t exist.
            </p>
          </div>
        </div>
      </Slide>

      {/* 04: Solution (wedge-first) */}
      <Slide num={4} total={TOTAL_SLIDES} eyebrow="The solution">
        <h2 className="display-1 text-[clamp(48px,7vw,96px)] text-balance">
          Win the wedge.{" "}
          <span className="font-serif italic font-normal text-muted-foreground">
            Earn the hub.
          </span>
        </h2>
        <p className="mt-6 text-xl text-muted-foreground max-w-3xl text-balance">
          We&apos;re not asking users to adopt six modules at once. We win one,
          earn the wallet relationship, then expand into the rest as native upsells.
        </p>
        <div className="mt-10 grid grid-cols-1 lg:grid-cols-12 gap-5 flex-1">
          {/* Wedge: 2 modules */}
          <div className="lg:col-span-6 grid grid-cols-2 gap-3">
            {[
              { n: "01", t: "Swap", d: "Cross-chain, smart-routed, sub-second quotes" },
              { n: "02", t: "Portfolio", d: "Tokens, NFTs, LPs, voting power — unified" },
            ].map((m) => (
              <div
                key={m.n}
                className="surface rounded-xl p-5 border-2 border-primary/40 bg-primary/5 flex flex-col"
              >
                <div className="flex items-center justify-between">
                  <p className="font-mono text-[11px] text-primary tabular">
                    {m.n}
                  </p>
                  <Badge variant="default" className="text-[10px]">
                    Wedge · live
                  </Badge>
                </div>
                <p className="mt-4 font-display text-xl font-semibold tracking-tight">
                  {m.t}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">{m.d}</p>
              </div>
            ))}
          </div>
          {/* Phase 2 modules */}
          <div className="lg:col-span-6 grid grid-cols-2 gap-3">
            {[
              { n: "03", t: "Launchpad", d: "Stake-to-qualify IDOs", q: "Q4 2026" },
              { n: "04", t: "NFT", d: "Aggregated marketplace", q: "Q4 2026" },
              { n: "05", t: "Governance", d: "On-chain DAO + conviction", q: "Q1 2027" },
              { n: "06", t: "Gaming", d: "Asset-owning game SDK", q: "Q2 2027" },
            ].map((m) => (
              <div key={m.n} className="surface rounded-xl p-5 flex flex-col">
                <div className="flex items-center justify-between">
                  <p className="font-mono text-[11px] text-muted-foreground tabular">
                    {m.n}
                  </p>
                  <span className="text-[10px] text-muted-foreground tabular font-mono">
                    {m.q}
                  </span>
                </div>
                <p className="mt-4 font-display text-xl font-semibold tracking-tight">
                  {m.t}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">{m.d}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-8 surface-muted rounded-xl p-5 flex items-start gap-4">
          <Target className="h-5 w-5 text-primary shrink-0 mt-0.5" />
          <div>
            <p className="font-display font-semibold">Why this wedge wins</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Cross-chain swap + portfolio is the only entry point that earns the
              wallet relationship from day 1, generates fee revenue immediately,
              and creates the data layer (every position, every counterparty) that
              makes Phase 2 modules 10× better at launch than any standalone competitor.
            </p>
          </div>
        </div>
      </Slide>

      {/* 05: Product */}
      <Slide num={5} total={TOTAL_SLIDES} eyebrow="Product · live today">
        <h2 className="display-1 text-[clamp(40px,6vw,80px)] text-balance">
          The wedge is{" "}
          <span className="font-serif italic font-normal text-muted-foreground">
            shipped, audited, paying.
          </span>
        </h2>
        <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-8 flex-1">
          <div className="space-y-4">
            <div className="surface rounded-xl p-5">
              <p className="font-display font-semibold">Smart-routed swap</p>
              <p className="text-sm text-muted-foreground mt-1">
                9 tokens, 6 chains, MEV-protected via CoW Protocol fallback.
                Sub-800ms quotes. 5bps front-end fee → company P&amp;L.
              </p>
            </div>
            <div className="surface rounded-xl p-5">
              <p className="font-display font-semibold">Unified portfolio</p>
              <p className="text-sm text-muted-foreground mt-1">
                Tokens + NFTs + LP positions + voting power, every chain, real-time.
                Indexed via our own Goldsky pipeline; no third-party dependency on
                the home page.
              </p>
            </div>
            <div className="surface rounded-xl p-5">
              <p className="font-display font-semibold">Account abstraction native</p>
              <p className="text-sm text-muted-foreground mt-1">
                Built on ERC-4337 from day one. Gasless first transaction,
                session keys, social recovery. Zero seed phrases shown to user.
              </p>
            </div>
            <div className="surface rounded-xl p-5">
              <p className="font-display font-semibold">Audited at every release</p>
              <p className="text-sm text-muted-foreground mt-1">
                Trail of Bits + OpenZeppelin + Spearbit on each major version.
                $250K live Immunefi bounty. Reports linked in data room.
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
                The product is live in your browser. Connect a wallet on testnet
                and execute a real cross-chain swap end-to-end in under a minute.
              </p>
              <div className="mt-6 inline-flex items-center gap-2 surface-muted rounded-md px-3 py-2 font-mono text-xs tabular text-muted-foreground">
                defiancehub.xyz
                <ArrowUpRight className="h-3 w-3" />
              </div>
              <p className="mt-6 text-[11px] text-muted-foreground">
                Live demo link + screen-share walkthrough on request.
              </p>
            </div>
          </div>
        </div>
      </Slide>

      {/* 06: Market */}
      <Slide num={6} total={TOTAL_SLIDES} eyebrow="Market · bottom-up">
        <h2 className="display-1 text-[clamp(40px,6vw,80px)] text-balance">
          $1.2B revenue pool,{" "}
          <span className="font-serif italic font-normal text-muted-foreground">
            still pre-aggregator.
          </span>
        </h2>
        <p className="mt-6 text-lg text-muted-foreground max-w-3xl text-balance">
          We size from the bottom up — wallets × engagement × take rate — not from
          the $3T headline.
        </p>
        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-5 flex-1 items-stretch">
          <div className="surface rounded-2xl p-7 flex flex-col">
            <p className="eyebrow">Total active wallets</p>
            <p className="font-display text-5xl font-semibold tabular tracking-tight mt-3">
              48M
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              Monthly active on-chain wallets across EVM + Solana, May 2026.
              <br />
              <span className="text-foreground/70">Source: Dune, Token Terminal</span>
            </p>
          </div>
          <div className="surface rounded-2xl p-7 flex flex-col">
            <p className="eyebrow">Annual fee pool</p>
            <p className="font-display text-5xl font-semibold tabular tracking-tight mt-3">
              $1.2B
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              Sum of swap fees ($740M) + NFT mkt fees ($210M) + bridge fees ($180M)
              + launchpad fees ($70M), trailing 12 months.
            </p>
          </div>
          <div className="surface rounded-2xl p-7 flex flex-col">
            <p className="eyebrow">Reachable in 5 yrs</p>
            <p className="font-display text-5xl font-semibold tabular tracking-tight mt-3">
              $120M
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              10% capture of the fee pool at our blended take. Implies 6M MAU
              and ~5% share of multi-chain swap volume.
            </p>
          </div>
        </div>
        <p className="mt-8 text-sm text-muted-foreground max-w-3xl">
          <span className="text-foreground font-medium">Comparable:</span>{" "}
          1inch ($380M lifetime fees), CoW Swap (~26% Ethereum DEX agg share),
          Jupiter ($700M+ daily Solana swap volume). Each captured 1–3% of
          their reachable pool. Our path is a 10% capture by spanning more verticals.
        </p>
      </Slide>

      {/* 07: Business model */}
      <Slide num={7} total={TOTAL_SLIDES} eyebrow="Business model">
        <h2 className="display-1 text-[clamp(40px,6vw,80px)] text-balance">
          Two revenue stacks.{" "}
          <span className="font-serif italic font-normal text-muted-foreground">
            One for the protocol. One for the company.
          </span>
        </h2>
        <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-5 flex-1">
          {/* Protocol stack */}
          <div className="surface rounded-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-border flex items-center justify-between">
              <div>
                <p className="font-display font-semibold">Protocol revenue</p>
                <p className="text-[11px] text-muted-foreground">
                  Flows to DEFY treasury + stakers
                </p>
              </div>
              <Badge variant="default">$8.2M ARR</Badge>
            </div>
            {[
              { source: "Swap router", rate: "5 bps", note: "On gross swap volume" },
              { source: "NFT marketplace", rate: "2.5%", note: "Per sale (Q4 2026)" },
              { source: "Launchpad", rate: "1.0%", note: "Of raise (Q4 2026)" },
              { source: "Cross-chain bridge", rate: "10 bps", note: "Per bridged volume" },
            ].map((r) => (
              <div
                key={r.source}
                className="flex items-center justify-between px-6 py-3.5 border-b border-border last:border-b-0"
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
            <div className="px-6 py-4 border-t border-border bg-elevated">
              <p className="text-[11px] text-muted-foreground mb-2">
                Protocol fee distribution
              </p>
              <div className="space-y-2">
                {[
                  { l: "DEFY stakers", p: 50 },
                  { l: "Buyback + burn", p: 25 },
                  { l: "DAO treasury", p: 20 },
                  { l: "Insurance reserve", p: 5 },
                ].map((s) => (
                  <div
                    key={s.l}
                    className="flex justify-between text-[12px] tabular"
                  >
                    <span className="text-muted-foreground">{s.l}</span>
                    <span className="font-medium">{s.p}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          {/* Company stack — the new thing */}
          <div className="surface rounded-2xl overflow-hidden border-2 border-primary/30">
            <div className="px-6 py-4 border-b border-border flex items-center justify-between bg-primary/5">
              <div>
                <p className="font-display font-semibold text-primary">
                  Company revenue
                </p>
                <p className="text-[11px] text-muted-foreground">
                  100% accrues to equity
                </p>
              </div>
              <Badge variant="default">$3.1M ARR</Badge>
            </div>
            {[
              {
                source: "Front-end take",
                rate: "20%",
                note: "Of every protocol fee, paid to the hosted UI",
              },
              {
                source: "Premium tier",
                rate: "$15/mo",
                note: "Power-user features (planned Q4 2026)",
              },
              {
                source: "White-label hub",
                rate: "$50K–500K",
                note: "Annual licensing for B2B (planned Q2 2027)",
              },
              {
                source: "Order-flow auctions",
                rate: "Variable",
                note: "Solver MEV rebates (planned Q3 2027)",
              },
            ].map((r) => (
              <div
                key={r.source}
                className="flex items-center justify-between px-6 py-3.5 border-b border-border last:border-b-0"
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
            <div className="px-6 py-4 border-t border-border bg-elevated">
              <p className="text-sm">
                <span className="font-display font-semibold">Why this matters:</span>{" "}
                <span className="text-muted-foreground">
                  Equity holders capture front-end take + B2B + premium directly.
                  Token holders capture protocol fees. Investors get exposure to both.
                </span>
              </p>
            </div>
          </div>
        </div>
      </Slide>

      {/* 08: Traction */}
      <Slide num={8} total={TOTAL_SLIDES} eyebrow="Traction">
        <h2 className="display-1 text-[clamp(40px,6vw,80px)] text-balance">
          Real revenue,{" "}
          <span className="font-serif italic font-normal text-muted-foreground">
            best-in-class retention.
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
            <p className="eyebrow">MAU</p>
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
              $682K
            </p>
            <p className="text-[11px] text-[hsl(var(--success))] tabular mt-1">
              +62.1% 30d
            </p>
          </div>
          <div className="surface rounded-xl p-5">
            <p className="eyebrow">Forward ARR</p>
            <p className="font-display text-3xl font-semibold tabular mt-2">
              $8.2M
            </p>
            <p className="text-[11px] text-muted-foreground tabular mt-1">
              Run-rate exit Q4 2026
            </p>
          </div>
        </div>
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-5 flex-1">
          <div className="surface rounded-2xl overflow-hidden">
            <div className="p-5 border-b border-border">
              <p className="eyebrow eyebrow-dot mb-1">12-month trajectory</p>
              <p className="font-display text-lg font-semibold tracking-tight">
                MAU + monthly revenue
              </p>
            </div>
            <div className="h-56 p-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={PROJECTIONS.slice(0, 5)}>
                  <defs>
                    <linearGradient id="trc" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="0%"
                        stopColor="hsl(var(--primary))"
                        stopOpacity={0.4}
                      />
                      <stop
                        offset="100%"
                        stopColor="hsl(var(--primary))"
                        stopOpacity={0}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="hsl(var(--border))"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="month"
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      background: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: 8,
                      fontSize: 12,
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="users"
                    name="MAU (K)"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2.5}
                    fill="url(#trc)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="surface rounded-2xl overflow-hidden">
            <div className="p-5 border-b border-border flex items-center justify-between">
              <div>
                <p className="eyebrow eyebrow-dot mb-1">Cohort retention</p>
                <p className="font-display text-lg font-semibold tracking-tight">
                  M0 cohort, % active
                </p>
              </div>
              <Badge variant="success">2.6× benchmark</Badge>
            </div>
            <div className="h-56 p-2">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={COHORT_RETENTION}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="hsl(var(--border))"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="month"
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(v) => `${v}%`}
                  />
                  <Tooltip
                    contentStyle={{
                      background: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: 8,
                      fontSize: 12,
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                  <Line
                    type="monotone"
                    dataKey="us"
                    name="Defiance Hub"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2.5}
                    dot={{ r: 4 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="benchmark"
                    name="Wallet benchmark"
                    stroke="hsl(var(--muted-foreground))"
                    strokeDasharray="4 4"
                    strokeWidth={2}
                    dot={{ r: 3 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
        <p className="mt-6 text-[11px] text-muted-foreground tabular">
          Cohort: users who first connected wallet Jan 2026 (n=12,400). Benchmark: median wallet retention from Token Terminal &amp; ratex.ai Wallet Wars 2025.
        </p>
      </Slide>

      {/* 09: GTM */}
      <Slide num={9} total={TOTAL_SLIDES} eyebrow="Go-to-market">
        <h2 className="display-1 text-[clamp(40px,6vw,80px)] text-balance">
          Five channels.{" "}
          <span className="font-serif italic font-normal text-muted-foreground">
            $5.96 blended CAC.
          </span>
        </h2>
        <div className="mt-10 grid grid-cols-1 lg:grid-cols-12 gap-5 flex-1">
          <div className="lg:col-span-7 surface rounded-2xl p-6">
            <p className="font-display font-semibold mb-2">
              Acquisition mix &amp; CAC
            </p>
            <p className="text-sm text-muted-foreground mb-6">
              74% of users come through channels with sub-$5 CAC. Paid social is
              capped at 12% — we protect quality.
            </p>
            <div className="space-y-3">
              {GTM_CHANNELS.map((c) => (
                <div key={c.channel}>
                  <div className="flex items-center justify-between text-sm mb-1.5">
                    <span className="flex items-center gap-2">
                      <span
                        className="h-2.5 w-2.5 rounded-sm"
                        style={{ background: c.color }}
                      />
                      <span className="font-medium">{c.channel}</span>
                    </span>
                    <span className="font-display font-semibold tabular text-xs">
                      {c.share}% mix · {c.cac === 0 ? "$0" : `$${c.cac}`} CAC
                    </span>
                  </div>
                  <div className="h-2 bg-secondary rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${c.share * 2.5}%`, background: c.color }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="lg:col-span-5 space-y-4">
            <div className="surface rounded-xl p-5">
              <p className="eyebrow">Blended CAC</p>
              <p className="font-display text-4xl font-semibold tabular mt-2">
                ${BLENDED_CAC.toFixed(2)}
              </p>
            </div>
            <div className="surface rounded-xl p-5">
              <p className="eyebrow">Avg ARPU (M0)</p>
              <p className="font-display text-4xl font-semibold tabular mt-2">
                $3.71<span className="text-base text-muted-foreground">/mo</span>
              </p>
            </div>
            <div className="surface rounded-xl p-5">
              <p className="eyebrow">Payback</p>
              <p className="font-display text-4xl font-semibold tabular mt-2">
                1.6<span className="text-base text-muted-foreground">mo</span>
              </p>
            </div>
            <div className="surface rounded-xl p-5">
              <p className="eyebrow">LTV : CAC (3-yr)</p>
              <p className="font-display text-4xl font-semibold tabular mt-2">
                7.4<span className="text-base text-muted-foreground">×</span>
              </p>
            </div>
          </div>
        </div>
        <p className="mt-6 text-sm text-muted-foreground max-w-3xl">
          <span className="text-foreground font-medium">The unlock:</span> our
          own Launchpad funnels new users into Swap + Portfolio at <span className="font-display font-medium text-foreground">$2 CAC</span> — we own the cheapest acquisition channel in crypto because we built it.
        </p>
      </Slide>

      {/* 10: Competition */}
      <Slide num={10} total={TOTAL_SLIDES} eyebrow="Competition">
        <h2 className="display-1 text-[clamp(40px,6vw,80px)] text-balance">
          Each is great in
          <br />
          <span className="font-serif italic font-normal text-muted-foreground">
            their lane. We span the gaps.
          </span>
        </h2>
        <p className="mt-6 text-base text-muted-foreground max-w-3xl">
          The point-solution leaders are 9–10/10 in their vertical. The integration
          value none of them can match is what we&apos;re selling.
        </p>
        <div className="mt-8 surface rounded-2xl overflow-hidden flex-1">
          <div className="grid grid-cols-12 gap-2 px-6 py-3 text-[11px] uppercase tracking-widest text-muted-foreground border-b border-border">
            <div className="col-span-3">Player</div>
            <div className="col-span-4">Their lane</div>
            <div className="col-span-5">The gap we exploit</div>
          </div>
          {COMPETITORS.map((c) => (
            <div
              key={c.name}
              className="grid grid-cols-12 gap-2 px-6 py-3.5 text-sm border-b border-border last:border-b-0 hover:bg-elevated/60 transition-colors"
            >
              <div className="col-span-3 font-medium">{c.name}</div>
              <div className="col-span-4 text-muted-foreground">{c.lane}</div>
              <div className="col-span-5 text-muted-foreground">{c.gap}</div>
            </div>
          ))}
          <div className="grid grid-cols-12 gap-2 px-6 py-4 text-sm bg-primary/10 border-t-2 border-primary/30">
            <div className="col-span-3 font-medium text-primary flex items-center gap-2">
              Defiance Hub
              <Badge variant="default" className="text-[10px]">us</Badge>
            </div>
            <div className="col-span-4">Cross-chain DeFi → multi-vertical</div>
            <div className="col-span-5">
              Wedge: swap + portfolio. Phase 2: native launchpad, NFT, DAO, gaming. Same wallet, same token, one flywheel.
            </div>
          </div>
        </div>
        <p className="mt-6 text-sm text-muted-foreground max-w-3xl">
          <span className="text-foreground font-medium">The moat:</span> a flywheel
          only emerges when all six modules share the same wallet, token, and
          incentive surface. Each incumbent would have to forfeit their core to copy us.
        </p>
      </Slide>

      {/* 11: Flywheel */}
      <Slide num={11} total={TOTAL_SLIDES} eyebrow="The flywheel">
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
              { num: "02", action: "User provides liquidity", outcome: "Earns DEFY + 50% of swap fees" },
              { num: "03", action: "User qualifies for Launchpad tier", outcome: "Buys IDO at discount" },
              { num: "04", action: "User holds new IDO token", outcome: "Trades it on our DEX" },
              { num: "05", action: "Trade generates fees", outcome: "50% buyback-burn DEFY" },
              { num: "06", action: "DEFY supply shrinks", outcome: "Stake yield rises → loop continues" },
            ].map((step) => (
              <div
                key={step.num}
                className="surface rounded-lg p-4 flex items-center gap-4"
              >
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
            <p className="eyebrow eyebrow-dot mb-4 justify-center inline-flex">
              Compounding effect
            </p>
            <p className="font-display text-7xl font-semibold tabular tracking-tight">
              2.4×
            </p>
            <p className="mt-3 font-display font-semibold">LTV multiplier</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Users who touch ≥3 modules generate 2.4× the lifetime fees of
              single-module users.
            </p>
            <p className="mt-8 text-[11px] tabular text-muted-foreground">
              Source: 90-day cohort, Feb–Apr 2026 · n=18,200 users<br />
              LTV defined as cumulative protocol + company revenue per wallet
            </p>
          </div>
        </div>
      </Slide>

      {/* 12: Roadmap */}
      <Slide num={12} total={TOTAL_SLIDES} eyebrow="Roadmap · KPI-gated">
        <h2 className="display-1 text-[clamp(40px,6vw,80px)] text-balance">
          The next{" "}
          <span className="font-serif italic font-normal text-muted-foreground">
            18 months.
          </span>
        </h2>
        <div className="mt-10 surface rounded-2xl overflow-hidden flex-1">
          {ROADMAP.map((p) => {
            const Icon =
              p.status === "shipped"
                ? CheckCircle2
                : p.status === "active"
                ? TrendingUp
                : Circle;
            return (
              <div
                key={p.q}
                className="grid grid-cols-12 gap-4 px-6 py-5 border-b border-border last:border-b-0"
              >
                <div className="col-span-3 flex items-start gap-3">
                  <Icon
                    className={cn(
                      "h-5 w-5 mt-0.5 shrink-0",
                      p.status === "shipped" && "text-[hsl(var(--success))]",
                      p.status === "active" && "text-primary",
                      p.status === "planned" && "text-muted-foreground/50",
                    )}
                  />
                  <div>
                    <p className="font-display font-semibold">{p.title}</p>
                    <p className="text-[11px] text-muted-foreground font-mono tabular">
                      {p.q}
                    </p>
                  </div>
                </div>
                <div className="col-span-4 flex flex-wrap items-center gap-1.5">
                  {p.kpis.map((k) => (
                    <span
                      key={k}
                      className="rounded-full px-2.5 py-0.5 text-[11px] tabular bg-primary/10 text-primary font-medium"
                    >
                      {k}
                    </span>
                  ))}
                </div>
                <div className="col-span-5 flex flex-wrap items-center gap-1.5">
                  {p.items.map((i) => (
                    <span
                      key={i}
                      className="surface-muted rounded-full px-2.5 py-0.5 text-[11px] text-muted-foreground"
                    >
                      {i}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
        <p className="mt-6 text-sm text-muted-foreground max-w-3xl">
          <span className="text-foreground font-medium">Discipline:</span> each
          phase ships <span className="text-foreground">only when</span> prior
          KPIs are hit. We&apos;d rather extend a phase than launch the next on a weak base.
        </p>
      </Slide>

      {/* 13: Team */}
      <Slide num={13} total={TOTAL_SLIDES} eyebrow="Team">
        <h2 className="display-1 text-[clamp(40px,6vw,80px)] text-balance">
          Operators who&apos;ve
          <br />
          <span className="font-serif italic font-normal text-muted-foreground">
            shipped at scale before.
          </span>
        </h2>
        <div className="mt-10 grid grid-cols-2 md:grid-cols-3 gap-4 flex-1">
          {TEAM.map((m) => (
            <div key={m.name} className="surface rounded-xl p-5">
              <img
                src={`https://api.dicebear.com/7.x/personas/svg?seed=${encodeURIComponent(
                  m.name,
                )}&backgroundColor=b6e3f4,d1d4f9,c0aede,ffd5dc,ffdfbf`}
                alt={m.name}
                className="h-12 w-12 rounded-full bg-secondary mb-4"
              />
              <p className="font-display font-semibold tracking-tight">
                {m.name}
              </p>
              <p className="text-[11px] uppercase tracking-widest text-muted-foreground font-mono mt-0.5">
                {m.role}
              </p>
              <p className="mt-3 text-xs text-muted-foreground leading-relaxed">
                {m.bio}
              </p>
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
        <p className="mt-4 text-[11px] text-muted-foreground">
          Advisors include former Coinbase CFO, Paradigm research lead, and head of growth at a top-3 L2. Full bios in data room.
        </p>
      </Slide>

      {/* 14: Token + equity */}
      <Slide num={14} total={TOTAL_SLIDES} eyebrow="Token + equity structure">
        <h2 className="display-1 text-[clamp(40px,6vw,80px)] text-balance">
          You back both sides{" "}
          <span className="font-serif italic font-normal text-muted-foreground">
            of the value.
          </span>
        </h2>
        <p className="mt-6 text-lg text-muted-foreground max-w-3xl text-balance">
          Equity captures the company P&amp;L. Token captures protocol fees.
          Investors get pro-rata exposure to both.
        </p>
        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-5 flex-1">
          <div className="surface rounded-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-border bg-elevated">
              <p className="font-display font-semibold">Equity (Cayman C-corp)</p>
            </div>
            <div className="px-6 py-5 space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Round</span>
                <span className="font-medium">Series A preferred</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Pre-money</span>
                <span className="font-medium tabular">$80M</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Raise</span>
                <span className="font-medium tabular">$20M</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Investor stake</span>
                <span className="font-medium tabular">20% (post)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Pro-rata</span>
                <span className="font-medium">Yes, next round</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Board</span>
                <span className="font-medium">1 seat (lead)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Liquidation</span>
                <span className="font-medium">1× non-participating</span>
              </div>
            </div>
          </div>
          <div className="surface rounded-2xl overflow-hidden border-2 border-primary/30">
            <div className="px-6 py-4 border-b border-border bg-primary/5">
              <p className="font-display font-semibold text-primary">
                Token warrant (DEFY)
              </p>
            </div>
            <div className="px-6 py-5 space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Vehicle</span>
                <span className="font-medium">Token warrant, pro-rata to equity</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Allocation pool</span>
                <span className="font-medium tabular">12% of FDV</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Investor share (this round)</span>
                <span className="font-medium tabular">2.4% of FDV</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Strike</span>
                <span className="font-medium">$0.001 / DEFY</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Vesting</span>
                <span className="font-medium">3-yr linear, 1-yr cliff</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Exercise window</span>
                <span className="font-medium">10 yrs from TGE</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Foundation</span>
                <span className="font-medium">Switzerland (token)</span>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-6 surface-muted rounded-xl p-5 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <p className="eyebrow">DEFY FDV at TGE</p>
            <p className="font-display text-xl font-semibold tabular mt-1">$120M</p>
          </div>
          <div>
            <p className="eyebrow">Circulating at TGE</p>
            <p className="font-display text-xl font-semibold tabular mt-1">14%</p>
          </div>
          <div>
            <p className="eyebrow">Insider unlock</p>
            <p className="font-display text-xl font-semibold tabular mt-1">3-yr cliff</p>
          </div>
        </div>
      </Slide>

      {/* 15: Use of funds */}
      <Slide num={15} total={TOTAL_SLIDES} eyebrow="Use of funds · 18-month plan">
        <h2 className="display-1 text-[clamp(40px,6vw,80px)] text-balance">
          $20M for{" "}
          <span className="font-serif italic font-normal text-muted-foreground">
            growth, not survival.
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
          <div className="lg:col-span-5 surface rounded-2xl p-6 flex flex-col">
            <p className="font-display font-semibold mb-2">Burn vs revenue</p>
            <div className="grid grid-cols-2 gap-4 mt-2">
              <div>
                <p className="eyebrow">Burn (avg)</p>
                <p className="font-display text-3xl font-semibold tabular mt-1">
                  $1.1M<span className="text-sm text-muted-foreground">/mo</span>
                </p>
              </div>
              <div>
                <p className="eyebrow">Co. revenue</p>
                <p className="font-display text-3xl font-semibold tabular mt-1">
                  $260K<span className="text-sm text-muted-foreground">/mo</span>
                </p>
              </div>
            </div>
            <hr className="my-5 border-border" />
            <p className="text-sm text-muted-foreground">
              At current scale, company revenue covers ~24% of burn. The raise
              funds the gap <span className="text-foreground font-medium">plus</span> aggressive
              GTM — not survival, capacity.
            </p>
            <hr className="my-5 border-border" />
            <p className="font-display font-semibold mb-3">Milestones unlocked</p>
            <ul className="space-y-2 text-sm">
              <li className="flex gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <span>NFT marketplace + Launchpad shipped (Q4 2026)</span>
              </li>
              <li className="flex gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <span>Mobile native apps + DAO live (Q1 2027)</span>
              </li>
              <li className="flex gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <span>B2B white-label revenue stream (Q2 2027)</span>
              </li>
              <li className="flex gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <span>1.2M MAU, $8M MRR exit-rate Q3 2027</span>
              </li>
            </ul>
          </div>
        </div>
      </Slide>

      {/* 16: Risk */}
      <Slide num={16} total={TOTAL_SLIDES} eyebrow="Risk &amp; mitigation">
        <h2 className="display-1 text-[clamp(40px,6vw,80px)] text-balance">
          The four things{" "}
          <span className="font-serif italic font-normal text-muted-foreground">
            we lose sleep over.
          </span>
        </h2>
        <p className="mt-6 text-lg text-muted-foreground max-w-3xl text-balance">
          Showing our work — what we&apos;ve thought through, what we&apos;ve already done.
        </p>
        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-5 flex-1">
          {RISKS.map((r) => {
            const Icon = r.icon;
            return (
              <div key={r.label} className="surface rounded-2xl p-6 flex gap-4">
                <div className="h-10 w-10 shrink-0 rounded-md bg-primary/10 grid place-items-center text-primary">
                  <Icon className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <p className="font-display text-lg font-semibold tracking-tight">
                    {r.label}
                  </p>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                    {r.detail}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
        <div className="mt-6 surface-muted rounded-xl p-4 flex items-start gap-3">
          <AlertTriangle className="h-4 w-4 text-[hsl(var(--warn))] shrink-0 mt-0.5" />
          <p className="text-[12px] text-muted-foreground">
            What we&apos;re <span className="text-foreground">not</span> claiming:
            zero risk. Crypto remains an early, regulated, technically demanding
            market. We&apos;ve built defensible posture, not invulnerability.
          </p>
        </div>
      </Slide>

      {/* 17: The ask */}
      <Slide num={17} total={TOTAL_SLIDES} eyebrow="The ask" bg="primary">
        <h2 className="display-1 text-[clamp(48px,7vw,108px)] text-balance text-primary-foreground">
          $20M Series A
        </h2>
        <p className="mt-6 text-xl text-primary-foreground/80 max-w-3xl text-balance">
          $80M pre-money · $4M committed by Paradigm (lead) · $16M open to
          strategically additive partners.
        </p>
        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-5 flex-1">
          {[
            {
              t: "What you get",
              items: [
                "20% equity (Cayman C-corp)",
                "12% token warrant pool, pro-rata",
                "3-yr linear vest, 1-yr cliff",
                "Pro-rata in next round",
                "1 board seat (lead) / observer (others)",
              ],
            },
            {
              t: "What we deliver",
              items: [
                "Q4 2026: NFT + Launchpad live, $1.8M MRR",
                "Q1 2027: Mobile + DAO, $3.0M MRR",
                "Q2 2027: Gaming + B2B, $5.0M MRR",
                "Q3 2027: 1.2M MAU, $8M MRR exit-rate",
                "$DEFY listed on top-3 CEX",
              ],
            },
            {
              t: "Our commitment",
              items: [
                "Monthly metrics dashboard, public",
                "Quarterly investor letter + Zoom",
                "100% open-source frontend",
                "Audited at every release",
                "Direct access to founding team",
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

      {/* 18: Contact */}
      <Slide num={18} total={TOTAL_SLIDES} bg="dark">
        <div className="flex-1 flex flex-col justify-center">
          <p className="eyebrow eyebrow-dot mb-6">Get in touch</p>
          <h2 className="display-1 text-[clamp(48px,8vw,128px)] text-balance">
            Let&apos;s build it{" "}
            <span className="font-serif italic font-normal text-muted-foreground">
              together.
            </span>
          </h2>
          <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-5 max-w-4xl">
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
            <a
              href="#"
              className="surface rounded-xl p-6 flex items-center gap-4 hover:bg-elevated transition-colors"
            >
              <div className="h-10 w-10 grid place-items-center rounded-md bg-primary text-primary-foreground">
                <KeyRound className="h-5 w-5" />
              </div>
              <div>
                <p className="font-display font-semibold">Data room</p>
                <p className="text-sm text-muted-foreground">
                  Audits · cohort data · cap table
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

      {/* Print styles */}
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
  "Why now",
  "Problem",
  "Solution & wedge",
  "Product",
  "Market",
  "Business model",
  "Traction & cohorts",
  "Go-to-market",
  "Competition",
  "The flywheel",
  "Roadmap",
  "Team",
  "Token & equity",
  "Use of funds",
  "Risk & mitigation",
  "The ask",
  "Contact",
];

export default DeckPage;
