import {
  ShoppingCart,
  Palette,
  Crown,
  Gamepad2,
  TrendingUp,
  Users,
  ArrowRight,
  AlertCircle,
} from "lucide-react";
import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PageHero } from "@/components/page-hero";
import { Section, SectionHeader } from "@/components/section";
import { StatTile } from "@/components/stat-tile";
import { TokenIcon } from "@/components/icons/token-icon";
import {
  NftCollectionCard,
  NftCollectionCardSkeleton,
  NftCollectionRow,
  NftCollectionRowSkeleton,
} from "@/components/nft-collection-card";
import { useNftCollections } from "@/hooks/use-nft-collections";

/**
 * Activity rows reference real-collection slugs so the row art loads from
 * the same live data we already fetched (CoinGecko-hosted images).
 */
const activity: {
  event: "Sale" | "Bid" | "Listing";
  collectionSlug: string; // matches NftCollection.id
  tokenId: string;
  price: string;
  currency: "ETH" | "USDC";
  buyer: string;
  ago: string;
}[] = [
  {
    event: "Sale",
    collectionSlug: "cryptopunks",
    tokenId: "#7421",
    price: "31.50",
    currency: "ETH",
    buyer: "0x7a1f…d28c",
    ago: "12s ago",
  },
  {
    event: "Bid",
    collectionSlug: "azuki",
    tokenId: "#0098",
    price: "1.05",
    currency: "ETH",
    buyer: "0x1c33…b91a",
    ago: "2m ago",
  },
  {
    event: "Sale",
    collectionSlug: "mutant-ape-yacht-club",
    tokenId: "#1138",
    price: "1.42",
    currency: "ETH",
    buyer: "0x9b62…7f0e",
    ago: "5m ago",
  },
  {
    event: "Listing",
    collectionSlug: "doodles-official",
    tokenId: "#3050",
    price: "0.85",
    currency: "ETH",
    buyer: "0x4f88…0a21",
    ago: "9m ago",
  },
  {
    event: "Sale",
    collectionSlug: "moonbirds",
    tokenId: "#7820",
    price: "0.92",
    currency: "ETH",
    buyer: "0xbd14…44e7",
    ago: "14m ago",
  },
];

const eventVariant: Record<
  (typeof activity)[number]["event"],
  "success" | "default" | "muted"
> = {
  Sale: "success",
  Bid: "default",
  Listing: "muted",
};

const features = [
  {
    icon: Crown,
    title: "Royalties on-chain",
    description: "Creators automatically earn on every secondary sale.",
  },
  {
    icon: Gamepad2,
    title: "Gaming integration",
    description: "Use your NFT directly inside compatible games.",
  },
  {
    icon: TrendingUp,
    title: "Price analytics",
    description: "Floor history, holder concentration, rarity scoring.",
  },
  {
    icon: Users,
    title: "Creator community",
    description: "Connect with artists, collectors, and game studios.",
  },
];

export function NftMarketplacePage() {
  const { data, isLoading, isError, error } = useNftCollections(12);
  const featured = (data ?? []).slice(0, 4);
  const rest = (data ?? []).slice(4);
  const source = data?.[0]?.source ?? "coingecko";
  const sourceLabel: Record<typeof source, string> = {
    opensea: "OpenSea",
    magiceden: "Magic Eden",
    coingecko: "CoinGecko",
    fallback: "Curated",
  };
  const sourceLink: Record<typeof source, string> = {
    opensea: "https://docs.opensea.io/",
    magiceden: "https://docs.magiceden.io/",
    coingecko: "https://www.coingecko.com/en/api",
    fallback: "#",
  };

  return (
    <>
      <PageHero
        eyebrow="NFTs"
        title={
          <>
            Discover, collect,
            <br />
            <span className="font-serif italic font-normal text-muted-foreground">
              and trade.
            </span>
          </>
        }
        description="Curated drops, fair royalties, a clean trading experience. Built for gaming-native NFTs and digital art alike."
        actions={
          <>
            <Button variant="primary" size="xl">
              <ShoppingCart className="h-4 w-4" />
              Browse NFTs
            </Button>
            <Button variant="secondary" size="xl">
              <Palette className="h-4 w-4" />
              Mint your own
            </Button>
          </>
        }
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <StatTile
            label="Total NFTs"
            value={45.2}
            suffix="K"
            decimals={1}
          />
          <StatTile label="Total volume" value={1234} suffix=" ETH" />
          <StatTile
            label="Active traders"
            value={8.9}
            suffix="K"
            decimals={1}
          />
          <StatTile label="Collections" value={156} />
        </div>
      </PageHero>

      <Section className="py-20 md:py-28">
        <div className="container-page">
          <div className="flex items-end justify-between gap-4 mb-14 flex-wrap">
            <div className="max-w-2xl">
              <p className="eyebrow eyebrow-dot mb-4">Featured drops</p>
              <h2 className="display-2 text-[clamp(32px,4.5vw,64px)] text-balance">
                This week&apos;s
                <br />
                <span className="font-serif italic font-normal text-muted-foreground">
                  trending.
                </span>
              </h2>
            </div>
            <Badge variant="muted" className="font-mono">
              <span className="h-1.5 w-1.5 rounded-full bg-[hsl(var(--success))] animate-pulse" />
              {source === "fallback" ? "Curated · offline data" : `Live · ${sourceLabel[source]}`}
            </Badge>
          </div>

          {isError ? (
            <div className="surface rounded-xl p-7 flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-[hsl(var(--warn))] shrink-0 mt-0.5" />
              <div>
                <p className="font-display font-semibold">
                  Couldn&apos;t reach the NFT data source
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  {(error as Error)?.message ??
                    "The marketplace data API is unreachable. We&apos;ll retry shortly."}
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {isLoading
                ? Array.from({ length: 4 }).map((_, i) => (
                    <NftCollectionCardSkeleton key={i} index={i} />
                  ))
                : featured.map((c, i) => (
                    <NftCollectionCard key={c.id} c={c} index={i} />
                  ))}
            </div>
          )}
        </div>
      </Section>

      <Section className="py-20 md:py-28">
        <div className="container-page">
          <SectionHeader
            eyebrow="Top collections"
            title="What everyone is talking about."
          />
          <div className="surface rounded-2xl overflow-hidden">
            <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-3 text-[11px] uppercase tracking-widest text-muted-foreground border-b border-border">
              <div className="col-span-4">Collection</div>
              <div className="col-span-2 text-right">Floor</div>
              <div className="col-span-2 text-right">Volume</div>
              <div className="col-span-2 text-right">Items</div>
              <div className="col-span-1 text-right">24h</div>
              <div className="col-span-1 text-right">Action</div>
            </div>

            {isLoading
              ? Array.from({ length: 6 }).map((_, i) => (
                  <NftCollectionRowSkeleton key={i} index={i} />
                ))
              : isError
                ? null
                : rest.map((c, i) => (
                    <NftCollectionRow key={c.id} c={c} index={i} />
                  ))}
          </div>
          <p className="mt-4 text-[11px] text-muted-foreground tabular text-right">
            Source:{" "}
            <a
              href={sourceLink[source]}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground"
            >
              {sourceLabel[source]} {source !== "fallback" && "API ↗"}
            </a>{" "}
            · Refreshes every 5 min · {data?.length ?? 0} collections loaded
          </p>
        </div>
      </Section>

      <Section className="py-20 md:py-28">
        <div className="container-page">
          <SectionHeader
            eyebrow="Live activity"
            title={
              <>
                Recent
                <br />
                <span className="font-serif italic font-normal text-muted-foreground">
                  on-chain events.
                </span>
              </>
            }
          />
          <div className="surface rounded-2xl overflow-hidden">
            {activity.map((a, i) => {
              const collection = (data ?? []).find((c) => c.id === a.collectionSlug);
              return (
                <motion.div
                  key={`${a.collectionSlug}-${a.tokenId}-${i}`}
                  initial={{ opacity: 0, y: 8 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.4, delay: i * 0.04 }}
                  className="flex items-center gap-4 px-5 py-4 border-b border-border last:border-b-0 hover:bg-elevated transition-colors"
                >
                  <div className="h-12 w-12 rounded-md overflow-hidden shrink-0 ring-1 ring-border bg-muted">
                    {collection?.image ? (
                      <img
                        src={collection.image}
                        alt={collection.name}
                        loading="lazy"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full shimmer-bg" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0 grid grid-cols-3 md:grid-cols-5 gap-3 items-center">
                    <div className="col-span-3 md:col-span-2 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge variant={eventVariant[a.event]}>{a.event}</Badge>
                        <p className="font-display font-semibold text-sm truncate">
                          {collection?.name ?? a.collectionSlug}{" "}
                          <span className="text-muted-foreground font-mono text-xs">
                            {a.tokenId}
                          </span>
                        </p>
                      </div>
                    </div>
                    <div className="hidden md:block tabular text-sm text-muted-foreground font-mono truncate">
                      {a.buyer}
                    </div>
                    <div className="md:text-right tabular text-sm font-medium flex items-center gap-1.5 md:justify-end">
                      <TokenIcon symbol={a.currency} size="xs" />
                      {a.price} {a.currency}
                    </div>
                    <div className="md:text-right text-[11px] text-muted-foreground tabular hidden md:block">
                      {a.ago}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
          <div className="flex justify-center mt-6">
            <Button variant="outline" size="sm">
              View all activity
              <ArrowRight className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </Section>

      <Section className="py-20 md:py-28">
        <div className="container-page">
          <SectionHeader
            eyebrow="Marketplace features"
            title="Built for creators and collectors."
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

export default NftMarketplacePage;
