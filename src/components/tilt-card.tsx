import { useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * Card that subtly tilts toward the cursor and shows a glossy highlight.
 * Respects prefers-reduced-motion (the spring just stays at rest).
 */
export function TiltCard({
  children,
  className,
  intensity = 8,
}: {
  children: React.ReactNode;
  className?: string;
  intensity?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [hover, setHover] = useState(false);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [intensity, -intensity]), {
    stiffness: 300,
    damping: 25,
  });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-intensity, intensity]), {
    stiffness: 300,
    damping: 25,
  });

  const glareX = useTransform(x, [-0.5, 0.5], ["20%", "80%"]);
  const glareY = useTransform(y, [-0.5, 0.5], ["20%", "80%"]);

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    x.set(px);
    y.set(py);
  };

  const onLeave = () => {
    x.set(0);
    y.set(0);
    setHover(false);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={onLeave}
      style={{
        rotateX,
        rotateY,
        transformPerspective: 1000,
        transformStyle: "preserve-3d",
      }}
      className={cn("relative will-change-transform", className)}
    >
      {children}
      <motion.div
        className="pointer-events-none absolute inset-0 rounded-[inherit] mix-blend-overlay"
        style={{
          background: hover
            ? `radial-gradient(circle at ${glareX.get()} ${glareY.get()}, rgba(255,255,255,0.18), transparent 50%)`
            : "transparent",
          opacity: hover ? 1 : 0,
          transition: "opacity 0.4s",
        }}
      />
    </motion.div>
  );
}
