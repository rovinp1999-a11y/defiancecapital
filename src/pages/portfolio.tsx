import { useMemo } from "react";
import { Link } from "react-router-dom";
import { useAccount } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { motion } from "framer-motion";
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  Vote,
  ArrowUpRight,
  Copy,
  Check,
  ExternalLink,
  Coins,
  Image as ImageIcon,
} from "lucide-react";
import {
  AreaChart,
  Area,
  ResponsiveContainer,
  Tooltip,
  YAxis,
} from "recharts";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PageHero } from "@/components/page-hero";
import { Section, SectionHeader } from "@/components/section";
import { TokenIcon, TokenPair } from "@/components/icons/token-icon";
import { useNftCollections } from "@/hooks/use-nft-collections";
import { cn, formatCurrency, formatNumber } from "@/lib/utils";

/* ─── Mock portfolio data — would come from on-chain reads in production ── */

const MOCK_TOKENS = [
  { sym: "ETH", balance: 4.218, priceUsd: 3812.42, change24h: 2.4 },
  { sym: "USDC", balance: 12_450, priceUsd: 1.0, change24h: 0 },
  { sym: "DEFY", balance: 8_200, priceUsd: 1.842, change24h: 12.4 },
  { sym: "WBTC", balance: 0.18, priceUsd: 67_410, change24h: 0.9 },
  { sym: "ARB", balance: 1_240, priceUsd: 1.15, change24h: 3.8 },
];

const MOCK_POSITIONS = [
  {
    base: "DEFY",
    quote: "ETH",
    type: "Liquidity",
    valueUsd: 4_820,
    apy: 145.2,
    earned: 0.041,
  },
  {
    base: "USDC",
    quote: "DEFY",
    type: "Liquidity",
    valueUsd: 2_410,
    apy: 89.5,
    earned: 0.012,
  },
  {
    base: "DEFY",
    quote: "DEFY",
    type: "Staking",
    valueUsd: 15_098,
    apy: 24.5,
    earned: 0,
  },
];

const MOCK_ACTIVITY = [
  { type: "Swap", detail: "1.5 ETH → 2 766.5 USDC", ago: "12m ago" },
  { type: "Stake", detail: "+5,000 DEFY → governance vault", ago: "2h ago" },
  { type: "Vote", detail: "Voted FOR proposal DEFY-014", ago: "6h ago" },
  { type: "Mint", detail: "Minted Pudgy Penguins #4188", ago: "1d ago" },
  { type: "Claim", detail: "Claimed 0.041 ETH from DEFY/ETH LP", ago: "2d ago" },
];

const MOCK_HISTORY = Array.from({ length: 30 }, (_, i) => {
  const base = 28_000 + i * 200 + Math.sin(i / 3) * 1_400 + Math.cos(i / 5) * 800;
  return { day: i, value: Math.round(base) };
});

/* ─── helpers ────────────────────────────────────────────────────────────── */

function shorten(addr: string) {
  return `${addr.slice(0, 6)}…${addr.slice(-4)}`;
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      className="text-muted-foreground hover:text-foreground transition-colors"
      aria-label="Copy address"
      onClick={() => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        toast.success("Address copied");
        setTimeout(() => setCopied(false), 1500);
      }}
    >
      {copied ? (
        <Check className="h-3.5 w-3.5 text-[hsl(var(--success))]" />
      ) : (
        <Copy className="h-3.5 w-3.5" />
      )}
    </button>
  );
}

/* ─── Page ───────────────────────────────────────────────────────────────── */

export function PortfolioPage() {
  const { address, isConnected } = useAccount();
  const { data: collections } = useNftCollections(8);

  const totalUsd = useMemo(
    () => MOCK_TOKENS.reduce((s, t) => s + t.balance * t.priceUsd, 0),
    [],
  );
  const positionsUsd = useMemo(
    () => MOCK_POSITIONS.reduce((s, p) => s + p.valueUsd, 0),
    [],
  );
  const change = 4.7;

  // Pretend the connected user owns a few NFTs from the live collections list
  const ownedNfts = (collections ?? []).slice(0, 4).map((c, i) => ({
    ...c,
    tokenId: ["#0421", "#7820", "#3050", "#1138"][i] ?? `#${i + 1}`,
  }));

  if (!isConnected) {
    return (
      <PageHero
        eyebrow="Portfolio"
        title={
          <>
            Your unified
            <br />
            <span className="font-serif italic font-normal text-muted-foreground">
              Web3 dashboard.
            </span>
          </>
        }
        description="Connect your wallet to see tokens, NFTs, LP positions, voting power, and a real-time activity feed across all six modules."
        actions={
          <>
            <ConnectButton.Custom>
              {({ openConnectModal }) => (
                <Button variant="primary" size="xl" onClick={openConnectModal}>
                  <Wallet className="h-4 w-4" />
                  Connect wallet
                </Button>
              )}
            </ConnectButton.Custom>
            <Button asChild variant="secondary" size="xl">
              <Link to="/">Back home</Link>
            </Button>
          </>
        }
      >
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-3xl">
          {[
            {
              icon: Coins,
              title: "Tokens & balances",
              body: "Live USD values across every chain you hold.",
            },
            {
              icon: ImageIcon,
              title: "NFT inventory",
              body: "All your collectibles, with floor changes.",
            },
            {
              icon: Vote,
              title: "Voting power",
              body: "Conviction multipliers and active votes.",
            },
          ].map((f) => (
            <div key={f.title} className="surface rounded-xl p-5">
              <f.icon className="h-5 w-5 text-primary mb-7" />
              <p className="font-display font-semibold mb-1">{f.title}</p>
              <p className="text-sm text-muted-foreground">{f.body}</p>
            </div>
          ))}
        </div>
      </PageHero>
    );
  }

  return (
    <>
      <PageHero
        eyebrow="Portfolio"
        title={
          <>
            Welcome back,
            <br />
            <span className="font-serif italic font-normal text-muted-foreground">
              {address ? shorten(address) : "anon"}.
            </span>
          </>
        }
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Left: balance + chart */}
          <div className="lg:col-span-8 surface rounded-2xl overflow-hidden">
            <div className="p-6 md:p-8 flex items-start justify-between gap-4 flex-wrap">
              <div>
                <p className="eyebrow">Total balance</p>
                <p className="font-display text-4xl md:text-5xl font-semibold tracking-tight tabular mt-2">
                  {formatCurrency(totalUsd + positionsUsd, {
                    notation: "standard",
                    maximumFractionDigits: 0,
                  })}
                </p>
                <Badge variant="success" className="mt-3">
                  <TrendingUp className="h-3 w-3" />+{change}% 24h
                </Badge>
              </div>
              {address && (
                <div className="surface-muted rounded-md px-3 py-2 flex items-center gap-2 text-[12px] font-mono tabular">
                  <span className="h-2 w-2 rounded-full bg-[hsl(var(--success))] animate-pulse" />
                  {shorten(address)}
                  <CopyButton text={address} />
                  <a
                    href={`https://etherscan.io/address/${address}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </div>
              )}
            </div>
            <div className="h-44">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={MOCK_HISTORY} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
                  <defs>
                    <linearGradient id="pf-grad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.4} />
                      <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <YAxis hide domain={["dataMin - 2000", "dataMax + 2000"]} />
                  <Tooltip
                    contentStyle={{
                      background: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: 8,
                      fontSize: 12,
                    }}
                    formatter={(v: number) => [formatCurrency(v, { notation: "standard" }), "Balance"]}
                    labelFormatter={(d) => `Day ${d}`}
                  />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    fill="url(#pf-grad)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Right: quick stats */}
          <div className="lg:col-span-4 grid grid-cols-2 lg:grid-cols-1 gap-3">
            <div className="surface rounded-xl p-5">
              <p className="eyebrow">Tokens value</p>
              <p className="font-display text-2xl font-semibold tabular mt-1.5">
                {formatCurrency(totalUsd, { notation: "compact" })}
              </p>
              <p className="text-[11px] text-muted-foreground mt-1 tabular">
                {MOCK_TOKENS.length} assets
              </p>
            </div>
            <div className="surface rounded-xl p-5">
              <p className="eyebrow">DeFi positions</p>
              <p className="font-display text-2xl font-semibold tabular mt-1.5">
                {formatCurrency(positionsUsd, { notation: "compact" })}
              </p>
              <p className="text-[11px] text-muted-foreground mt-1 tabular">
                {MOCK_POSITIONS.length} positions earning
              </p>
            </div>
            <div className="surface rounded-xl p-5 col-span-2 lg:col-span-1">
              <p className="eyebrow">Voting power</p>
              <p className="font-display text-2xl font-semibold tabular mt-1.5">
                12,450
                <span className="text-base text-muted-foreground ml-1.5">vDEFY</span>
              </p>
              <p className="text-[11px] text-muted-foreground mt-1 tabular">
                2 active proposals · 1 needs your vote
              </p>
            </div>
          </div>
        </div>
      </PageHero>

      {/* Tokens */}
      <Section className="py-14 md:py-20">
        <div className="container-page">
          <SectionHeader eyebrow="Tokens" title="Your balances." />
          <div className="surface rounded-2xl overflow-hidden">
            <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-3 text-[11px] uppercase tracking-widest text-muted-foreground border-b border-border">
              <div className="col-span-4">Asset</div>
              <div className="col-span-2 text-right">Price</div>
              <div className="col-span-2 text-right">Balance</div>
              <div className="col-span-2 text-right">Value</div>
              <div className="col-span-2 text-right">24h</div>
            </div>
            {MOCK_TOKENS.map((t, i) => {
              const value = t.balance * t.priceUsd;
              return (
                <motion.div
                  key={t.sym}
                  initial={{ opacity: 0, y: 8 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.4, delay: i * 0.04 }}
                  className="grid grid-cols-2 md:grid-cols-12 gap-2 md:gap-4 px-6 py-4 items-center border-b border-border last:border-b-0 hover:bg-elevated transition-colors"
                >
                  <div className="col-span-2 md:col-span-4 flex items-center gap-3">
                    <TokenIcon symbol={t.sym} size="md" />
                    <div>
                      <p className="font-medium text-sm">{t.sym}</p>
                      <p className="text-[11px] text-muted-foreground font-mono">
                        on Ethereum
                      </p>
                    </div>
                  </div>
                  <div className="md:col-span-2 md:text-right tabular text-sm">
                    <p className="md:hidden text-[11px] text-muted-foreground">Price</p>
                    {formatCurrency(t.priceUsd, { notation: "standard", maximumFractionDigits: t.priceUsd < 10 ? 3 : 2 })}
                  </div>
                  <div className="md:col-span-2 md:text-right tabular text-sm">
                    <p className="md:hidden text-[11px] text-muted-foreground">Balance</p>
                    {formatNumber(t.balance, { maximumFractionDigits: 4 })}
                  </div>
                  <div className="md:col-span-2 md:text-right tabular text-sm font-medium">
                    <p className="md:hidden text-[11px] text-muted-foreground">Value</p>
                    {formatCurrency(value, { notation: "standard", maximumFractionDigits: 0 })}
                  </div>
                  <div className="md:col-span-2 md:text-right tabular text-sm">
                    <p className="md:hidden text-[11px] text-muted-foreground">24h</p>
                    <span
                      className={cn(
                        "font-medium inline-flex items-center gap-0.5",
                        t.change24h >= 0
                          ? "text-[hsl(var(--success))]"
                          : "text-[hsl(var(--danger))]",
                      )}
                    >
                      {t.change24h >= 0 ? (
                        <TrendingUp className="h-3 w-3" />
                      ) : (
                        <TrendingDown className="h-3 w-3" />
                      )}
                      {t.change24h >= 0 ? "+" : ""}
                      {t.change24h.toFixed(1)}%
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </Section>

      {/* Positions */}
      <Section className="py-14 md:py-20">
        <div className="container-page">
          <SectionHeader
            eyebrow="DeFi positions"
            title={
              <>
                Earning across
                <br />
                <span className="font-serif italic font-normal text-muted-foreground">
                  pools & vaults.
                </span>
              </>
            }
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {MOCK_POSITIONS.map((p, i) => (
              <motion.div
                key={`${p.base}-${p.quote}-${i}`}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="surface rounded-xl p-5"
              >
                <div className="flex items-center justify-between mb-4">
                  <TokenPair base={p.base} quote={p.quote} size="md" />
                  <Badge variant={p.type === "Staking" ? "default" : "muted"}>
                    {p.type}
                  </Badge>
                </div>
                <p className="font-medium text-sm">
                  {p.base} {p.base !== p.quote ? `/ ${p.quote}` : "Stake"}
                </p>
                <p className="font-display text-2xl font-semibold tabular mt-1">
                  {formatCurrency(p.valueUsd, { notation: "compact" })}
                </p>
                <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
                  <div className="surface-muted rounded-md p-2.5">
                    <p className="text-muted-foreground text-[10px] uppercase tracking-widest">APY</p>
                    <p className="font-medium tabular text-primary mt-0.5">
                      {p.apy.toFixed(1)}%
                    </p>
                  </div>
                  <div className="surface-muted rounded-md p-2.5">
                    <p className="text-muted-foreground text-[10px] uppercase tracking-widest">
                      Earned
                    </p>
                    <p className="font-medium tabular mt-0.5">
                      {p.earned > 0 ? `${p.earned} ETH` : "—"}
                    </p>
                  </div>
                </div>
                <Button
                  variant={p.earned > 0 ? "primary" : "secondary"}
                  size="sm"
                  className="w-full mt-4"
                  onClick={() =>
                    toast(p.earned > 0 ? "Claimed (mock)" : "Manage position", {
                      description:
                        p.earned > 0
                          ? `+${p.earned} ETH transferred`
                          : "Opens position manager",
                    })
                  }
                >
                  {p.earned > 0 ? "Claim" : "Manage"}
                  <ArrowUpRight className="h-3 w-3" />
                </Button>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* NFTs */}
      <Section className="py-14 md:py-20">
        <div className="container-page">
          <SectionHeader
            eyebrow="NFT inventory"
            title="Collectibles you own."
          />
          {ownedNfts.length === 0 ? (
            <div className="surface rounded-xl p-10 text-center">
              <ImageIcon className="h-6 w-6 mx-auto text-muted-foreground mb-3" />
              <p className="font-display font-semibold">No NFTs yet</p>
              <p className="text-sm text-muted-foreground mt-1">
                Browse curated drops to start your collection.
              </p>
              <Button asChild variant="primary" size="sm" className="mt-5">
                <Link to="/nft-marketplace">Browse drops</Link>
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {ownedNfts.map((nft, i) => (
                <motion.div
                  key={nft.id}
                  initial={{ opacity: 0, y: 8 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.4, delay: i * 0.04 }}
                  className="surface rounded-lg overflow-hidden"
                >
                  <div className="aspect-square bg-muted">
                    <img
                      src={nft.image}
                      alt={nft.name}
                      loading="lazy"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-3">
                    <p className="text-[12px] font-medium truncate">
                      {nft.name}
                    </p>
                    <p className="text-[11px] text-muted-foreground font-mono tabular">
                      {nft.tokenId}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </Section>

      {/* Activity */}
      <Section className="py-14 md:py-20">
        <div className="container-page">
          <SectionHeader eyebrow="Activity" title="Your recent moves." />
          <div className="surface rounded-2xl overflow-hidden">
            {MOCK_ACTIVITY.map((a, i) => (
              <div
                key={i}
                className="flex items-center justify-between gap-3 px-5 py-4 border-b border-border last:border-b-0 hover:bg-elevated transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Badge variant="muted">{a.type}</Badge>
                  <p className="text-sm">{a.detail}</p>
                </div>
                <p className="text-[11px] text-muted-foreground tabular">{a.ago}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>
    </>
  );
}

export default PortfolioPage;
