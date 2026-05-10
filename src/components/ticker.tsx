import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown } from "lucide-react";
import { TokenIcon } from "@/components/icons/token-icon";

const items = [
  { sym: "ETH", price: 3812.42, change: 2.4 },
  { sym: "WBTC", price: 67_410.18, change: 0.9 },
  { sym: "DEFY", price: 1.842, change: 12.4 },
  { sym: "MATIC", price: 0.91, change: -1.2 },
  { sym: "ARB", price: 1.15, change: 3.8 },
  { sym: "OP", price: 2.64, change: -0.6 },
  { sym: "SOL", price: 168.31, change: 4.1 },
  { sym: "GAME", price: 0.072, change: 18.4 },
  { sym: "BASE", price: 1.04, change: 0.4 },
  { sym: "BNB", price: 612.5, change: 1.1 },
];

function fmt(n: number) {
  return n >= 1
    ? n.toLocaleString("en-US", { maximumFractionDigits: 2 })
    : n.toLocaleString("en-US", { maximumFractionDigits: 4 });
}

export function Ticker({ className }: { className?: string }) {
  const loop = [...items, ...items];

  return (
    <div
      className={cn(
        "relative w-full overflow-hidden border-y border-border bg-background py-3",
        className,
      )}
    >
      <div className="absolute inset-y-0 left-0 w-24 z-10 bg-gradient-to-r from-background to-transparent pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-24 z-10 bg-gradient-to-l from-background to-transparent pointer-events-none" />
      <div className="flex w-max animate-marquee gap-10">
        {loop.map((item, i) => {
          const up = item.change >= 0;
          return (
            <div
              key={i}
              className="flex items-center gap-2 text-[13px] tabular"
            >
              <TokenIcon symbol={item.sym} size="sm" />
              <span className="font-mono font-medium text-foreground/90">
                {item.sym}
              </span>
              <span className="text-muted-foreground">${fmt(item.price)}</span>
              <span
                className={cn(
                  "inline-flex items-center gap-0.5 font-medium",
                  up
                    ? "text-[hsl(var(--success))]"
                    : "text-[hsl(var(--danger))]",
                )}
              >
                {up ? (
                  <TrendingUp className="h-3 w-3" />
                ) : (
                  <TrendingDown className="h-3 w-3" />
                )}
                {up ? "+" : ""}
                {item.change.toFixed(1)}%
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
