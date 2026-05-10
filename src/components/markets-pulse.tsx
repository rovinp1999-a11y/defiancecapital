import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  TrendingUp,
  TrendingDown,
  Vote,
  Rocket,
  Clock,
  CheckCircle2,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TokenPair, TokenIcon } from "@/components/icons/token-icon";
import { useNftCollections } from "@/hooks/use-nft-collections";
import { cn, formatNumber } from "@/lib/utils";

const HOT_POOLS = [
  { base: "DEFY", quote: "ETH", apy: 145.2, change: 4.8 },
  { base: "USDC", quote: "DEFY", apy: 89.5, change: -1.2 },
  { base: "GAME", quote: "DEFY", apy: 234.7, change: 12.4 },
];

const HOT_PROPOSAL = {
  id: "DEFY-014",
  title: "Add Base mainnet support across all modules",
  endsIn: "Ends 1d 8h",
  for: 78,
};

const HOT_IDO = {
  name: "Aetherchain",
  ticker: "AETH",
  category: "Infrastructure",
  raised: 1.84,
  target: 2.5,
  endsIn: "Ends 2d 14h",
};

export function MarketsPulse() {
  const { data: collections } = useNftCollections(4);
  const topNfts = (collections ?? []).slice(0, 4);

  return (
    <div className="container-page">
      <div className="flex items-end justify-between gap-4 mb-10 flex-wrap">
        <div>
          <p className="eyebrow eyebrow-dot mb-3">Markets pulse</p>
          <h2 className="display-2 text-[clamp(28px,3.6vw,48px)] text-balance">
            What&apos;s moving{" "}
            <span className="font-serif italic font-normal text-muted-foreground">
              right now.
            </span>
          </h2>
        </div>
        <Badge variant="muted" className="font-mono">
          <span className="h-1.5 w-1.5 rounded-full bg-[hsl(var(--success))] animate-pulse" />
          Live
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Top NFTs (4 mini) */}
        <Link
          to="/nft-marketplace"
          className="lg:col-span-7 surface rounded-xl p-5 block group hover:bg-elevated transition-colors"
        >
          <div className="flex items-center justify-between mb-4">
            <p className="font-display font-semibold text-sm">Top NFTs</p>
            <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground group-hover:text-foreground transition-colors">
              All collections <ArrowUpRight className="h-3 w-3" />
            </span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {topNfts.length === 0
              ? Array.from({ length: 4 }).map((_, i) => (
                  <div
                    key={i}
                    className="aspect-square rounded-md bg-muted shimmer-bg"
                  />
                ))
              : topNfts.map((c) => (
                  <div key={c.id} className="space-y-2">
                    <div className="aspect-square rounded-md overflow-hidden bg-muted">
                      <img
                        src={c.image}
                        alt={c.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    </div>
                    <div>
                      <p className="text-[11px] font-medium truncate">{c.name}</p>
                      <p className="text-[10px] text-muted-foreground tabular flex items-center gap-1">
                        {c.floorPriceEth !== null ? (
                          <>
                            <TokenIcon symbol="ETH" size="xs" />
                            {c.floorPriceEth.toFixed(c.floorPriceEth < 1 ? 3 : 2)}
                          </>
                        ) : (
                          "—"
                        )}
                      </p>
                    </div>
                  </div>
                ))}
          </div>
        </Link>

        {/* Hot pools (3 mini) */}
        <Link
          to="/defi"
          className="lg:col-span-5 surface rounded-xl p-5 block group hover:bg-elevated transition-colors"
        >
          <div className="flex items-center justify-between mb-4">
            <p className="font-display font-semibold text-sm">Top yields</p>
            <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground group-hover:text-foreground transition-colors">
              All pools <ArrowUpRight className="h-3 w-3" />
            </span>
          </div>
          <div className="space-y-3">
            {HOT_POOLS.map((p, i) => (
              <motion.div
                key={`${p.base}-${p.quote}`}
                initial={{ opacity: 0, x: -8 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="flex items-center gap-3"
              >
                <TokenPair base={p.base} quote={p.quote} size="sm" />
                <div className="flex-1 min-w-0">
                  <p className="text-[12px] font-medium tabular truncate">
                    {p.base} <span className="text-muted-foreground">/</span>{" "}
                    {p.quote}
                  </p>
                  <p
                    className={cn(
                      "text-[10px] flex items-center gap-0.5 tabular",
                      p.change >= 0
                        ? "text-[hsl(var(--success))]"
                        : "text-[hsl(var(--danger))]",
                    )}
                  >
                    {p.change >= 0 ? (
                      <TrendingUp className="h-2.5 w-2.5" />
                    ) : (
                      <TrendingDown className="h-2.5 w-2.5" />
                    )}
                    {p.change >= 0 ? "+" : ""}
                    {p.change.toFixed(1)}% 24h
                  </p>
                </div>
                <p className="text-sm font-semibold tabular text-primary">
                  {p.apy.toFixed(1)}%
                </p>
              </motion.div>
            ))}
          </div>
        </Link>

        {/* Active proposal */}
        <Link
          to="/governance"
          className="lg:col-span-6 surface rounded-xl p-5 block group hover:bg-elevated transition-colors"
        >
          <div className="flex items-center justify-between mb-4">
            <p className="font-display font-semibold text-sm flex items-center gap-2">
              <Vote className="h-4 w-4 text-primary" /> Active proposal
            </p>
            <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground group-hover:text-foreground transition-colors">
              All proposals <ArrowUpRight className="h-3 w-3" />
            </span>
          </div>
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span className="text-[11px] font-mono text-muted-foreground tabular">
              {HOT_PROPOSAL.id}
            </span>
            <Badge variant="default">
              <Clock className="h-3 w-3" /> {HOT_PROPOSAL.endsIn}
            </Badge>
          </div>
          <p className="font-display font-semibold leading-snug">
            {HOT_PROPOSAL.title}
          </p>
          <div className="mt-4">
            <div className="flex justify-between text-[11px] mb-1.5 tabular">
              <span className="text-[hsl(var(--success))] font-medium">
                For {HOT_PROPOSAL.for}%
              </span>
              <span className="text-[hsl(var(--danger))] font-medium">
                Against {100 - HOT_PROPOSAL.for}%
              </span>
            </div>
            <div className="h-1 bg-secondary rounded-full overflow-hidden flex">
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: `${HOT_PROPOSAL.for}%` }}
                viewport={{ once: true }}
                transition={{ duration: 1 }}
                className="h-full bg-[hsl(var(--success))]"
              />
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: `${100 - HOT_PROPOSAL.for}%` }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 0.05 }}
                className="h-full bg-[hsl(var(--danger))]"
              />
            </div>
          </div>
        </Link>

        {/* IDO ending soon */}
        <Link
          to="/launchpad"
          className="lg:col-span-6 surface rounded-xl p-5 block group hover:bg-elevated transition-colors"
        >
          <div className="flex items-center justify-between mb-4">
            <p className="font-display font-semibold text-sm flex items-center gap-2">
              <Rocket className="h-4 w-4 text-primary" /> Live IDO
            </p>
            <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground group-hover:text-foreground transition-colors">
              All launches <ArrowUpRight className="h-3 w-3" />
            </span>
          </div>
          <div className="flex items-start gap-3">
            <div className="h-12 w-12 rounded-lg shrink-0 bg-gradient-to-br from-violet-500 via-fuchsia-500 to-pink-500 grid place-items-center font-display font-semibold text-white">
              {HOT_IDO.ticker[0]}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="font-display font-semibold">
                  {HOT_IDO.name}{" "}
                  <span className="text-muted-foreground font-mono text-xs">
                    ${HOT_IDO.ticker}
                  </span>
                </p>
                <Badge variant="success">
                  <span className="h-1.5 w-1.5 rounded-full bg-current animate-pulse" />
                  Live
                </Badge>
              </div>
              <p className="text-[11px] text-muted-foreground font-mono uppercase tracking-widest mt-0.5">
                {HOT_IDO.category}
              </p>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex justify-between text-[11px] mb-1.5 tabular">
              <span className="text-muted-foreground">
                ${HOT_IDO.raised}M raised · {HOT_IDO.endsIn}
              </span>
              <span className="font-medium">${HOT_IDO.target}M target</span>
            </div>
            <div className="h-1 bg-secondary rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: `${(HOT_IDO.raised / HOT_IDO.target) * 100}%` }}
                viewport={{ once: true }}
                transition={{ duration: 1 }}
                className="h-full bg-gradient-to-r from-primary to-accent"
              />
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}
