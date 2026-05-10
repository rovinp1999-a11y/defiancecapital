import { Star } from "lucide-react";
import { toast } from "sonner";

import { cn } from "@/lib/utils";
import { useWatchlist } from "@/hooks/use-watchlist";

export function WatchlistStar({
  id,
  label,
  className,
  size = 16,
}: {
  id: string;
  label: string;
  className?: string;
  size?: number;
}) {
  const { has, toggle } = useWatchlist();
  const isStarred = has(id);

  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        const nowOn = !isStarred;
        toggle(id);
        toast(nowOn ? `Added ${label} to watchlist` : `Removed ${label}`, {
          description: nowOn ? "We'll surface updates in your feed" : undefined,
        });
      }}
      aria-label={isStarred ? `Unstar ${label}` : `Star ${label}`}
      className={cn(
        "grid place-items-center rounded-md transition-colors",
        "hover:bg-secondary",
        isStarred ? "text-primary" : "text-muted-foreground hover:text-foreground",
        className,
      )}
      style={{ width: size + 12, height: size + 12 }}
    >
      <Star
        size={size}
        className={cn(
          "transition-transform",
          isStarred && "fill-current scale-110",
        )}
      />
    </button>
  );
}
