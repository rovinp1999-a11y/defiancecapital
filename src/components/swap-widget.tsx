import { useEffect, useMemo, useState } from "react";
import * as Popover from "@radix-ui/react-popover";
import { motion } from "framer-motion";
import { ArrowDown, Settings2, Zap, Info, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { TokenIcon } from "@/components/icons/token-icon";
import { Confetti } from "@/components/confetti";
import { cn } from "@/lib/utils";

const TOKENS: { sym: string; name: string; price: number }[] = [
  { sym: "ETH", name: "Ether", price: 3812.42 },
  { sym: "WBTC", name: "Wrapped Bitcoin", price: 67_410.18 },
  { sym: "USDC", name: "USD Coin", price: 1.0 },
  { sym: "USDT", name: "Tether", price: 1.0 },
  { sym: "DEFY", name: "Defiance", price: 1.842 },
  { sym: "MATIC", name: "Polygon", price: 0.91 },
  { sym: "ARB", name: "Arbitrum", price: 1.15 },
  { sym: "OP", name: "Optimism", price: 2.64 },
  { sym: "SOL", name: "Solana", price: 168.31 },
];

function priceOf(sym: string) {
  return TOKENS.find((t) => t.sym === sym)?.price ?? 0;
}

function TokenSelect({
  value,
  onChange,
  exclude,
}: {
  value: string;
  onChange: (sym: string) => void;
  exclude?: string;
}) {
  const [open, setOpen] = useState(false);
  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <button
          type="button"
          className="flex items-center gap-2 surface rounded-full pl-1 pr-3 py-1 hover:bg-elevated transition-colors"
        >
          <TokenIcon symbol={value} size="md" />
          <span className="font-display font-semibold text-sm">{value}</span>
          <svg
            className="h-3 w-3 text-muted-foreground"
            viewBox="0 0 12 12"
            fill="none"
          >
            <path
              d="M2 4l4 4 4-4"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          align="end"
          sideOffset={6}
          className="z-50 w-72 surface rounded-xl shadow-2xl overflow-hidden p-1.5 max-h-80 overflow-y-auto"
        >
          {TOKENS.filter((t) => t.sym !== exclude).map((t) => (
            <button
              key={t.sym}
              type="button"
              onClick={() => {
                onChange(t.sym);
                setOpen(false);
              }}
              className={cn(
                "w-full flex items-center gap-3 px-2.5 py-2 rounded-md hover:bg-secondary text-left transition-colors",
                value === t.sym && "bg-secondary",
              )}
            >
              <TokenIcon symbol={t.sym} size="md" />
              <div className="flex-1">
                <p className="font-medium text-sm">{t.sym}</p>
                <p className="text-[11px] text-muted-foreground">{t.name}</p>
              </div>
              <p className="text-[11px] tabular text-muted-foreground">
                ${t.price < 10 ? t.price.toFixed(3) : t.price.toLocaleString("en-US", { maximumFractionDigits: 2 })}
              </p>
            </button>
          ))}
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}

function SettingsPopover({
  slippage,
  onSlippageChange,
}: {
  slippage: number;
  onSlippageChange: (v: number) => void;
}) {
  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <button
          type="button"
          className="h-8 w-8 grid place-items-center rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary"
          aria-label="Swap settings"
        >
          <Settings2 className="h-4 w-4" />
        </button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          align="end"
          sideOffset={6}
          className="z-50 w-72 surface rounded-xl shadow-2xl p-4"
        >
          <p className="eyebrow">Slippage tolerance</p>
          <div className="mt-2 flex gap-2">
            {[0.1, 0.5, 1.0].map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => onSlippageChange(v)}
                className={cn(
                  "flex-1 px-3 py-1.5 rounded-md text-xs font-medium tabular border transition-colors",
                  slippage === v
                    ? "bg-foreground text-background border-foreground"
                    : "border-border text-muted-foreground hover:text-foreground",
                )}
              >
                {v}%
              </button>
            ))}
            <input
              type="number"
              value={slippage}
              step="0.1"
              min="0.05"
              max="10"
              onChange={(e) => onSlippageChange(Number(e.target.value))}
              className="w-20 px-2 py-1.5 rounded-md border border-border bg-card text-xs tabular text-right"
            />
          </div>
          <p className="mt-4 eyebrow">Transaction deadline</p>
          <p className="text-xs text-muted-foreground mt-1.5">20 minutes</p>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}

export function SwapWidget({ className }: { className?: string }) {
  const [tokenIn, setTokenIn] = useState("ETH");
  const [tokenOut, setTokenOut] = useState("USDC");
  const [amountIn, setAmountIn] = useState("1");
  const [slippage, setSlippage] = useState(0.5);
  const [submitting, setSubmitting] = useState(false);
  const [confettiTick, setConfettiTick] = useState(0);

  const inUsd = useMemo(() => Number(amountIn || 0) * priceOf(tokenIn), [amountIn, tokenIn]);
  const amountOut = useMemo(() => {
    const ratio = priceOf(tokenIn) / priceOf(tokenOut);
    return ((Number(amountIn || 0) * ratio) * (1 - 0.003)).toFixed(
      tokenOut === "USDC" || tokenOut === "USDT" ? 2 : 6,
    );
  }, [amountIn, tokenIn, tokenOut]);
  const minReceived = useMemo(
    () => (Number(amountOut) * (1 - slippage / 100)).toFixed(
      tokenOut === "USDC" || tokenOut === "USDT" ? 2 : 6,
    ),
    [amountOut, slippage, tokenOut],
  );
  const priceImpact = 0.04 + (Number(amountIn || 0) > 5 ? 0.1 : 0);

  const flip = () => {
    setTokenIn(tokenOut);
    setTokenOut(tokenIn);
    setAmountIn(amountOut);
  };

  const handleSwap = () => {
    setSubmitting(true);
    toast.loading(`Swapping ${amountIn} ${tokenIn} → ~${amountOut} ${tokenOut}…`, {
      id: "swap",
    });
    setTimeout(() => {
      setSubmitting(false);
      setConfettiTick((c) => c + 1);
      toast.success(`Swap submitted`, {
        id: "swap",
        description: `Received ~${amountOut} ${tokenOut} · 0.003 ETH gas`,
      });
    }, 1600);
  };

  // Allow the home command palette / hash links to trigger this section
  useEffect(() => {
    if (window.location.hash === "#swap") {
      const el = document.getElementById("swap");
      el?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, []);

  return (
    <div
      id="swap"
      className={cn(
        "surface rounded-2xl p-4 md:p-5 max-w-md w-full relative",
        className,
      )}
    >
      <Confetti fire={confettiTick > 0} count={70} originX={50} />
      <div className="flex items-center justify-between mb-2">
        <p className="font-display font-semibold">Swap</p>
        <SettingsPopover slippage={slippage} onSlippageChange={setSlippage} />
      </div>

      {/* From */}
      <div className="surface-muted rounded-xl p-4">
        <div className="flex items-center justify-between text-[11px] uppercase tracking-widest text-muted-foreground mb-2">
          <span>You pay</span>
          <span className="tabular">Balance: 4.218 {tokenIn}</span>
        </div>
        <div className="flex items-center gap-3">
          <input
            type="number"
            value={amountIn}
            onChange={(e) => setAmountIn(e.target.value)}
            placeholder="0"
            className="flex-1 min-w-0 bg-transparent border-0 outline-none text-2xl md:text-3xl font-display font-semibold tabular tracking-tight"
          />
          <TokenSelect value={tokenIn} onChange={setTokenIn} exclude={tokenOut} />
        </div>
        <p className="mt-1 text-[11px] text-muted-foreground tabular">
          ${inUsd.toLocaleString("en-US", { maximumFractionDigits: 2 })}
        </p>
      </div>

      {/* Flip button */}
      <div className="flex justify-center -my-2 relative z-10">
        <button
          type="button"
          onClick={flip}
          className="h-9 w-9 grid place-items-center rounded-full surface ring-2 ring-background hover:bg-elevated transition-colors text-muted-foreground hover:text-foreground"
          aria-label="Flip"
        >
          <ArrowDown className="h-4 w-4" />
        </button>
      </div>

      {/* To */}
      <div className="surface-muted rounded-xl p-4">
        <div className="flex items-center justify-between text-[11px] uppercase tracking-widest text-muted-foreground mb-2">
          <span>You receive</span>
          <span className="tabular">Balance: 12,450 {tokenOut}</span>
        </div>
        <div className="flex items-center gap-3">
          <p className="flex-1 min-w-0 truncate text-2xl md:text-3xl font-display font-semibold tabular tracking-tight">
            {amountOut}
          </p>
          <TokenSelect value={tokenOut} onChange={setTokenOut} exclude={tokenIn} />
        </div>
        <p className="mt-1 text-[11px] text-muted-foreground tabular">
          ${(Number(amountOut) * priceOf(tokenOut)).toLocaleString("en-US", { maximumFractionDigits: 2 })}
        </p>
      </div>

      {/* Quote details */}
      <motion.div
        layout
        className="mt-3 space-y-1.5 text-[11px] tabular px-1"
      >
        <div className="flex justify-between text-muted-foreground">
          <span className="flex items-center gap-1">
            <Zap className="h-3 w-3" /> 1 {tokenIn} ={" "}
            {(priceOf(tokenIn) / priceOf(tokenOut)).toLocaleString("en-US", {
              maximumFractionDigits: 4,
            })}{" "}
            {tokenOut}
          </span>
          <span>via Defiance Router</span>
        </div>
        <div className="flex justify-between text-muted-foreground">
          <span>Price impact</span>
          <span className={priceImpact > 0.5 ? "text-[hsl(var(--warn))]" : ""}>
            {priceImpact.toFixed(2)}%
          </span>
        </div>
        <div className="flex justify-between text-muted-foreground">
          <span>Min received ({slippage}% slippage)</span>
          <span>
            {minReceived} {tokenOut}
          </span>
        </div>
        <div className="flex justify-between text-muted-foreground">
          <span className="flex items-center gap-1">
            <Info className="h-3 w-3" /> Network fee
          </span>
          <span>~$2.40</span>
        </div>
      </motion.div>

      <Button
        variant="primary"
        size="lg"
        className="w-full mt-4"
        disabled={!Number(amountIn) || submitting}
        onClick={handleSwap}
      >
        {submitting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Confirming…
          </>
        ) : !Number(amountIn) ? (
          "Enter amount"
        ) : (
          "Swap"
        )}
      </Button>
    </div>
  );
}
