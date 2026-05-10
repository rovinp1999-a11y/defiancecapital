import {
  ArrowUpDown,
  Droplets,
  PiggyBank,
  Target,
  TrendingUp,
  ArrowRight,
} from "lucide-react";
import {
  AreaChart,
  Area,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { motion } from "framer-motion";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PageHero } from "@/components/page-hero";
import { Section, SectionHeader } from "@/components/section";
import { StatTile } from "@/components/stat-tile";
import { TokenPair } from "@/components/icons/token-icon";
import { SwapWidget } from "@/components/swap-widget";
import { WatchlistStar } from "@/components/watchlist-star";
import { cn, formatCurrency, formatPercent } from "@/lib/utils";

const tvlSeries = Array.from({ length: 30 }, (_, i) => {
  const base = 18 + i * 0.4 + Math.sin(i / 3) * 1.6 + Math.cos(i / 5) * 0.9;
  return {
    day: `D${i + 1}`,
    tvl: Number(base.toFixed(2)),
  };
});

const ranges = ["1D", "7D", "30D", "90D", "ALL"];

const pools = [
  {
    base: "DEFY",
    quote: "ETH",
    type: "Gaming",
    tvl: 2_400_000,
    apy: 145.2,
    volume24h: 524_000,
    change: 4.8,
  },
  {
    base: "USDC",
    quote: "DEFY",
    type: "Stable",
    tvl: 1_800_000,
    apy: 89.5,
    volume24h: 312_000,
    change: -1.2,
  },
  {
    base: "WBTC",
    quote: "ETH",
    type: "Blue chip",
    tvl: 5_200_000,
    apy: 32.1,
    volume24h: 1_200_000,
    change: 2.1,
  },
  {
    base: "GAME",
    quote: "DEFY",
    type: "New",
    tvl: 890_000,
    apy: 234.7,
    volume24h: 156_000,
    change: 12.4,
  },
];

const features = [
  {
    icon: ArrowUpDown,
    title: "Token swaps",
    description: "Smart-routed swaps across DEXs with minimal slippage.",
  },
  {
    icon: Droplets,
    title: "Liquidity mining",
    description: "Provide liquidity, earn fees and boosted rewards.",
  },
  {
    icon: PiggyBank,
    title: "Yield farming",
    description: "Curated strategies, audited contracts, real APY.",
  },
  {
    icon: Target,
    title: "Staking",
    description: "Stake DEFY for governance and revenue share.",
  },
];

export function DefiPage() {
  const [range, setRange] = useState("30D");

  return (
    <>
      <PageHero
        eyebrow="DeFi"
        title={
          <>
            Trade, stake, earn.
            <br />
            <span className="font-serif italic font-normal text-muted-foreground">
              Without the noise.
            </span>
          </>
        }
        description="Professional-grade DeFi tooling with deep liquidity, smart routing, and a UX that respects your time."
        actions={
          <>
            <Button variant="primary" size="xl">
              <ArrowUpDown className="h-4 w-4" />
              Start trading
            </Button>
            <Button variant="secondary" size="xl">
              <Droplets className="h-4 w-4" />
              Add liquidity
            </Button>
          </>
        }
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          <div className="lg:col-span-7 grid grid-cols-2 gap-3">
            <StatTile
              label="TVL"
              value={24.5}
              prefix="$"
              suffix="M"
              decimals={1}
              trend={[18.5, 19.6, 20.4, 20.1, 21.7, 22.6, 23.8, 24.5]}
              trendUp
            />
            <StatTile
              label="24h volume"
              value={2.1}
              prefix="$"
              suffix="M"
              decimals={1}
              trend={[1.5, 1.7, 1.9, 1.6, 2.2, 1.8, 2.0, 2.1]}
              trendUp
            />
            <StatTile
              label="Avg APY"
              value={156}
              suffix="%"
              trend={[120, 132, 128, 140, 145, 150, 153, 156]}
              trendUp
            />
            <StatTile
              label="Active users"
              value={12.5}
              suffix="K"
              decimals={1}
              trend={[8.2, 9.1, 9.8, 10.4, 11.2, 11.8, 12.2, 12.5]}
              trendUp
            />
          </div>
          <div className="lg:col-span-5 lg:justify-self-end w-full lg:max-w-md">
            <SwapWidget />
          </div>
        </div>
      </PageHero>

      <Section className="py-20 md:py-28">
        <div className="container-page">
          <div className="surface rounded-2xl overflow-hidden">
            <div className="p-6 md:p-8 flex items-start justify-between gap-4 flex-wrap border-b border-border">
              <div>
                <p className="eyebrow eyebrow-dot mb-2">
                  Total Value Locked · 30D
                </p>
                <p className="font-display text-4xl md:text-5xl font-semibold tracking-tight tabular">
                  $24.5M
                </p>
                <Badge variant="success" className="mt-3">
                  <TrendingUp className="h-3 w-3" />
                  +12.4% week
                </Badge>
              </div>
              <div className="flex gap-1 surface-muted rounded-md p-1">
                {ranges.map((r) => (
                  <button
                    key={r}
                    onClick={() => setRange(r)}
                    className={cn(
                      "text-[11px] font-medium tabular px-3 py-1.5 rounded transition-colors",
                      r === range
                        ? "bg-foreground text-background"
                        : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>
            <div className="h-72 p-2 md:p-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={tvlSeries}
                  margin={{ top: 20, right: 20, bottom: 10, left: 10 }}
                >
                  <defs>
                    <linearGradient id="tvl-grad" x1="0" y1="0" x2="0" y2="1">
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
                    dataKey="day"
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
                    tickFormatter={(v) => `$${v}M`}
                  />
                  <Tooltip
                    contentStyle={{
                      background: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: 8,
                      fontSize: 12,
                    }}
                    labelStyle={{ color: "hsl(var(--muted-foreground))" }}
                    formatter={(v: number) => [`$${v}M`, "TVL"]}
                  />
                  <Area
                    type="monotone"
                    dataKey="tvl"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2.5}
                    fill="url(#tvl-grad)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </Section>

      <Section className="py-20 md:py-28">
        <div className="container-page">
          <SectionHeader
            eyebrow="Liquidity pools"
            title={
              <>
                Top yields,
                <br />
                <span className="font-serif italic font-normal text-muted-foreground">
                  always vetted.
                </span>
              </>
            }
          />
          <div className="surface rounded-2xl overflow-hidden">
            <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-3 text-[11px] uppercase tracking-widest text-muted-foreground border-b border-border">
              <div className="col-span-3">Pair</div>
              <div className="col-span-2 text-right">TVL</div>
              <div className="col-span-2 text-right">24h volume</div>
              <div className="col-span-2 text-right">24h</div>
              <div className="col-span-1 text-right">APY</div>
              <div className="col-span-2 text-right">Action</div>
            </div>
            {pools.map((p, i) => (
              <motion.div
                key={`${p.base}-${p.quote}`}
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="grid grid-cols-2 md:grid-cols-12 gap-2 md:gap-4 px-6 py-5 items-center border-b border-border last:border-b-0 hover:bg-elevated transition-colors"
              >
                <div className="md:col-span-3 col-span-2 flex items-center gap-3">
                  <WatchlistStar
                    id={`pool:${p.base}-${p.quote}`}
                    label={`${p.base}/${p.quote} pool`}
                    size={14}
                  />
                  <TokenPair base={p.base} quote={p.quote} size="md" />
                  <div>
                    <p className="font-medium text-sm">
                      {p.base} <span className="text-muted-foreground">/</span> {p.quote}
                    </p>
                    <p className="text-[11px] text-muted-foreground font-mono">
                      {p.type}
                    </p>
                  </div>
                </div>
                <div className="md:col-span-2 md:text-right tabular text-sm">
                  <p className="md:hidden text-[11px] text-muted-foreground">
                    TVL
                  </p>
                  {formatCurrency(p.tvl)}
                </div>
                <div className="md:col-span-2 md:text-right tabular text-sm">
                  <p className="md:hidden text-[11px] text-muted-foreground">
                    24h vol
                  </p>
                  {formatCurrency(p.volume24h)}
                </div>
                <div className="md:col-span-2 md:text-right tabular text-sm">
                  <p className="md:hidden text-[11px] text-muted-foreground">
                    24h
                  </p>
                  <span
                    className={
                      p.change >= 0
                        ? "text-[hsl(var(--success))]"
                        : "text-[hsl(var(--danger))]"
                    }
                  >
                    {formatPercent(p.change)}
                  </span>
                </div>
                <div className="md:col-span-1 md:text-right">
                  <p className="md:hidden text-[11px] text-muted-foreground">
                    APY
                  </p>
                  <span className="font-semibold text-primary tabular">
                    {p.apy.toFixed(1)}%
                  </span>
                </div>
                <div className="md:col-span-2 col-span-2 md:text-right">
                  <Button variant="secondary" size="sm" className="w-full md:w-auto">
                    Add LP <ArrowRight className="h-3 w-3" />
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      <Section className="py-20 md:py-28">
        <div className="container-page">
          <SectionHeader
            eyebrow="What you can do"
            title="The full DeFi stack."
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
                className="surface rounded-xl p-6"
              >
                <f.icon className="h-5 w-5 text-primary mb-7" />
                <h3 className="font-display text-base font-semibold tracking-tight mb-1">
                  {f.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {f.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>
    </>
  );
}

export default DefiPage;
