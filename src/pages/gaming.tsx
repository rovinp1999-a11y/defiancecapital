import {
  Play,
  Trophy,
  Coins,
  Shield,
  Zap,
  Sword,
  Users,
  Sparkles,
} from "lucide-react";
import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PageHero } from "@/components/page-hero";
import { Section, SectionHeader } from "@/components/section";
import { StatTile } from "@/components/stat-tile";
import { GameCover, getGameId } from "@/components/icons/game-cover";
import { cn } from "@/lib/utils";

type GameStatus = "Live" | "Beta" | "Soon";

const games: {
  id: number;
  title: string;
  studio: string;
  genre: string;
  players: string;
  rewards: string;
  status: GameStatus;
  Icon: typeof Sword;
}[] = [
  {
    id: 1,
    title: "CyberRealm Chronicles",
    studio: "Aether Labs",
    genre: "RPG",
    players: "1.2K daily",
    rewards: "250 DEFY",
    status: "Live",
    Icon: Sword,
  },
  {
    id: 2,
    title: "Quantum Racers",
    studio: "Blink Studio",
    genre: "Racing",
    players: "856 daily",
    rewards: "180 DEFY",
    status: "Live",
    Icon: Zap,
  },
  {
    id: 3,
    title: "DeFi Defenders",
    studio: "Yield Forge",
    genre: "Strategy",
    players: "2.1K daily",
    rewards: "320 DEFY",
    status: "Live",
    Icon: Shield,
  },
  {
    id: 4,
    title: "MetaVerse Miners",
    studio: "Orbital Games",
    genre: "Sim",
    players: "Beta",
    rewards: "TBA",
    status: "Beta",
    Icon: Sparkles,
  },
  {
    id: 5,
    title: "Astral Tactics",
    studio: "Nullspace",
    genre: "Auto-battler",
    players: "Soon",
    rewards: "—",
    status: "Soon",
    Icon: Users,
  },
  {
    id: 6,
    title: "Skybound Heroes",
    studio: "Loft 9",
    genre: "Action",
    players: "Soon",
    rewards: "—",
    status: "Soon",
    Icon: Trophy,
  },
];

const statusVariant: Record<GameStatus, "success" | "default" | "muted"> = {
  Live: "success",
  Beta: "default",
  Soon: "muted",
};

const features = [
  {
    icon: Coins,
    title: "Real play-to-earn",
    description:
      "On-chain rewards, leaderboards with prize pools, transparent payouts.",
  },
  {
    icon: Shield,
    title: "Asset ownership",
    description:
      "Items live in your wallet. Trade, lend, or use them across games.",
  },
  {
    icon: Zap,
    title: "Cross-game items",
    description:
      "Unified inventory standard. A sword in one game can buff another.",
  },
];

export function GamingPage() {
  return (
    <>
      <PageHero
        eyebrow="Gaming"
        title={
          <>
            Where games meet
            <br />
            <span className="font-serif italic font-normal text-muted-foreground">
              ownership.
            </span>
          </>
        }
        description="Curated titles, real economies, tournaments that pay out on-chain. Play with assets you actually own."
        actions={
          <>
            <Button variant="primary" size="xl">
              <Play className="h-4 w-4" />
              Start playing
            </Button>
            <Button variant="secondary" size="xl">
              <Trophy className="h-4 w-4" />
              Leaderboards
            </Button>
          </>
        }
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <StatTile label="Live games" value={4} />
          <StatTile
            label="Daily players"
            value={18.4}
            suffix="K"
            decimals={1}
          />
          <StatTile label="Rewards / day" value={1250} suffix=" DEFY" />
          <StatTile label="Tournaments" value={12} />
        </div>
      </PageHero>

      <Section className="py-20 md:py-28">
        <div className="container-page">
          <SectionHeader
            eyebrow="Featured titles"
            title={
              <>
                Hand-picked,
                <br />
                <span className="font-serif italic font-normal text-muted-foreground">
                  earn-enabled.
                </span>
              </>
            }
            description="Every game ships with a vetted economy, audited tokenomics, and a credible team behind it."
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {games.map((g, i) => (
              <motion.div
                key={g.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.5, delay: i * 0.04 }}
                className="surface rounded-xl overflow-hidden ring-card group"
              >
                <GameCover
                  gameId={getGameId(g.title)}
                  title={g.title}
                  className="aspect-[5/3]"
                >
                  <div className="absolute top-3 left-3 right-3 flex items-start justify-between">
                    <Badge variant={statusVariant[g.status]}>
                      {g.status === "Live" && (
                        <span className="h-1.5 w-1.5 rounded-full bg-current animate-pulse" />
                      )}
                      {g.status}
                    </Badge>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-black/50 backdrop-blur-md border border-white/10 text-[10px] font-medium text-white">
                      <g.Icon className="h-3 w-3" />
                      {g.genre}
                    </span>
                  </div>
                  <div className="absolute bottom-3 left-4 right-4">
                    <p className="text-[10px] font-mono uppercase tracking-widest text-white/70">
                      {g.studio}
                    </p>
                    <h3 className="font-display text-xl font-semibold text-white mt-0.5 tracking-tight">
                      {g.title}
                    </h3>
                  </div>
                </GameCover>
                <div className="p-5">
                  <div className="grid grid-cols-2 gap-4 text-xs tabular">
                    <div>
                      <p className="text-muted-foreground">Players</p>
                      <p className="font-medium mt-0.5">{g.players}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Rewards</p>
                      <p className="font-medium mt-0.5 text-primary">
                        {g.rewards}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant={g.status === "Live" ? "primary" : "outline"}
                    size="sm"
                    className="mt-5 w-full"
                    disabled={g.status === "Soon"}
                  >
                    {g.status === "Live"
                      ? "Play now"
                      : g.status === "Beta"
                        ? "Join beta"
                        : "Coming soon"}
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      <Section className="py-20 md:py-28">
        <div className="container-page">
          <SectionHeader
            eyebrow="Why play here"
            title={
              <>
                Games designed for
                <br />
                <span className="font-serif italic font-normal text-muted-foreground">
                  ownership.
                </span>
              </>
            }
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
                className="surface rounded-xl p-7"
              >
                <f.icon className="h-5 w-5 text-primary mb-7" />
                <h3 className="font-display text-xl font-semibold tracking-tight mb-2">
                  {f.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {f.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>
    </>
  );
}

export default GamingPage;
