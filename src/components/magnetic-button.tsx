import { forwardRef } from "react";
import { useMagnetic } from "@/hooks/use-magnetic";
import { Button, type ButtonProps } from "@/components/ui/button";

/**
 * A Button that subtly follows the cursor while hovered.
 * Wraps the standard Button — same API, same variants.
 */
export const MagneticButton = forwardRef<HTMLButtonElement, ButtonProps>(
  function MagneticButton(props, _forwarded) {
    // own the inner ref so we can apply the magnetic transform
    const ref = useMagnetic<HTMLDivElement>({ strength: 0.18 });
    return (
      <div ref={ref} className="inline-block will-change-transform">
        <Button {...props} />
      </div>
    );
  },
);
