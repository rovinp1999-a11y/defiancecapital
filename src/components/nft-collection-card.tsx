import { motion } from "framer-motion";
import { CheckCircle2, ArrowUpRight, ImageOff } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { ChainIcon } from "@/components/icons/chain-icon";
import { TokenIcon } from "@/components/icons/token-icon";
import { WatchlistStar } from "@/components/watchlist-star";
import { TiltCard } from "@/components/tilt-card";
import { cn, formatCurrency, formatNumber } from "@/lib/utils";
import {
  type NftCollection,
  chainFromPlatform,
} from "@/hooks/use-nft-collections";

function CollectionImage({
  src,
  name,
  className,
}: {
  src: string;
  name: string;
  className?: string;
}) {
  const [errored, setErrored] = useState(false);
  if (errored || !src) {
    return (
      <div
        className={cn(
          "grid place-items-center bg-muted text-muted-foreground",
          className,
        )}
      >
        <ImageOff className="h-5 w-5" />
      </div>
    );
  }
  return (
    <img
      src={src}
      alt={name}
      loading="lazy"
      onError={() => setErrored(true)}
      className={cn("object-cover w-full h-full", className)}
    />
  );
}

export function NftCollectionCard({
  c,
  index = 0,
}: {
  c: NftCollection;
  index?: number;
}) {
  const chain = chainFromPlatform(c.platform);
  const change = c.change24h ?? 0;
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, delay: index * 0.04 }}
    >
      <TiltCard className="surface rounded-xl overflow-hidden ring-card group h-full">
      <div className="relative aspect-square overflow-hidden bg-muted">
        <CollectionImage
          src={c.image}
          name={c.name}
          className="transition-transform duration-[1200ms] ease-out group-hover:scale-110"
        />
        {/* gradient overlay for legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent pointer-events-none" />
        <div className="absolute top-3 right-3 inline-flex items-center gap-1 px-2 py-1 rounded-full bg-black/55 backdrop-blur-md border border-white/10">
          <ChainIcon name={chain} size="xs" />
          <span className="text-[10px] font-medium text-white">{chain}</span>
        </div>
        <div className="absolute top-3 left-3 z-10">
          <div className="bg-black/55 backdrop-blur-md rounded-md border border-white/10">
            <WatchlistStar id={`nft:${c.id}`} label={c.name} size={14} />
          </div>
        </div>
      </div>
      <div className="p-5">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="font-display font-semibold text-sm flex items-center gap-1">
              <span className="truncate">{c.name}</span>
              <CheckCircle2 className="h-3.5 w-3.5 text-primary shrink-0" />
            </h3>
            <p className="text-[11px] text-muted-foreground mt-0.5 font-mono uppercase tracking-widest truncate">
              {c.symbol || "Collection"}
            </p>
          </div>
          {c.change24h !== null && (
            <span
              className={cn(
                "text-[11px] font-medium tabular shrink-0",
                change >= 0
                  ? "text-[hsl(var(--success))]"
                  : "text-[hsl(var(--danger))]",
              )}
            >
              {change >= 0 ? "+" : ""}
              {change.toFixed(1)}%
            </span>
          )}
        </div>
        <div className="mt-5 grid grid-cols-2 gap-3 text-xs">
          <div>
            <p className="text-[11px] text-muted-foreground uppercase tracking-widest">
              Floor
            </p>
            <p className="font-semibold tabular flex items-center gap-1 mt-0.5">
              {c.floorPriceEth !== null ? (
                <>
                  <TokenIcon symbol="ETH" size="xs" />
                  {c.floorPriceEth.toFixed(c.floorPriceEth < 1 ? 3 : 2)}
                </>
              ) : (
                <span className="text-muted-foreground">—</span>
              )}
            </p>
          </div>
          <div>
            <p className="text-[11px] text-muted-foreground uppercase tracking-widest">
              24h Volume
            </p>
            <p className="font-medium tabular mt-0.5">
              {c.volume24hEth !== null ? (
                <>
                  {formatNumber(c.volume24hEth)}{" "}
                  <span className="text-muted-foreground text-[10px]">ETH</span>
                </>
              ) : (
                <span className="text-muted-foreground">—</span>
              )}
            </p>
          </div>
        </div>
        <div className="mt-5 flex items-center justify-between">
          <p className="text-[11px] text-muted-foreground tabular">
            {c.totalSupply
              ? `${formatNumber(c.totalSupply)} items`
              : c.marketCapUsd
                ? `${formatCurrency(c.marketCapUsd)} market cap`
                : ""}
          </p>
          <Button variant="ghost" size="sm">
            View
            <ArrowUpRight className="h-3 w-3" />
          </Button>
        </div>
      </div>
      </TiltCard>
    </motion.div>
  );
}

export function NftCollectionCardSkeleton({ index = 0 }: { index?: number }) {
  return (
    <div
      className="surface rounded-xl overflow-hidden"
      style={{ opacity: 0.7 - index * 0.05 }}
    >
      <div className="aspect-square shimmer-bg" />
      <div className="p-5 space-y-4">
        <div className="space-y-2">
          <div className="h-3 w-2/3 shimmer-bg rounded" />
          <div className="h-2 w-1/3 shimmer-bg rounded" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <div className="h-2 w-12 shimmer-bg rounded" />
            <div className="h-3 w-16 shimmer-bg rounded" />
          </div>
          <div className="space-y-1.5">
            <div className="h-2 w-16 shimmer-bg rounded" />
            <div className="h-3 w-20 shimmer-bg rounded" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function NftCollectionRow({
  c,
  index = 0,
}: {
  c: NftCollection;
  index?: number;
}) {
  const chain = chainFromPlatform(c.platform);
  const change = c.change24h ?? 0;
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.4, delay: index * 0.04 }}
      className="grid grid-cols-2 md:grid-cols-12 gap-2 md:gap-4 px-6 py-4 items-center border-b border-border last:border-b-0 hover:bg-elevated transition-colors"
    >
      <div className="col-span-2 md:col-span-4 flex items-center gap-3 min-w-0">
        <WatchlistStar id={`nft:${c.id}`} label={c.name} size={13} />
        <span className="text-[11px] font-mono text-muted-foreground tabular w-5 shrink-0">
          {String(index + 1).padStart(2, "0")}
        </span>
        <div className="h-12 w-12 rounded-md overflow-hidden shrink-0 ring-1 ring-border bg-muted">
          <CollectionImage src={c.image} name={c.name} />
        </div>
        <div className="min-w-0">
          <p className="font-display font-semibold text-sm flex items-center gap-1.5 truncate">
            {c.name}
            <CheckCircle2 className="h-3 w-3 text-primary shrink-0" />
          </p>
          <div className="flex items-center gap-2 mt-0.5">
            <ChainIcon name={chain} size="xs" />
            <p className="text-[11px] text-muted-foreground font-mono uppercase tracking-widest truncate">
              {c.symbol || "Collection"}
            </p>
          </div>
        </div>
      </div>
      <div className="md:col-span-2 md:text-right tabular text-sm">
        <p className="md:hidden text-[11px] text-muted-foreground">Floor</p>
        {c.floorPriceEth !== null ? (
          <span className="font-medium">
            {c.floorPriceEth.toFixed(c.floorPriceEth < 1 ? 3 : 2)} ETH
          </span>
        ) : (
          <span className="text-muted-foreground">—</span>
        )}
      </div>
      <div className="md:col-span-2 md:text-right tabular text-sm">
        <p className="md:hidden text-[11px] text-muted-foreground">Volume</p>
        {c.volume24hEth !== null ? `${formatNumber(c.volume24hEth)} ETH` : "—"}
      </div>
      <div className="md:col-span-2 md:text-right tabular text-sm">
        <p className="md:hidden text-[11px] text-muted-foreground">Items</p>
        {c.totalSupply ? formatNumber(c.totalSupply) : "—"}
      </div>
      <div className="md:col-span-1 md:text-right tabular text-sm">
        <p className="md:hidden text-[11px] text-muted-foreground">24h</p>
        {c.change24h !== null ? (
          <span
            className={cn(
              "font-medium",
              change >= 0
                ? "text-[hsl(var(--success))]"
                : "text-[hsl(var(--danger))]",
            )}
          >
            {change >= 0 ? "+" : ""}
            {change.toFixed(1)}%
          </span>
        ) : (
          <span className="text-muted-foreground">—</span>
        )}
      </div>
      <div className="md:col-span-1 md:text-right">
        <Button variant="ghost" size="sm">
          <ArrowUpRight className="h-3 w-3" />
        </Button>
      </div>
    </motion.div>
  );
}

export function NftCollectionRowSkeleton({ index = 0 }: { index?: number }) {
  return (
    <div className="grid grid-cols-12 gap-4 px-6 py-4 items-center border-b border-border last:border-b-0">
      <div className="col-span-4 flex items-center gap-4">
        <span className="text-[11px] font-mono text-muted-foreground tabular w-6">
          {String(index + 1).padStart(2, "0")}
        </span>
        <div className="h-12 w-12 rounded-md shimmer-bg" />
        <div className="space-y-1.5 flex-1">
          <div className="h-3 w-32 shimmer-bg rounded" />
          <div className="h-2 w-20 shimmer-bg rounded" />
        </div>
      </div>
      <div className="col-span-2 text-right">
        <div className="h-3 w-16 shimmer-bg rounded ml-auto" />
      </div>
      <div className="col-span-2 text-right">
        <div className="h-3 w-20 shimmer-bg rounded ml-auto" />
      </div>
      <div className="col-span-2 text-right">
        <div className="h-3 w-16 shimmer-bg rounded ml-auto" />
      </div>
      <div className="col-span-1 text-right">
        <div className="h-3 w-10 shimmer-bg rounded ml-auto" />
      </div>
      <div className="col-span-1" />
    </div>
  );
}
