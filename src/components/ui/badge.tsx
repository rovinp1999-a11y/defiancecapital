import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[11px] font-medium tabular transition-colors",
  {
    variants: {
      variant: {
        default:
          "border-primary/40 bg-primary/10 text-primary",
        muted: "border-border bg-card text-muted-foreground",
        outline: "border-border text-foreground",
        success:
          "border-[hsl(var(--success)/0.4)] bg-[hsl(var(--success)/0.1)] text-[hsl(var(--success))]",
        danger:
          "border-[hsl(var(--danger)/0.4)] bg-[hsl(var(--danger)/0.1)] text-[hsl(var(--danger))]",
        warn:
          "border-[hsl(var(--warn)/0.4)] bg-[hsl(var(--warn)/0.1)] text-[hsl(var(--warn))]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
