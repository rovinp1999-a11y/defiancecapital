import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const COLORS = [
  "hsl(75 100% 56%)", // primary lime
  "hsl(188 90% 52%)", // accent cyan
  "hsl(322 95% 60%)", // gaming pink
  "hsl(38 95% 58%)",  // nft amber
  "hsl(262 83% 62%)", // purple
  "hsl(145 70% 50%)", // success green
];

type Piece = {
  id: number;
  x: number;
  y: number;
  rotate: number;
  scale: number;
  color: string;
  shape: "rect" | "circle" | "tri";
  duration: number;
  drift: number;
};

function makePieces(count: number, originX = 50): Piece[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: originX + (Math.random() - 0.5) * 12,
    y: 40 + Math.random() * 20,
    rotate: Math.random() * 360,
    scale: 0.6 + Math.random() * 0.8,
    color: COLORS[i % COLORS.length],
    shape: (["rect", "circle", "tri"] as const)[i % 3],
    duration: 1.4 + Math.random() * 1.2,
    drift: (Math.random() - 0.5) * 80,
  }));
}

export function Confetti({
  fire,
  count = 90,
  originX = 50,
}: {
  fire: boolean;
  count?: number;
  originX?: number;
}) {
  const [batches, setBatches] = useState<Piece[][]>([]);

  useEffect(() => {
    if (!fire) return;
    const id = Date.now();
    const pieces = makePieces(count, originX);
    setBatches((b) => [...b, pieces]);
    const t = setTimeout(() => {
      setBatches((b) => b.filter((batch) => batch[0]?.id !== pieces[0]?.id));
    }, 2700);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fire]);

  return (
    <div className="pointer-events-none fixed inset-0 z-[100] overflow-hidden">
      <AnimatePresence>
        {batches.map((batch, bi) => (
          <div key={bi}>
            {batch.map((p) => (
              <motion.div
                key={p.id}
                initial={{
                  left: `${p.x}%`,
                  top: `${p.y}%`,
                  opacity: 1,
                  rotate: p.rotate,
                  scale: p.scale,
                }}
                animate={{
                  top: "120%",
                  left: `calc(${p.x}% + ${p.drift}px)`,
                  rotate: p.rotate + 540,
                  opacity: 0,
                }}
                transition={{
                  duration: p.duration,
                  ease: [0.22, 0.6, 0.36, 1],
                }}
                className="absolute"
                style={{
                  width: p.shape === "tri" ? 0 : 10,
                  height: p.shape === "tri" ? 0 : 10,
                  background: p.shape === "tri" ? "transparent" : p.color,
                  borderRadius: p.shape === "circle" ? "50%" : 2,
                  ...(p.shape === "tri" && {
                    borderLeft: "5px solid transparent",
                    borderRight: "5px solid transparent",
                    borderBottom: `9px solid ${p.color}`,
                  }),
                }}
              />
            ))}
          </div>
        ))}
      </AnimatePresence>
    </div>
  );
}
