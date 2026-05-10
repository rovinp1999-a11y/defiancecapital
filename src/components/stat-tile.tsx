import { cn } from "@/lib/utils";
import { AnimatedCounter } from "@/components/animated-counter";

type Props = {
  label: string;
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  hint?: string;
  className?: string;
  size?: "sm" | "md" | "lg";
  trend?: number[]; // sparkline data
  trendUp?: boolean;
};

const sizeMap = {
  sm: "text-xl md:text-2xl",
  md: "text-2xl md:text-3xl",
  lg: "text-3xl md:text-5xl",
} as const;

/**
 * Tiny SVG sparkline. No deps — direct path math.
 */
function Sparkline({
  data,
  up = true,
  className,
}: {
  data: number[];
  up?: boolean;
  className?: string;
}) {
  if (!data || data.length < 2) return null;
  const w = 80;
  const h = 22;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const step = w / (data.length - 1);
  const points = data
    .map((v, i) => {
      const x = i * step;
      const y = h - ((v - min) / range) * h;
      return `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
  const fill = points + ` L${w},${h} L0,${h} Z`;
  const color = up ? "hsl(var(--success))" : "hsl(var(--danger))";
  return (
    <svg
      width={w}
      height={h}
      viewBox={`0 0 ${w} ${h}`}
      className={cn("overflow-visible", className)}
      aria-hidden
    >
      <defs>
        <linearGradient id={`spark-${data[0]}-${data.length}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.35" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={fill} fill={`url(#spark-${data[0]}-${data.length})`} />
      <path
        d={points}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function StatTile({
  label,
  value,
  prefix,
  suffix,
  decimals = 0,
  hint,
  className,
  size = "md",
  trend,
  trendUp = true,
}: Props) {
  return (
    <div
      className={cn(
        "surface rounded-xl p-5 flex flex-col justify-between gap-3 relative overflow-hidden",
        className,
      )}
    >
      <div className="flex items-start justify-between">
        <p className="eyebrow">{label}</p>
        {trend && <Sparkline data={trend} up={trendUp} />}
      </div>
      <div>
        <p
          className={cn(
            "font-display font-semibold tracking-tight tabular leading-none",
            sizeMap[size],
          )}
        >
          <AnimatedCounter
            value={value}
            prefix={prefix}
            suffix={suffix}
            decimals={decimals}
          />
        </p>
        {hint && (
          <p className="text-xs text-muted-foreground mt-2 tabular">{hint}</p>
        )}
      </div>
    </div>
  );
}
