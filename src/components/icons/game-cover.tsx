import { useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Real themed cover photography for game cards via Unsplash.
 * Each gameId maps to a curated photo ID — Unsplash's CDN is CORS-enabled
 * and reachable from common environments.
 */

const GAME_COVERS: Record<string, { photoId: string; tint: string }> = {
  // CyberRealm Chronicles — fantasy / RPG
  cyberrealm: {
    photoId: "1542751371-adc38448a05e", // dragon/fantasy castle vibe
    tint: "from-fuchsia-600/40 via-purple-700/30 to-transparent",
  },
  // Quantum Racers — racing
  "quantum-racers": {
    photoId: "1492144534655-ae79c964c9d7", // motion blur racing
    tint: "from-cyan-500/40 via-blue-700/30 to-transparent",
  },
  // DeFi Defenders — strategy
  "defi-defenders": {
    photoId: "1606167668584-78701c57f13d", // strategic / abstract
    tint: "from-emerald-500/40 via-teal-700/30 to-transparent",
  },
  // MetaVerse Miners — mining/sci-fi
  "metaverse-miners": {
    photoId: "1518709268805-4e9042af2176", // mountains / minerals
    tint: "from-amber-500/40 via-orange-700/30 to-transparent",
  },
  // Astral Tactics — space / cosmic
  "astral-tactics": {
    photoId: "1462331940025-496dfbfc7564", // galaxy
    tint: "from-rose-500/40 via-red-700/30 to-transparent",
  },
  // Skybound Heroes — action / aerial
  "skybound-heroes": {
    photoId: "1419242902214-272b3f66ee7a", // aerial sky
    tint: "from-indigo-500/40 via-violet-700/30 to-transparent",
  },
};

function unsplashUrl(photoId: string, w = 800) {
  return `https://images.unsplash.com/photo-${photoId}?auto=format&fit=crop&w=${w}&q=75`;
}

function dicebear(seed: string) {
  const safe = encodeURIComponent(seed.toLowerCase().replace(/\s+/g, "-"));
  return `https://api.dicebear.com/7.x/shapes/svg?seed=${safe}&size=600`;
}

export function GameCover({
  gameId,
  title,
  className,
  children,
}: {
  gameId: keyof typeof GAME_COVERS | string;
  title: string;
  className?: string;
  children?: React.ReactNode;
}) {
  const cover = GAME_COVERS[gameId];
  const [errored, setErrored] = useState(false);
  const src = cover && !errored ? unsplashUrl(cover.photoId) : dicebear(title);

  return (
    <div
      className={cn(
        "relative overflow-hidden bg-muted",
        className,
      )}
    >
      <img
        src={src}
        alt={title}
        loading="lazy"
        onError={() => setErrored(true)}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
      />
      {/* tint overlay */}
      <div
        className={cn(
          "absolute inset-0 bg-gradient-to-tr",
          cover?.tint ?? "from-primary/30 via-primary/10 to-transparent",
        )}
      />
      {/* darken bottom for legibility */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/15 to-transparent" />
      {/* Slight grain for visual richness */}
      <div className="absolute inset-0 mix-blend-overlay opacity-40 [background-image:repeating-linear-gradient(135deg,transparent_0_2px,rgba(255,255,255,0.04)_2px_3px)]" />
      <div className="relative z-10 h-full">{children}</div>
    </div>
  );
}

export function getGameId(title: string): string {
  const map: Record<string, string> = {
    "CyberRealm Chronicles": "cyberrealm",
    "Quantum Racers": "quantum-racers",
    "DeFi Defenders": "defi-defenders",
    "MetaVerse Miners": "metaverse-miners",
    "Astral Tactics": "astral-tactics",
    "Skybound Heroes": "skybound-heroes",
  };
  return map[title] ?? title.toLowerCase().replace(/\s+/g, "-");
}
