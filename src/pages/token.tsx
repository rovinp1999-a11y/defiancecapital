import { motion } from "framer-motion";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from "recharts";
import {
  Vote,
  Lock,
  Coins,
  Rocket,
  TrendingUp,
  ShieldCheck,
  ArrowRight,
  ExternalLink,
  Copy,
  Flame,
  Wallet,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PageHero } from "@/components/page-hero";
import { Section, SectionHeader } from "@/components/section";
import { TokenIcon } from "@/components/icons/token-icon";
import { ChainIcon } from "@/components/icons/chain-icon";
import { cn, formatNumber } from "@/lib/utils";

/* ─── Token model — designed to be defensible & investor-legible ──────── */

const TOTAL_SUPPLY = 1_000_000_000;
const CIRCULATING = 240_000_000;

const ALLOCATIONS = [
  {
    name: "Community & Ecosystem",
    pct: 35,
    color: "hsl(75 100% 56%)",
    note: "Airdrops, LP rewards, gaming, NFT incentives",
  },
  {
    name: "Team",
    pct: 20,
    color: "hsl(188 90% 52%)",
    note: "4-year linear vest · 1-year cliff",
  },
  {
    name: "Investors",
    pct: 18,
    color: "hsl(262 83% 62%)",
    note: "3-year linear vest · 6-month cliff",
  },
  {
    name: "DAO Treasury",
    pct: 12,
    color: "hsl(322 95% 60%)",
    note: "Governance-controlled, on-chain",
  },
  {
    name: "Liquidity",
    pct: 10,
    color: "hsl(38 95% 58%)",
    note: "Initial DEX + protocol-owned liquidity",
  },
  {
    name: "Public Sale",
    pct: 5,
    color: "hsl(145 70% 50%)",
    note: "Fully unlocked at TGE",
  },
];

// Rough vesting curve over 60 months (5 years)
const VESTING = Array.from({ length: 60 }, (_, m) => {
  // Each cohort vests on its own schedule
  const sale = m === 0 ? 50 : 50;
  const liq = m === 0 ? 100 : 100;
  const investors =
    m < 6 ? 0 : m < 42 ? Math.min(180, ((m - 6) / 36) * 180) : 180;
  const team = m < 12 ? 0 : m < 60 ? Math.min(200, ((m - 12) / 48) * 200) : 200;
  const community = Math.min(350, (m / 60) * 350);
  const treasury = Math.min(120, (m / 48) * 120);
  return {
    month: m,
    Public: Math.round(sale),
    Liquidity: Math.round(liq),
    Investors: Math.round(investors),
    Team: Math.round(team),
    Community: Math.round(community),
    Treasury: Math.round(treasury),
  };
});

const UTILITY = [
  {
    icon: Vote,
    title: "Governance",
    body: "1 staked DEFY = 1 vote. Conviction multipliers up to 2.5× for long-term lockers.",
  },
  {
    icon: Lock,
    title: "Staking & fee share",
    body: "Stake DEFY to earn 50% of all protocol fees, paid in ETH weekly.",
  },
  {
    icon: TrendingUp,
    title: "LP boost",
    body: "Stakers earn up to 2.5× boosted yield on liquidity provision.",
  },
  {
    icon: Rocket,
    title: "Launchpad tiers",
    body: "Stake to unlock allocation in vetted IDOs. Tier-gated fairness, no whitelist.",
  },
  {
    icon: Coins,
    title: "Fee discounts",
    body: "Up to 50% off swap and marketplace fees, scaled by stake size.",
  },
  {
    icon: ShieldCheck,
    title: "Slashing protection",
    body: "Treasury covers smart-contract failures — funded by 5% of all fees.",
  },
];

const VALUE_CAPTURE = [
  {
    source: "Swap fees",
    rate: "0.05%",
    flow: "50% buyback + burn · 50% staker rewards",
  },
  {
    source: "NFT marketplace",
    rate: "2.5%",
    flow: "100% to DAO treasury",
  },
  {
    source: "Launchpad listing",
    rate: "1% of raise",
    flow: "100% to DAO treasury",
  },
  {
    source: "Cross-chain bridge",
    rate: "0.1%",
    flow: "50% to LPs · 50% to staker rewards",
  },
];

const CONTRACTS = [
  {
    label: "DEFY token",
    address: "0xdefy0000000000000000000000000000000defy01",
    chain: "Ethereum",
  },
  {
    label: "Staking vault",
    address: "0xdefy0000000000000000000000000000000defy02",
    chain: "Ethereum",
  },
  {
    label: "Governor",
    address: "0xdefy0000000000000000000000000000000defy03",
    chain: "Ethereum",
  },
  {
    label: "Treasury (multisig)",
    address: "0xdefy0000000000000000000000000000000defy04",
    chain: "Ethereum",
  },
];

function shortAddress(addr: string) {
  return `${addr.slice(0, 6)}…${addr.slice(-4)}`;
}

function CopyAddress({ address }: { address: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      className="text-muted-foreground hover:text-foreground transition-colors"
      onClick={() => {
        navigator.clipboard.writeText(address);
        setCopied(true);
        toast.success("Address copied");
        setTimeout(() => setCopied(false), 1200);
      }}
      aria-label="Copy address"
    >
      <Copy className={cn("h-3 w-3", copied && "text-[hsl(var(--success))]")} />
    </button>
  );
}

export function TokenPage() {
  return (
    <>
      <PageHero
        eyebrow="DEFY token"
        title={
          <>
            One token,
            <br />
            <span className="font-serif italic font-normal text-muted-foreground">
              six modules.
            </span>
          </>
        }
        description="DEFY is the native token of the Defiance Hub protocol. It governs the DAO, captures fees from every module, and aligns long-term holders with platform growth."
        actions={
          <>
            <Button variant="primary" size="xl">
              <Wallet className="h-4 w-4" />
              Stake DEFY
            </Button>
            <Button asChild variant="secondary" size="xl">
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2"
              >
                Read the whitepaper
                <ExternalLink className="h-4 w-4" />
              </a>
            </Button>
          </>
        }
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="surface rounded-xl p-5">
            <p className="eyebrow">Total supply</p>
            <p className="font-display text-2xl font-semibold tabular mt-2">
              {formatNumber(TOTAL_SUPPLY, { notation: "compact" })}
            </p>
            <p className="text-[11px] text-muted-foreground mt-1 tabular">
              Hard cap, no inflation
            </p>
          </div>
          <div className="surface rounded-xl p-5">
            <p className="eyebrow">Circulating</p>
            <p className="font-display text-2xl font-semibold tabular mt-2">
              {formatNumber(CIRCULATING, { notation: "compact" })}
            </p>
            <p className="text-[11px] text-muted-foreground mt-1 tabular">
              {((CIRCULATING / TOTAL_SUPPLY) * 100).toFixed(0)}% of supply
            </p>
          </div>
          <div className="surface rounded-xl p-5">
            <p className="eyebrow">Price (live)</p>
            <p className="font-display text-2xl font-semibold tabular mt-2 flex items-center gap-1.5">
              <TokenIcon symbol="DEFY" size="sm" />
              $1.84
            </p>
            <p className="text-[11px] text-[hsl(var(--success))] mt-1 tabular">
              +12.4% 24h
            </p>
          </div>
          <div className="surface rounded-xl p-5">
            <p className="eyebrow">Market cap</p>
            <p className="font-display text-2xl font-semibold tabular mt-2">
              $441.6M
            </p>
            <p className="text-[11px] text-muted-foreground mt-1 tabular">
              FDV $1.84B
            </p>
          </div>
        </div>
      </PageHero>

      {/* Allocation + vesting */}
      <Section className="py-16 md:py-24">
        <div className="container-page">
          <SectionHeader
            eyebrow="Distribution"
            title={
              <>
                Engineered for
                <br />
                <span className="font-serif italic font-normal text-muted-foreground">
                  long-term alignment.
                </span>
              </>
            }
          />
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* Pie */}
            <div className="lg:col-span-5 surface rounded-2xl p-6">
              <p className="eyebrow eyebrow-dot mb-2">Allocation</p>
              <p className="font-display text-xl font-semibold tracking-tight mb-6">
                1B DEFY · 6 cohorts
              </p>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={ALLOCATIONS}
                      dataKey="pct"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={120}
                      paddingAngle={2}
                      strokeWidth={2}
                      stroke="hsl(var(--background))"
                    >
                      {ALLOCATIONS.map((entry) => (
                        <Cell key={entry.name} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        background: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: 8,
                        fontSize: 12,
                      }}
                      formatter={(v: number, _name, p) => [
                        `${v}% · ${formatNumber((TOTAL_SUPPLY * v) / 100, { notation: "compact" })} DEFY`,
                        p.payload.name,
                      ]}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 space-y-2">
                {ALLOCATIONS.map((a) => (
                  <div
                    key={a.name}
                    className="flex items-center justify-between text-[12px] tabular"
                  >
                    <span className="flex items-center gap-2 min-w-0">
                      <span
                        className="h-2.5 w-2.5 rounded-sm shrink-0"
                        style={{ background: a.color }}
                      />
                      <span className="truncate font-medium">{a.name}</span>
                      <span className="text-muted-foreground hidden md:inline">
                        — {a.note}
                      </span>
                    </span>
                    <span className="font-semibold shrink-0">{a.pct}%</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Vesting */}
            <div className="lg:col-span-7 surface rounded-2xl p-6">
              <p className="eyebrow eyebrow-dot mb-2">Unlock schedule</p>
              <p className="font-display text-xl font-semibold tracking-tight mb-6">
                60-month vest · cliffs prevent dumps
              </p>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={VESTING} margin={{ top: 0, right: 10, bottom: 0, left: -10 }}>
                    <defs>
                      {ALLOCATIONS.map((a) => (
                        <linearGradient
                          key={a.name}
                          id={`vg-${a.name.replace(/\s/g, "")}`}
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop offset="0%" stopColor={a.color} stopOpacity={0.6} />
                          <stop offset="100%" stopColor={a.color} stopOpacity={0.05} />
                        </linearGradient>
                      ))}
                    </defs>
                    <CartesianGrid stroke="hsl(var(--border))" vertical={false} />
                    <XAxis
                      dataKey="month"
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={11}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(v) => (v % 12 === 0 ? `Y${v / 12}` : "")}
                    />
                    <YAxis
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={11}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(v) => `${v}M`}
                    />
                    <Tooltip
                      contentStyle={{
                        background: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: 8,
                        fontSize: 12,
                      }}
                      labelFormatter={(m) => `Month ${m}`}
                    />
                    <Area
                      type="monotone"
                      dataKey="Community"
                      stackId="1"
                      stroke={ALLOCATIONS[0].color}
                      fill={ALLOCATIONS[0].color}
                      fillOpacity={0.4}
                    />
                    <Area
                      type="monotone"
                      dataKey="Team"
                      stackId="1"
                      stroke={ALLOCATIONS[1].color}
                      fill={ALLOCATIONS[1].color}
                      fillOpacity={0.4}
                    />
                    <Area
                      type="monotone"
                      dataKey="Investors"
                      stackId="1"
                      stroke={ALLOCATIONS[2].color}
                      fill={ALLOCATIONS[2].color}
                      fillOpacity={0.4}
                    />
                    <Area
                      type="monotone"
                      dataKey="Treasury"
                      stackId="1"
                      stroke={ALLOCATIONS[3].color}
                      fill={ALLOCATIONS[3].color}
                      fillOpacity={0.4}
                    />
                    <Area
                      type="monotone"
                      dataKey="Liquidity"
                      stackId="1"
                      stroke={ALLOCATIONS[4].color}
                      fill={ALLOCATIONS[4].color}
                      fillOpacity={0.4}
                    />
                    <Area
                      type="monotone"
                      dataKey="Public"
                      stackId="1"
                      stroke={ALLOCATIONS[5].color}
                      fill={ALLOCATIONS[5].color}
                      fillOpacity={0.4}
                    />
                    <Legend
                      iconSize={8}
                      wrapperStyle={{ fontSize: 11, color: "hsl(var(--muted-foreground))" }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* Utility */}
      <Section className="py-16 md:py-24">
        <div className="container-page">
          <SectionHeader
            eyebrow="Utility"
            title={
              <>
                Why DEFY
                <br />
                <span className="font-serif italic font-normal text-muted-foreground">
                  has gravity.
                </span>
              </>
            }
            description="Six independent reasons to hold and stake — every one of them productive, none of them speculative-only."
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {UTILITY.map((u, i) => (
              <motion.div
                key={u.title}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="surface rounded-xl p-6"
              >
                <u.icon className="h-5 w-5 text-primary mb-7" />
                <h3 className="font-display text-base font-semibold tracking-tight mb-1">
                  {u.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {u.body}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* Value capture */}
      <Section className="py-16 md:py-24">
        <div className="container-page">
          <SectionHeader
            eyebrow="Value capture"
            title="Where every basis point flows."
            description="Every fee in the protocol routes back to DEFY holders or the DAO. No off-chain leakage."
          />
          <div className="surface rounded-2xl overflow-hidden">
            <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-3 text-[11px] uppercase tracking-widest text-muted-foreground border-b border-border">
              <div className="col-span-3">Source</div>
              <div className="col-span-2">Rate</div>
              <div className="col-span-7">Where it goes</div>
            </div>
            {VALUE_CAPTURE.map((v, i) => (
              <motion.div
                key={v.source}
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.04 }}
                className="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-4 px-6 py-5 items-center border-b border-border last:border-b-0 hover:bg-elevated transition-colors"
              >
                <div className="md:col-span-3">
                  <p className="font-medium">{v.source}</p>
                </div>
                <div className="md:col-span-2 tabular text-sm">
                  <span className="font-semibold text-primary">{v.rate}</span>
                </div>
                <div className="md:col-span-7 text-sm text-muted-foreground flex items-center gap-2">
                  <ArrowRight className="h-3.5 w-3.5 text-muted-foreground/60" />
                  {v.flow}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Burn / supply mechanics callout */}
          <div className="mt-6 surface rounded-xl p-6 flex items-start gap-4">
            <div className="h-10 w-10 rounded-md bg-[hsl(var(--warn)/0.15)] grid place-items-center shrink-0">
              <Flame className="h-5 w-5 text-[hsl(var(--warn))]" />
            </div>
            <div>
              <p className="font-display font-semibold">Deflationary by design</p>
              <p className="text-sm text-muted-foreground mt-1 leading-relaxed max-w-2xl">
                50% of swap fees are used to buy DEFY from the open market and burn
                it permanently. Cumulative burns are visible on-chain. As volume
                grows, supply shrinks.
              </p>
              <p className="mt-3 text-[11px] tabular text-muted-foreground">
                Burned to date: <span className="text-foreground font-medium">12.4M DEFY</span> ·
                Last 30d: <span className="text-foreground font-medium">+820K DEFY</span>
              </p>
            </div>
          </div>
        </div>
      </Section>

      {/* Contracts */}
      <Section className="py-16 md:py-24">
        <div className="container-page">
          <SectionHeader
            eyebrow="On-chain"
            title="Verified contracts."
            description="Everything that holds DEFY or routes fees is open-source, verified on Etherscan, and audited."
          />
          <div className="surface rounded-2xl overflow-hidden">
            {CONTRACTS.map((c) => (
              <div
                key={c.address}
                className="flex items-center justify-between gap-4 px-5 py-4 border-b border-border last:border-b-0 hover:bg-elevated transition-colors"
              >
                <div className="flex items-center gap-3">
                  <ChainIcon name={c.chain} size="sm" />
                  <div>
                    <p className="font-medium text-sm">{c.label}</p>
                    <p className="text-[11px] text-muted-foreground">{c.chain}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-[12px] text-muted-foreground tabular">
                    {shortAddress(c.address)}
                  </span>
                  <CopyAddress address={c.address} />
                  <a
                    href={`https://etherscan.io/address/${c.address}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                    aria-label="View on Etherscan"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-3">
            {[
              { name: "Trail of Bits", date: "Aug 2025" },
              { name: "OpenZeppelin", date: "Sep 2025" },
              { name: "Code4rena", date: "Oct 2025" },
            ].map((a) => (
              <div
                key={a.name}
                className="surface rounded-xl p-4 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <ShieldCheck className="h-5 w-5 text-[hsl(var(--success))]" />
                  <div>
                    <p className="font-medium text-sm">{a.name}</p>
                    <p className="text-[11px] text-muted-foreground tabular">
                      Audited · {a.date}
                    </p>
                  </div>
                </div>
                <Badge variant="success">Passed</Badge>
              </div>
            ))}
          </div>
        </div>
      </Section>
    </>
  );
}

export default TokenPage;
