import { ChainIcon } from "@/components/icons/chain-icon";
import { cn } from "@/lib/utils";

export function ChainPill({
  name,
  className,
}: {
  name: string;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2 py-1 rounded-full border border-border bg-card text-[11px] font-medium text-foreground/90",
        className,
      )}
    >
      <ChainIcon name={name} size="xs" />
      {name}
    </span>
  );
}
