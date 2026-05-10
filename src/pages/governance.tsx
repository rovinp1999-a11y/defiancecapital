import { motion } from "framer-motion";
import {
  Vote,
  Coins,
  ScrollText,
  Users,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowRight,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PageHero } from "@/components/page-hero";
import { Section, SectionHeader } from "@/components/section";
import { StatTile } from "@/components/stat-tile";

type ProposalStatus = "Active" | "Passed" | "Rejected" | "Pending";

const proposals: {
  id: string;
  title: string;
  description: string;
  status: ProposalStatus;
  category: string;
  for: number;
  against: number;
  endsIn: string;
  votes: number;
  proposer: string;
}[] = [
  {
    id: "DEFY-014",
    title: "Add Base mainnet support across all modules",
    description:
      "Deploy router, NFT marketplace, and gaming registry contracts on Base. Includes 200K DEFY incentive budget.",
    status: "Active",
    category: "Infrastructure",
    for: 78,
    against: 22,
    endsIn: "Ends 1d 8h",
    votes: 1240,
    proposer: "0x7a1f8b3d29c4a8e6d2f1a3b5c7e9d0f8a2c4e6b8",
  },
  {
    id: "DEFY-013",
    title: "Increase liquidity mining rewards by 12%",
    description:
      "Boost APY on the top 5 pools to attract deeper liquidity ahead of Q2 launches.",
    status: "Active",
    category: "DeFi",
    for: 56,
    against: 44,
    endsIn: "Ends 3d 4h",
    votes: 880,
    proposer: "0x3c1a9b8d7e6f5a4b3c2d1e0f9a8b7c6d5e4f3a2b",
  },
  {
    id: "DEFY-012",
    title: "Allocate 500K DEFY for security audits",
    description:
      "Engage two independent firms to audit the cross-chain bridge before mainnet upgrade.",
    status: "Passed",
    category: "Security",
    for: 92,
    against: 8,
    endsIn: "Closed 6d ago",
    votes: 3210,
    proposer: "0x9f8e7d6c5b4a3210fedcba9876543210abcdef01",
  },
  {
    id: "DEFY-011",
    title: "Lower NFT marketplace platform fee to 1.5%",
    description: "Currently 2.5% — reduce to attract more creators.",
    status: "Rejected",
    category: "NFT",
    for: 38,
    against: 62,
    endsIn: "Closed 12d ago",
    votes: 2145,
    proposer: "0xfedcba0987654321abcdef0123456789fedcba01",
  },
];

function shortenAddress(addr: string) {
  return `${addr.slice(0, 6)}…${addr.slice(-4)}`;
}

function ProposerAvatar({ address }: { address: string }) {
  return (
    <img
      src={`https://api.dicebear.com/7.x/identicon/svg?seed=${address}&size=64&backgroundColor=transparent`}
      alt="proposer"
      className="h-6 w-6 rounded-full ring-1 ring-border bg-secondary"
    />
  );
}

const statusVariant: Record<
  ProposalStatus,
  "default" | "success" | "danger" | "muted"
> = {
  Active: "default",
  Passed: "success",
  Rejected: "danger",
  Pending: "muted",
};

const statusIcon: Record<ProposalStatus, typeof CheckCircle2> = {
  Active: Clock,
  Passed: CheckCircle2,
  Rejected: XCircle,
  Pending: Clock,
};

const features = [
  {
    icon: ScrollText,
    title: "Open proposals",
    description:
      "Anyone with 10K DEFY staked can submit a proposal. No gatekeepers.",
  },
  {
    icon: Vote,
    title: "Token-weighted voting",
    description:
      "1 staked DEFY = 1 vote, with conviction multipliers for long-term stakers.",
  },
  {
    icon: Coins,
    title: "Treasury control",
    description:
      "Token holders directly govern the treasury. Every transfer on-chain.",
  },
  {
    icon: Users,
    title: "Delegation",
    description:
      "Delegate to representatives without giving up custody of your tokens.",
  },
];

export function GovernancePage() {
  return (
    <>
      <PageHero
        eyebrow="Governance"
        title={
          <>
            The platform belongs
            <br />
            <span className="font-serif italic font-normal text-muted-foreground">
              to its users.
            </span>
          </>
        }
        description="Submit proposals, vote on changes, steer the treasury. Every decision is transparent and on-chain."
        actions={
          <>
            <Button variant="primary" size="xl">
              <Vote className="h-4 w-4" />
              View proposals
            </Button>
            <Button variant="secondary" size="xl">
              <ScrollText className="h-4 w-4" />
              Submit proposal
            </Button>
          </>
        }
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <StatTile
            label="Treasury"
            value={18.4}
            prefix="$"
            suffix="M"
            decimals={1}
          />
          <StatTile
            label="DEFY staked"
            value={42.7}
            suffix="M"
            decimals={1}
          />
          <StatTile label="Active voters" value={8214} />
          <StatTile label="Proposals" value={47} />
        </div>
      </PageHero>

      <Section className="py-20 md:py-28">
        <div className="container-page">
          <SectionHeader
            eyebrow="Proposals"
            title={
              <>
                Recent on-chain
                <br />
                <span className="font-serif italic font-normal text-muted-foreground">
                  proposals.
                </span>
              </>
            }
          />
          <div className="surface rounded-2xl overflow-hidden">
            {proposals.map((p, i) => {
              const StatusIcon = statusIcon[p.status];
              return (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, y: 8 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.45, delay: i * 0.05 }}
                  className="border-b border-border last:border-b-0 hover:bg-elevated transition-colors"
                >
                  <div className="p-6 md:p-7 flex flex-col lg:flex-row gap-6 lg:items-center">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-2">
                        <span className="text-[11px] font-mono text-muted-foreground tabular">
                          {p.id}
                        </span>
                        <Badge variant={statusVariant[p.status]}>
                          <StatusIcon className="h-3 w-3" />
                          {p.status}
                        </Badge>
                        <Badge variant="muted">{p.category}</Badge>
                      </div>
                      <h3 className="font-display text-xl md:text-2xl font-semibold tracking-tight leading-snug">
                        {p.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mt-2 leading-relaxed max-w-2xl">
                        {p.description}
                      </p>
                      <div className="mt-4 flex flex-wrap items-center gap-3 text-[11px] text-muted-foreground tabular">
                        <span className="inline-flex items-center gap-2">
                          <ProposerAvatar address={p.proposer} />
                          <span className="font-mono">
                            by {shortenAddress(p.proposer)}
                          </span>
                        </span>
                        <span className="text-border">·</span>
                        <span>{p.endsIn}</span>
                        <span className="text-border">·</span>
                        <span>{p.votes.toLocaleString()} votes</span>
                      </div>
                    </div>

                    <div className="lg:w-72 shrink-0">
                      <div className="flex justify-between text-[11px] mb-1.5 tabular">
                        <span className="text-[hsl(var(--success))] font-medium">
                          For {p.for}%
                        </span>
                        <span className="text-[hsl(var(--danger))] font-medium">
                          Against {p.against}%
                        </span>
                      </div>
                      <div className="h-1 bg-secondary rounded-full overflow-hidden flex">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${p.for}%` }}
                          viewport={{ once: true, amount: 0.5 }}
                          transition={{ duration: 1, ease: "easeOut" }}
                          className="h-full bg-[hsl(var(--success))]"
                        />
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${p.against}%` }}
                          viewport={{ once: true, amount: 0.5 }}
                          transition={{ duration: 1, ease: "easeOut", delay: 0.05 }}
                          className="h-full bg-[hsl(var(--danger))]"
                        />
                      </div>
                      <Button
                        variant={p.status === "Active" ? "primary" : "outline"}
                        size="sm"
                        className="w-full mt-4"
                        disabled={p.status !== "Active"}
                      >
                        {p.status === "Active" ? "Cast vote" : "View details"}
                        <ArrowRight className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </Section>

      <Section className="py-20 md:py-28">
        <div className="container-page">
          <SectionHeader
            eyebrow="How it works"
            title="Built for transparent collective ownership."
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
                className="surface rounded-xl p-6"
              >
                <f.icon className="h-5 w-5 text-primary mb-7" />
                <h3 className="font-display text-base font-semibold tracking-tight mb-1">
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

export default GovernancePage;
