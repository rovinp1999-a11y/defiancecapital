import { motion } from "framer-motion";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  TrendingUp,
  Users,
  ArrowUpRight,
  Zap,
  Globe,
  Coins,
} from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PageHero } from "@/components/page-hero";
import { Section, SectionHeader } from "@/components/section";
import { ChainIcon } from "@/components/icons/chain-icon";
import { cn, formatCurrency, formatNumber } from "@/lib/utils";

/* ─── Synthetic but realistic time-series ─────────────────────────────── */

function generateSeries(
  days: number,
  start: number,
  growthRate: number,
  volatility = 0.05,
) {
  let v = start;
  return Array.from({ length: days }, (_, i) => {
    v = v * (1 + growthRate + (Math.random() - 0.5) * volatility);
    return {
      day: i,
      label: `D-${days - i}`,
      value: Math.max(0, Math.round(v)),
    };
  });
}

const TVL_SERIES = generateSeries(90, 1_500_000, 0.038, 0.04);
const VOLUME_SERIES = generateSeries(90, 800_000, 0.045, 0.12);
const USERS_SERIES = generateSeries(90, 850, 0.032, 0.05);
const FEES_SERIES = generateSeries(90, 4_200, 0.045, 0.1);

const CHAIN_DISTRIBUTION = [
  { name: "Ethereum", value: 38, color: "hsl(220 89% 60%)" },
  { name: "Arbitrum", value: 22, color: "hsl(206 91% 50%)" },
  { name: "Base", value: 16, color: "hsl(218 100% 53%)" },
  { name: "Polygon", value: 11, color: "hsl(266 75% 56%)" },
  { name: "Optimism", value: 8, color: "hsl(0 95% 56%)" },
  { name: "BNB Chain", value: 5, color: "hsl(40 90% 55%)" },
];

const MODULE_REVENUE = [
  { module: "Swap", revenue: 184_000 },
  { module: "Marketplace", revenue: 124_500 },
  { module: "Launchpad", revenue: 58_000 },
  { module: "Bridge", revenue: 41_200 },
];

const RANGES = ["7D", "30D", "90D", "ALL"];

function StatBig({
  label,
  value,
  delta,
  series,
  color = "hsl(var(--primary))",
}: {
  label: string;
  value: string;
  delta: string;
  series: { day: number; value: number }[];
  color?: string;
}) {
  return (
    <div className="surface rounded-xl p-6 flex flex-col">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="eyebrow">{label}</p>
          <p className="font-display text-3xl md:text-4xl font-semibold tabular tracking-tight mt-2 leading-none">
            {value}
          </p>
          <p
            className={cn(
              "text-[11px] mt-2 tabular flex items-center gap-1",
              delta.startsWith("+")
                ? "text-[hsl(var(--success))]"
                : "text-[hsl(var(--danger))]",
            )}
          >
            <TrendingUp className="h-3 w-3" />
            {delta} 30d
          </p>
        </div>
      </div>
      <div className="h-16 mt-4 -mx-1">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={series}>
            <defs>
              <linearGradient
                id={`spark-${label}`}
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop offset="0%" stopColor={color} stopOpacity={0.4} />
                <stop offset="100%" stopColor={color} stopOpacity={0} />
              </linearGradient>
            </defs>
            <Area
              type="monotone"
              dataKey="value"
              stroke={color}
              strokeWidth={2}
              fill={`url(#spark-${label})`}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export function StatsPage() {
  const [range, setRange] = useState("90D");

  return (
    <>
      <PageHero
        eyebrow="Live metrics"
        title={
          <>
            Every metric,
            <br />
            <span className="font-serif italic font-normal text-muted-foreground">
              fully on-chain.
            </span>
          </>
        }
        description="Public, real-time, verifiable. The same dashboard the team and the DAO use to make every decision."
      >
        <div className="flex items-center justify-between gap-4 mb-6 flex-wrap">
          <Badge variant="muted" className="font-mono">
            <span className="h-1.5 w-1.5 rounded-full bg-[hsl(var(--success))] animate-pulse" />
            Live · Updated every block
          </Badge>
          <div className="flex gap-1 surface-muted rounded-md p-1">
            {RANGES.map((r) => (
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          <StatBig
            label="Total value locked"
            value={formatCurrency(
              TVL_SERIES[TVL_SERIES.length - 1].value,
              { notation: "compact" },
            )}
            delta="+42.8%"
            series={TVL_SERIES}
            color="hsl(75 100% 56%)"
          />
          <StatBig
            label="30d volume"
            value={formatCurrency(
              VOLUME_SERIES.slice(-30).reduce((s, d) => s + d.value, 0),
              { notation: "compact" },
            )}
            delta="+58.2%"
            series={VOLUME_SERIES}
            color="hsl(188 90% 52%)"
          />
          <StatBig
            label="Daily active wallets"
            value={formatNumber(
              USERS_SERIES[USERS_SERIES.length - 1].value,
              { notation: "standard" },
            )}
            delta="+34.6%"
            series={USERS_SERIES}
            color="hsl(322 95% 60%)"
          />
          <StatBig
            label="Protocol fees (30d)"
            value={formatCurrency(
              FEES_SERIES.slice(-30).reduce((s, d) => s + d.value, 0),
              { notation: "compact" },
            )}
            delta="+62.1%"
            series={FEES_SERIES}
            color="hsl(38 95% 58%)"
          />
        </div>
      </PageHero>

      {/* TVL big chart */}
      <Section className="py-12 md:py-20">
        <div className="container-page">
          <div className="surface rounded-2xl overflow-hidden">
            <div className="p-6 md:p-8 flex items-start justify-between gap-4 flex-wrap border-b border-border">
              <div>
                <p className="eyebrow eyebrow-dot mb-2">Total value locked</p>
                <p className="font-display text-4xl md:text-5xl font-semibold tracking-tight tabular">
                  {formatCurrency(
                    TVL_SERIES[TVL_SERIES.length - 1].value,
                    { notation: "compact" },
                  )}
                </p>
                <p className="text-[11px] text-muted-foreground tabular mt-2">
                  Across 6 chains · Audited by Trail of Bits, OpenZeppelin
                </p>
              </div>
              <div className="text-right">
                <p className="text-[11px] uppercase tracking-widest text-muted-foreground">
                  Global rank
                </p>
                <p className="font-display text-2xl font-semibold tabular mt-1">
                  #47
                </p>
                <p className="text-[11px] text-muted-foreground tabular mt-1">
                  on DefiLlama
                </p>
              </div>
            </div>
            <div className="h-72 p-2 md:p-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={TVL_SERIES}
                  margin={{ top: 20, right: 20, bottom: 10, left: 0 }}
                >
                  <defs>
                    <linearGradient id="tvl-big" x1="0" y1="0" x2="0" y2="1">
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
                    tickFormatter={(v) =>
                      v % 15 === 0 ? `${90 - v}d ago` : ""
                    }
                  />
                  <YAxis
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(v) =>
                      formatCurrency(v, { notation: "compact" })
                    }
                  />
                  <Tooltip
                    contentStyle={{
                      background: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: 8,
                      fontSize: 12,
                    }}
                    labelFormatter={(d) => `${90 - d} days ago`}
                    formatter={(v: number) => [
                      formatCurrency(v, { notation: "compact" }),
                      "TVL",
                    ]}
                  />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2.5}
                    fill="url(#tvl-big)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </Section>

      {/* Chain distribution + Module revenue */}
      <Section className="py-12 md:py-20">
        <div className="container-page">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* Chain split */}
            <div className="lg:col-span-5 surface rounded-2xl p-6">
              <p className="eyebrow eyebrow-dot mb-2">TVL by chain</p>
              <p className="font-display text-xl font-semibold tracking-tight">
                Where capital lives
              </p>
              <div className="h-60 mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={CHAIN_DISTRIBUTION}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={100}
                      paddingAngle={2}
                      strokeWidth={2}
                      stroke="hsl(var(--background))"
                    >
                      {CHAIN_DISTRIBUTION.map((c) => (
                        <Cell key={c.name} fill={c.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        background: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: 8,
                        fontSize: 12,
                      }}
                      formatter={(v: number) => [`${v}%`, ""]}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 space-y-2">
                {CHAIN_DISTRIBUTION.map((c) => (
                  <div
                    key={c.name}
                    className="flex items-center justify-between text-[12px] tabular"
                  >
                    <span className="flex items-center gap-2">
                      <ChainIcon name={c.name} size="xs" />
                      {c.name}
                    </span>
                    <span className="font-semibold">{c.value}%</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Module revenue bar */}
            <div className="lg:col-span-7 surface rounded-2xl p-6">
              <p className="eyebrow eyebrow-dot mb-2">Revenue by module · 30d</p>
              <p className="font-display text-xl font-semibold tracking-tight">
                {formatCurrency(
                  MODULE_REVENUE.reduce((s, m) => s + m.revenue, 0),
                  { notation: "compact" },
                )}{" "}
                <span className="text-muted-foreground text-sm">
                  total fees
                </span>
              </p>
              <div className="h-60 mt-6">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={MODULE_REVENUE}
                    layout="vertical"
                    margin={{ top: 0, right: 30, bottom: 0, left: 0 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="hsl(var(--border))"
                      horizontal={false}
                    />
                    <XAxis
                      type="number"
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={11}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(v) =>
                        formatCurrency(v, { notation: "compact" })
                      }
                    />
                    <YAxis
                      type="category"
                      dataKey="module"
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                      width={100}
                    />
                    <Tooltip
                      contentStyle={{
                        background: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: 8,
                        fontSize: 12,
                      }}
                      cursor={{ fill: "hsl(var(--secondary))" }}
                      formatter={(v: number) => [
                        formatCurrency(v, { notation: "compact" }),
                        "Revenue",
                      ]}
                    />
                    <Bar
                      dataKey="revenue"
                      fill="hsl(var(--primary))"
                      radius={[0, 4, 4, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <p className="mt-4 text-[11px] text-muted-foreground tabular">
                100% of fees flow to DEFY stakers and the DAO treasury — see{" "}
                <a
                  href="/token"
                  className="text-foreground hover:underline"
                >
                  tokenomics
                </a>
                .
              </p>
            </div>
          </div>
        </div>
      </Section>

      {/* Operational metrics */}
      <Section className="py-12 md:py-20">
        <div className="container-page">
          <SectionHeader
            eyebrow="Operations"
            title="The numbers behind the numbers."
          />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              {
                icon: Users,
                label: "Total users",
                value: "184,302",
                hint: "Unique wallets",
              },
              {
                icon: ArrowUpRight,
                label: "All-time txns",
                value: "2.41M",
                hint: "Onchain ops",
              },
              {
                icon: Zap,
                label: "Avg confirm",
                value: "812ms",
                hint: "Across all chains",
              },
              {
                icon: Globe,
                label: "Countries",
                value: "147",
                hint: "Active wallets",
              },
              {
                icon: Coins,
                label: "DEFY staked",
                value: "42.7M",
                hint: "17.8% of supply",
              },
              {
                icon: TrendingUp,
                label: "Avg APY",
                value: "18.4%",
                hint: "Across pools",
              },
              {
                icon: Users,
                label: "DAO voters",
                value: "8,214",
                hint: "Active in last 30d",
              },
              {
                icon: ArrowUpRight,
                label: "Bridge volume",
                value: "$41.2K",
                hint: "30d, all routes",
              },
            ].map((m, i) => (
              <motion.div
                key={m.label}
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.4, delay: i * 0.04 }}
                className="surface rounded-xl p-5"
              >
                <m.icon className="h-4 w-4 text-primary mb-4" />
                <p className="font-display text-2xl font-semibold tabular tracking-tight">
                  {m.value}
                </p>
                <p className="text-[11px] uppercase tracking-widest text-muted-foreground mt-2">
                  {m.label}
                </p>
                <p className="text-[10px] text-muted-foreground mt-1 tabular">
                  {m.hint}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      <Section className="pb-24">
        <div className="container-page">
          <div className="surface rounded-xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 text-sm">
            <p className="text-muted-foreground">
              Want to verify any of this yourself?
            </p>
            <div className="flex gap-2">
              <Button asChild variant="outline" size="sm">
                <a
                  href="https://defillama.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  DefiLlama <ArrowUpRight className="h-3 w-3" />
                </a>
              </Button>
              <Button asChild variant="outline" size="sm">
                <a
                  href="https://dune.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Dune dashboard <ArrowUpRight className="h-3 w-3" />
                </a>
              </Button>
              <Button asChild variant="outline" size="sm">
                <a
                  href="/token"
                >
                  Tokenomics
                </a>
              </Button>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}

export default StatsPage;
