import { motion } from "framer-motion";
import {
  Twitter,
  Github,
  Linkedin,
  CheckCircle2,
  Circle,
  Clock,
  ArrowUpRight,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PageHero } from "@/components/page-hero";
import { Section, SectionHeader } from "@/components/section";
import { cn } from "@/lib/utils";

/* ─── Team — placeholder structure, ready for real names ─────────────── */

const TEAM = [
  {
    name: "Ada Stein",
    role: "Co-founder · CEO",
    bio: "Previously founding PM at a top-3 L2. Built Web3 wallets that crossed 4M MAU.",
    avatarSeed: "ada-stein",
    twitter: "@adastein",
  },
  {
    name: "Kenji Park",
    role: "Co-founder · CTO",
    bio: "Ex-staff engineer at a major DEX. Shipped routing infra handling $30B+ in lifetime volume.",
    avatarSeed: "kenji-park",
    twitter: "@kenjip",
  },
  {
    name: "Maya Okonjo",
    role: "Head of Product",
    bio: "Led growth at a unicorn fintech. Designed account models used by 12M consumer wallets.",
    avatarSeed: "maya-okonjo",
    twitter: "@mayaokonjo",
  },
  {
    name: "Lukas Brandt",
    role: "Head of Protocol",
    bio: "Audited contracts for tier-one lending protocols. PhD in formal verification.",
    avatarSeed: "lukas-brandt",
    twitter: "@lukasbrandt",
  },
  {
    name: "Sara Lin",
    role: "Head of Design",
    bio: "Design lead at two YC W23 batch consumer Web3 apps. Type system maintainer.",
    avatarSeed: "sara-lin",
    twitter: "@saralindesign",
  },
  {
    name: "Daniel Voss",
    role: "Head of Growth",
    bio: "Scaled a top NFT marketplace from 10K to 800K monthly traders.",
    avatarSeed: "daniel-voss",
    twitter: "@danvoss",
  },
];

const BACKERS = [
  { name: "Paradigm", round: "Lead — Seed" },
  { name: "Variant", round: "Co-lead — Seed" },
  { name: "Multicoin", round: "Series A" },
  { name: "1confirmation", round: "Pre-seed" },
  { name: "Polychain", round: "Series A" },
  { name: "Robot Ventures", round: "Pre-seed" },
];

const ADVISORS = [
  { name: "Hayden A.", note: "Founder, top-3 DEX" },
  { name: "Devin F.", note: "Founder, leading L2" },
  { name: "Linda X.", note: "GP, top crypto fund" },
];

/* ─── Roadmap ─────────────────────────────────────────────────────────── */

type Phase = {
  q: string;
  status: "shipped" | "active" | "planned";
  title: string;
  items: string[];
};

const ROADMAP: Phase[] = [
  {
    q: "Q3 2025",
    status: "shipped",
    title: "Foundation",
    items: [
      "Smart contract suite v1 deployed",
      "Trail of Bits + OpenZeppelin audits",
      "Mainnet swap router live on Ethereum",
      "Wallet integration: MetaMask, WalletConnect, Coinbase, Rainbow",
    ],
  },
  {
    q: "Q4 2025",
    status: "active",
    title: "Multi-chain",
    items: [
      "Live: Polygon, Arbitrum, Base, Optimism, BNB",
      "Cross-chain bridge with native message passing",
      "DEFY public sale + LP launch",
      "DAO Governor v1 (Snapshot + on-chain execution)",
    ],
  },
  {
    q: "Q1 2026",
    status: "planned",
    title: "Marketplace + Launchpad",
    items: [
      "NFT marketplace v1 (Reservoir-aggregated liquidity)",
      "Tier-gated launchpad with stake-to-qualify",
      "First cohort of 4–6 vetted IDOs",
      "Mobile PWA",
    ],
  },
  {
    q: "Q2 2026",
    status: "planned",
    title: "Gaming SDK",
    items: [
      "Game-asset SDK + cross-game inventory standard",
      "First 3 partner games live with on-chain economies",
      "Social layer: profiles, follow, share",
      "Solana + Sui integration via account abstraction",
    ],
  },
  {
    q: "Q3 2026",
    status: "planned",
    title: "Protocol-as-a-service",
    items: [
      "White-label hub deployments for partner brands",
      "Order-flow auctions (MEV redistribution to users)",
      "Conviction voting + delegated multipliers",
      "$DEFY listed on top-3 CEX",
    ],
  },
];

const statusStyles: Record<Phase["status"], string> = {
  shipped: "border-[hsl(var(--success)/0.4)] bg-[hsl(var(--success)/0.1)] text-[hsl(var(--success))]",
  active: "border-primary/40 bg-primary/10 text-primary",
  planned: "border-border bg-card text-muted-foreground",
};

const statusIcon: Record<Phase["status"], typeof CheckCircle2> = {
  shipped: CheckCircle2,
  active: Clock,
  planned: Circle,
};

const PRINCIPLES = [
  {
    title: "On-chain or it didn't happen",
    body: "Every fee, every vote, every reward is verifiable. No off-chain books.",
  },
  {
    title: "User > token > protocol",
    body: "When incentives conflict, users come first. Then long-term holders. Then short-term TVL.",
  },
  {
    title: "Boring infra, exciting surface",
    body: "Boring battle-tested contracts under the hood. Magical product on top.",
  },
  {
    title: "Open source by default",
    body: "Frontend, contracts, SDK — all MIT-licensed, all audited, all forkable.",
  },
];

function dicebearAvatar(seed: string) {
  return `https://api.dicebear.com/7.x/personas/svg?seed=${encodeURIComponent(seed)}&backgroundColor=b6e3f4,d1d4f9,c0aede,ffd5dc,ffdfbf`;
}

export function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About Defiance"
        title={
          <>
            Building the front door
            <br />
            <span className="font-serif italic font-normal text-muted-foreground">
              to on-chain.
            </span>
          </>
        }
        description="Six modules, one wallet, one token. We're betting that the next billion Web3 users won't bounce between 12 tabs — they'll have a unified hub. We're building it."
        actions={
          <>
            <Button asChild variant="primary" size="xl">
              <a href="#roadmap">See the roadmap</a>
            </Button>
            <Button asChild variant="secondary" size="xl">
              <a href="mailto:hello@defiancehub.xyz">
                Contact us
              </a>
            </Button>
          </>
        }
      />

      {/* Mission / principles */}
      <Section className="py-16 md:py-24">
        <div className="container-page">
          <SectionHeader
            eyebrow="Principles"
            title={
              <>
                What we believe,
                <br />
                <span className="font-serif italic font-normal text-muted-foreground">
                  what we won&apos;t do.
                </span>
              </>
            }
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {PRINCIPLES.map((p, i) => (
              <motion.div
                key={p.title}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="surface rounded-xl p-7"
              >
                <p className="font-mono text-[11px] text-muted-foreground tabular">
                  {String(i + 1).padStart(2, "0")}
                </p>
                <h3 className="mt-5 font-display text-2xl font-semibold tracking-tight">
                  {p.title}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  {p.body}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* Roadmap */}
      <Section id="roadmap" className="py-16 md:py-24">
        <div className="container-page">
          <SectionHeader
            eyebrow="Roadmap"
            title={
              <>
                Where we&apos;ve been
                <br />
                <span className="font-serif italic font-normal text-muted-foreground">
                  and where we&apos;re going.
                </span>
              </>
            }
          />
          <div className="surface rounded-2xl overflow-hidden">
            {ROADMAP.map((phase, i) => {
              const Icon = statusIcon[phase.status];
              return (
                <motion.div
                  key={phase.q}
                  initial={{ opacity: 0, y: 8 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                  className="grid grid-cols-1 md:grid-cols-12 gap-4 px-6 py-6 border-b border-border last:border-b-0 hover:bg-elevated transition-colors"
                >
                  <div className="md:col-span-3 flex md:flex-col items-start gap-3 md:gap-1.5">
                    <span
                      className={cn(
                        "inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full border text-[11px] font-medium tabular",
                        statusStyles[phase.status],
                      )}
                    >
                      <Icon className="h-3 w-3" />
                      {phase.status[0].toUpperCase() + phase.status.slice(1)}
                    </span>
                    <p className="font-mono text-[11px] text-muted-foreground uppercase tracking-widest tabular">
                      {phase.q}
                    </p>
                  </div>
                  <div className="md:col-span-9">
                    <h3 className="font-display text-xl font-semibold tracking-tight mb-3">
                      {phase.title}
                    </h3>
                    <ul className="space-y-1.5 text-sm">
                      {phase.items.map((item) => (
                        <li
                          key={item}
                          className="flex items-start gap-2 text-muted-foreground"
                        >
                          {phase.status === "shipped" ? (
                            <CheckCircle2 className="h-3.5 w-3.5 text-[hsl(var(--success))] shrink-0 mt-0.5" />
                          ) : phase.status === "active" ? (
                            <span className="h-1.5 w-1.5 rounded-full bg-primary mt-2 shrink-0 animate-pulse" />
                          ) : (
                            <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/40 mt-2 shrink-0" />
                          )}
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </Section>

      {/* Team */}
      <Section className="py-16 md:py-24">
        <div className="container-page">
          <SectionHeader
            eyebrow="Team"
            title="Built by people who've shipped before."
            description="Operators from leading wallets, DEXs, and L2s. We've built consumer Web3 at scale — and we're doing it again."
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {TEAM.map((m, i) => (
              <motion.div
                key={m.name}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.4, delay: i * 0.04 }}
                className="surface rounded-xl p-6 group hover:bg-elevated transition-colors"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={dicebearAvatar(m.avatarSeed)}
                    alt={m.name}
                    className="h-14 w-14 rounded-full bg-secondary"
                  />
                  <div className="min-w-0">
                    <p className="font-display font-semibold tracking-tight">
                      {m.name}
                    </p>
                    <p className="text-[11px] text-muted-foreground font-mono uppercase tracking-widest mt-0.5">
                      {m.role}
                    </p>
                  </div>
                </div>
                <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
                  {m.bio}
                </p>
                <div className="mt-4 flex items-center gap-2">
                  <a
                    href="#"
                    aria-label={`${m.name} on X`}
                    className="h-8 w-8 grid place-items-center rounded-md border border-border text-muted-foreground hover:text-foreground hover:border-foreground/40 transition-colors"
                  >
                    <Twitter className="h-3.5 w-3.5" />
                  </a>
                  <a
                    href="#"
                    aria-label={`${m.name} on GitHub`}
                    className="h-8 w-8 grid place-items-center rounded-md border border-border text-muted-foreground hover:text-foreground hover:border-foreground/40 transition-colors"
                  >
                    <Github className="h-3.5 w-3.5" />
                  </a>
                  <a
                    href="#"
                    aria-label={`${m.name} on LinkedIn`}
                    className="h-8 w-8 grid place-items-center rounded-md border border-border text-muted-foreground hover:text-foreground hover:border-foreground/40 transition-colors"
                  >
                    <Linkedin className="h-3.5 w-3.5" />
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* Backers + advisors */}
      <Section className="py-16 md:py-24">
        <div className="container-page">
          <SectionHeader
            eyebrow="Backers"
            title="Funded by the funds that funded this category."
          />
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* Investors */}
            <div className="lg:col-span-8 surface rounded-2xl p-6">
              <p className="eyebrow eyebrow-dot mb-4">Investors</p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {BACKERS.map((b) => (
                  <div
                    key={b.name}
                    className="surface-muted rounded-lg p-4 flex flex-col"
                  >
                    <p className="font-display font-semibold tracking-tight">
                      {b.name}
                    </p>
                    <p className="text-[11px] text-muted-foreground tabular mt-1">
                      {b.round}
                    </p>
                  </div>
                ))}
              </div>
              <p className="mt-5 text-[11px] text-muted-foreground tabular">
                Total raised:{" "}
                <span className="text-foreground font-medium">
                  $14.2M
                </span>{" "}
                over Pre-seed, Seed, Series A · Treasury runway:{" "}
                <span className="text-foreground font-medium">36 months</span>
              </p>
            </div>

            {/* Advisors */}
            <div className="lg:col-span-4 surface rounded-2xl p-6">
              <p className="eyebrow eyebrow-dot mb-4">Advisors</p>
              <div className="space-y-3">
                {ADVISORS.map((a) => (
                  <div key={a.name} className="flex items-center gap-3">
                    <img
                      src={dicebearAvatar(a.name)}
                      alt={a.name}
                      className="h-9 w-9 rounded-full bg-secondary"
                    />
                    <div>
                      <p className="text-sm font-medium">{a.name}</p>
                      <p className="text-[11px] text-muted-foreground">
                        {a.note}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* Investor CTA */}
      <Section className="py-16 md:py-24">
        <div className="container-page">
          <div className="surface rounded-2xl p-8 md:p-14 relative overflow-hidden">
            <div className="absolute inset-0 grid-bg opacity-30 pointer-events-none" aria-hidden />
            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-end">
              <div className="lg:col-span-8">
                <Badge variant="default" className="mb-4">
                  Open round
                </Badge>
                <h2 className="display-1 text-[clamp(36px,5vw,64px)] text-balance">
                  Series A is{" "}
                  <span className="font-serif italic font-normal text-muted-foreground">
                    closing.
                  </span>
                </h2>
                <p className="mt-4 text-muted-foreground max-w-xl">
                  We&apos;re raising $20M to ship the multi-chain marketplace,
                  launchpad, and gaming SDK. 60% allocated, 40% open to the
                  right partners.
                </p>
              </div>
              <div className="lg:col-span-4 flex flex-col gap-3 lg:items-end">
                <Button asChild variant="primary" size="xl">
                  <a href="/deck">
                    View the deck
                    <ArrowUpRight className="h-4 w-4" />
                  </a>
                </Button>
                <Button asChild variant="outline" size="xl">
                  <a href="mailto:investors@defiancehub.xyz">
                    investors@defiancehub.xyz
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}

export default AboutPage;
