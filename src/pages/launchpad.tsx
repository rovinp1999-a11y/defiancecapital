import { motion } from "framer-motion";
import {
  Rocket,
  TrendingUp,
  CheckCircle2,
  Lock,
  Users,
  Calendar,
  ArrowRight,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PageHero } from "@/components/page-hero";
import { Section, SectionHeader } from "@/components/section";
import { StatTile } from "@/components/stat-tile";
import { cn, formatCurrency } from "@/lib/utils";

type Status = "Live" | "Upcoming" | "Completed";

const projects: {
  name: string;
  ticker: string;
  description: string;
  status: Status;
  raisedTarget: number;
  raisedCurrent: number;
  participants: number;
  startsIn: string;
  category: string;
  pattern: string;
}[] = [
  {
    name: "Aetherchain",
    ticker: "AETH",
    description:
      "A modular L2 optimized for fully on-chain games and real-time interactions.",
    status: "Live",
    raisedTarget: 2_500_000,
    raisedCurrent: 1_840_000,
    participants: 4321,
    startsIn: "Ends 2d 14h",
    category: "Infrastructure",
    pattern: "from-violet-500 via-fuchsia-500 to-pink-500",
  },
  {
    name: "Nullspace",
    ticker: "NULL",
    description:
      "Generative art platform with on-chain verifiable provenance and royalties.",
    status: "Upcoming",
    raisedTarget: 1_200_000,
    raisedCurrent: 0,
    participants: 0,
    startsIn: "Starts 5d 2h",
    category: "NFT",
    pattern: "from-cyan-400 via-blue-500 to-indigo-600",
  },
  {
    name: "Yieldforge",
    ticker: "FORGE",
    description:
      "Auto-compounding vaults with risk-tiered strategies across 6 chains.",
    status: "Upcoming",
    raisedTarget: 3_000_000,
    raisedCurrent: 0,
    participants: 0,
    startsIn: "Starts 12d",
    category: "DeFi",
    pattern: "from-emerald-400 via-teal-500 to-cyan-600",
  },
  {
    name: "Arclight",
    ticker: "ARC",
    description:
      "On-chain prediction markets with real-time settlement and oracle aggregation.",
    status: "Completed",
    raisedTarget: 1_800_000,
    raisedCurrent: 1_800_000,
    participants: 6712,
    startsIn: "Closed 14d ago",
    category: "DeFi",
    pattern: "from-amber-400 via-orange-500 to-rose-600",
  },
];

const statusVariant: Record<Status, "success" | "default" | "muted"> = {
  Live: "success",
  Upcoming: "default",
  Completed: "muted",
};

const tiers = [
  {
    name: "Starter",
    require: "1,000 DEFY",
    allocation: "Up to $250",
  },
  {
    name: "Builder",
    require: "10,000 DEFY",
    allocation: "Up to $1,500",
  },
  {
    name: "Captain",
    require: "50,000 DEFY",
    allocation: "Up to $7,500",
  },
  {
    name: "Admiral",
    require: "250,000 DEFY",
    allocation: "Guaranteed allocation",
  },
];

export function LaunchpadPage() {
  return (
    <>
      <PageHero
        eyebrow="Launchpad"
        title={
          <>
            Early access to
            <br />
            <span className="font-serif italic font-normal text-muted-foreground">
              vetted projects.
            </span>
          </>
        }
        description="Curated IDOs with real diligence — code reviews, team checks, and fair allocation tiers based on your DEFY commitment."
        actions={
          <>
            <Button variant="primary" size="xl">
              <Rocket className="h-4 w-4" />
              Browse projects
            </Button>
            <Button variant="secondary" size="xl">
              <Lock className="h-4 w-4" />
              Stake to qualify
            </Button>
          </>
        }
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <StatTile
            label="Total raised"
            value={18.4}
            prefix="$"
            suffix="M"
            decimals={1}
          />
          <StatTile label="Projects" value={47} />
          <StatTile label="Avg ROI" value={312} suffix="%" />
          <StatTile
            label="Participants"
            value={24.7}
            suffix="K"
            decimals={1}
          />
        </div>
      </PageHero>

      <Section className="py-20 md:py-28">
        <div className="container-page">
          <SectionHeader
            eyebrow="Project sales"
            title={
              <>
                Live and
                <br />
                <span className="font-serif italic font-normal text-muted-foreground">
                  upcoming launches.
                </span>
              </>
            }
          />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {projects.map((p, i) => {
              const progress =
                p.raisedTarget > 0
                  ? Math.min((p.raisedCurrent / p.raisedTarget) * 100, 100)
                  : 0;
              return (
                <motion.div
                  key={p.name}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.5, delay: i * 0.05 }}
                  className="surface rounded-xl ring-card p-7"
                >
                  <div className="flex items-start gap-5">
                    <div
                      className={cn(
                        "h-14 w-14 rounded-lg shrink-0 overflow-hidden bg-gradient-to-br relative ring-1 ring-border",
                        p.pattern,
                      )}
                    >
                      <img
                        src={`https://api.dicebear.com/7.x/shapes/svg?seed=${encodeURIComponent(p.ticker)}&size=200`}
                        alt={p.name}
                        className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-90"
                      />
                      <div className="absolute inset-0 grid place-items-center font-display font-semibold text-lg text-white drop-shadow-md">
                        {p.ticker[0]}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3 flex-wrap">
                        <div>
                          <h3 className="font-display text-xl font-semibold tracking-tight">
                            {p.name}
                            <span className="text-muted-foreground font-mono text-xs ml-1.5">
                              ${p.ticker}
                            </span>
                          </h3>
                          <p className="text-[11px] text-muted-foreground font-mono uppercase tracking-widest mt-0.5">
                            {p.category}
                          </p>
                        </div>
                        <Badge variant={statusVariant[p.status]}>
                          {p.status === "Live" && (
                            <span className="h-1.5 w-1.5 rounded-full bg-current animate-pulse" />
                          )}
                          {p.status}
                        </Badge>
                      </div>
                      <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                        {p.description}
                      </p>
                    </div>
                  </div>

                  <div className="mt-7">
                    <div className="flex justify-between text-xs mb-2 tabular">
                      <span className="text-muted-foreground">
                        {formatCurrency(p.raisedCurrent)} raised
                      </span>
                      <span className="font-medium">
                        {formatCurrency(p.raisedTarget)} target
                      </span>
                    </div>
                    <div className="h-1 bg-secondary rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${progress}%` }}
                        viewport={{ once: true, amount: 0.5 }}
                        transition={{ duration: 1.2, ease: "easeOut" }}
                        className="h-full bg-primary rounded-full"
                      />
                    </div>
                  </div>

                  <div className="mt-5 grid grid-cols-3 gap-3 text-xs">
                    <div className="border border-border rounded-md p-2.5">
                      <p className="text-muted-foreground flex items-center gap-1">
                        <Users className="h-3 w-3" /> Participants
                      </p>
                      <p className="font-medium mt-1 tabular">
                        {p.participants.toLocaleString()}
                      </p>
                    </div>
                    <div className="border border-border rounded-md p-2.5">
                      <p className="text-muted-foreground flex items-center gap-1">
                        <Calendar className="h-3 w-3" /> Timing
                      </p>
                      <p className="font-medium mt-1 tabular">{p.startsIn}</p>
                    </div>
                    <div className="border border-border rounded-md p-2.5">
                      <p className="text-muted-foreground flex items-center gap-1">
                        <TrendingUp className="h-3 w-3" /> Progress
                      </p>
                      <p className="font-medium mt-1 tabular">
                        {progress.toFixed(0)}%
                      </p>
                    </div>
                  </div>

                  <Button
                    variant={p.status === "Live" ? "primary" : "outline"}
                    className="w-full mt-5"
                    disabled={p.status === "Completed"}
                  >
                    {p.status === "Live"
                      ? "Participate"
                      : p.status === "Upcoming"
                        ? "Set reminder"
                        : "Sale closed"}
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </motion.div>
              );
            })}
          </div>
        </div>
      </Section>

      <Section className="py-20 md:py-28">
        <div className="container-page">
          <SectionHeader
            eyebrow="Allocation tiers"
            title={
              <>
                Stake DEFY,
                <br />
                <span className="font-serif italic font-normal text-muted-foreground">
                  qualify for allocations.
                </span>
              </>
            }
            description="The more DEFY you stake, the better your access. No insider lists — just on-chain rules."
          />
          <div className="surface rounded-2xl overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
              {tiers.map((t, i) => (
                <motion.div
                  key={t.name}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.5, delay: i * 0.05 }}
                  className={cn(
                    "p-7 relative",
                    i !== tiers.length - 1 &&
                      "border-b lg:border-b-0 lg:border-r border-border",
                    i === 1 && "md:border-b lg:border-b-0",
                  )}
                >
                  <p className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
                    Tier {String(i + 1).padStart(2, "0")}
                  </p>
                  <h3 className="font-display text-3xl font-semibold tracking-tight mt-5">
                    {t.name}
                  </h3>
                  <ul className="mt-7 space-y-2.5 text-sm">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                      <div>
                        <p className="text-muted-foreground text-xs">Stake</p>
                        <p className="font-medium tabular">{t.require}</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                      <div>
                        <p className="text-muted-foreground text-xs">Allocation</p>
                        <p className="font-medium tabular">{t.allocation}</p>
                      </div>
                    </li>
                  </ul>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}

export default LaunchpadPage;
