import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * Slowly morphing radial-gradient blobs — purely decorative.
 * Lives behind the hero. Respects prefers-reduced-motion.
 */
export function MeshGradient({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-0 overflow-hidden",
        className,
      )}
      aria-hidden
    >
      <motion.div
        className="absolute -top-40 -left-40 h-[640px] w-[640px] rounded-full blur-3xl opacity-50"
        style={{
          background:
            "radial-gradient(circle at center, hsl(var(--primary) / 0.55), transparent 70%)",
        }}
        animate={{
          x: [0, 60, -40, 0],
          y: [0, 80, 40, 0],
          scale: [1, 1.15, 0.95, 1],
        }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -bottom-40 -right-40 h-[560px] w-[560px] rounded-full blur-3xl opacity-45"
        style={{
          background:
            "radial-gradient(circle at center, hsl(188 90% 52% / 0.55), transparent 70%)",
        }}
        animate={{
          x: [0, -50, 30, 0],
          y: [0, -40, 20, 0],
          scale: [1, 1.1, 0.92, 1],
        }}
        transition={{
          duration: 26,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
      />
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[480px] w-[480px] rounded-full blur-3xl opacity-30"
        style={{
          background:
            "radial-gradient(circle at center, hsl(322 95% 60% / 0.45), transparent 70%)",
        }}
        animate={{
          x: [-30, 40, -10, -30],
          y: [-20, 20, 30, -20],
          scale: [0.9, 1.08, 1, 0.9],
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 4,
        }}
      />
    </div>
  );
}
