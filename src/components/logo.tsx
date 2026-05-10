import { cn } from "@/lib/utils";

export function Logo({
  className,
  size = 28,
}: {
  className?: string;
  size?: number;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      className={cn("shrink-0", className)}
      aria-hidden
    >
      <rect
        x="0.5"
        y="0.5"
        width="31"
        height="31"
        rx="7"
        fill="hsl(var(--primary))"
      />
      <path
        d="M9 8h7.5c5.2 0 8.5 3.2 8.5 8s-3.3 8-8.5 8H9V8zm5.5 4.5v7h2c2.7 0 4.4-1.3 4.4-3.5s-1.7-3.5-4.4-3.5h-2z"
        fill="hsl(var(--primary-foreground))"
      />
    </svg>
  );
}

export function Wordmark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "font-display font-semibold tracking-tight text-[15px]",
        className,
      )}
    >
      DEFIANCE<span className="opacity-60">/HUB</span>
    </span>
  );
}
