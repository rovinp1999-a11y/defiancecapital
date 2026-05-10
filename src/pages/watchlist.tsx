import { Link } from "react-router-dom";
import { Bookmark } from "lucide-react";

import { Button } from "@/components/ui/button";
import { PageHero } from "@/components/page-hero";
import { Section } from "@/components/section";
import { useWatchlist } from "@/hooks/use-watchlist";
import { useNftCollections } from "@/hooks/use-nft-collections";
import { NftCollectionCard, NftCollectionCardSkeleton } from "@/components/nft-collection-card";

export function WatchlistPage() {
  const { items } = useWatchlist();
  const { data, isLoading } = useNftCollections(12);

  const watchedCollections = (data ?? []).filter((c) => items.has(`nft:${c.id}`));

  return (
    <>
      <PageHero
        eyebrow="Watchlist"
        title={
          <>
            Tracking
            <br />
            <span className="font-serif italic font-normal text-muted-foreground">
              {items.size} {items.size === 1 ? "item" : "items"}.
            </span>
          </>
        }
        description="Star collections, pools, and proposals to surface them here. We'll alert you when something moves."
      />

      <Section className="py-14 md:py-20">
        <div className="container-page">
          {items.size === 0 ? (
            <div className="surface rounded-xl p-12 text-center max-w-2xl mx-auto">
              <div className="mx-auto h-12 w-12 rounded-full surface-muted grid place-items-center mb-4">
                <Bookmark className="h-5 w-5 text-muted-foreground" />
              </div>
              <p className="font-display text-xl font-semibold">Your watchlist is empty</p>
              <p className="text-sm text-muted-foreground mt-2 max-w-md mx-auto">
                Star NFT collections, DeFi pools, or governance proposals to keep them here.
              </p>
              <div className="flex gap-3 justify-center mt-6">
                <Button asChild variant="primary" size="sm">
                  <Link to="/nft-marketplace">Browse NFTs</Link>
                </Button>
                <Button asChild variant="secondary" size="sm">
                  <Link to="/defi">Explore DeFi</Link>
                </Button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {isLoading
                ? Array.from({ length: items.size }).map((_, i) => (
                    <NftCollectionCardSkeleton key={i} index={i} />
                  ))
                : watchedCollections.map((c, i) => (
                    <NftCollectionCard key={c.id} c={c} index={i} />
                  ))}
            </div>
          )}
        </div>
      </Section>
    </>
  );
}

export default WatchlistPage;
