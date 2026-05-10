import { Link } from "react-router-dom";
import {
  ArrowRight,
  Gamepad2,
  TrendingUp,
  Image as ImageIcon,
  Rocket,
  Vote,
  BarChart3,
  Zap,
  ShieldCheck,
  Globe,
} from "lucide-react";
import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import { MagneticButton } from "@/components/magnetic-button";
import { Section, SectionHeader } from "@/components/section";
import { StatTile } from "@/components/stat-tile";
import { Ticker } from "@/components/ticker";
import { ChainIcon } from "@/components/icons/chain-icon";
import { SwapWidget } from "@/components/swap-widget";
import { MarketsPulse } from "@/components/markets-pulse";
import { MeshGradient } from "@/components/mesh-gradient";
import { TrustStrip } from "@/components/trust-strip";
import {
  MetaMaskMark,
  WalletConnectMark,
  CoinbaseMark,
  PhantomMark,
  RainbowMark,
} from "@/components/icons/wallet-icons";
import { cn } from "@/lib/utils";

const features = [
  {
    id: "gaming",
    no: "01",
    icon: Gamepad2,
    title: "Gaming",
    blurb: "Curated on-chain games with real economies and play-to-earn that actually pays.",
  },
  {
    id: "defi",
    no: "02",
    icon: TrendingUp,
    title: "DeFi",
    blurb: "Smart-routed swaps, deep liquidity, and audited yield strategies.",
  },
  {
    id: "nft-marketplace",
    no: "03",
    icon: ImageIcon,
    title: "NFTs",
    blurb: "Curated drops with on-chain royalties and real provenance.",
  },
  {
    id: "launchpad",
    no: "04",
    icon: Rocket,
    title: "Launchpad",
    blurb: "Vetted IDOs with fair, transparent allocation tiers.",
  },
  {
    id: "governance",
    no: "05",
    icon: Vote,
    title: "Governance",
    blurb: "Token-weighted voting on every meaningful platform decision.",
  },
  {
    id: "portfolio",
    no: "06",
    icon: BarChart3,
    title: "Portfolio",
    blurb: "Unified view across modules and chains, real-time and on-chain.",
  },
];

const trustPoints = [
  {
    icon: Zap,
    title: "Built for speed",
    description: "Smart routing across L2s. Most trades settle in under 800ms.",
  },
  {
    icon: ShieldCheck,
    title: "Security-first",
    description: "Every contract audited by two independent firms.",
  },
  {
    icon: Globe,
    title: "Multi-chain native",
    description: "Six networks, one wallet, one inventory.",
  },
];

export function HomePage() {
  return (
    <>
      {/* Swap-first hero */}
      <section className="relative overflow-hidden pt-28 pb-16 md:pt-36 md:pb-20">
        <MeshGradient />
        <div className="absolute inset-0 grid-bg opacity-40" aria-hidden />

        <div className="container-page relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left: pitch + CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="lg:col-span-7"
            >
              <p className="eyebrow eyebrow-dot mb-6">The Web3 Hub</p>
              <h1 className="display-1 text-[clamp(40px,6.5vw,88px)] text-balance">
                Trade any token in{" "}
                <span className="font-serif italic font-normal text-muted-foreground">
                  seconds.
                </span>
              </h1>
              <p className="mt-5 text-base md:text-lg text-muted-foreground max-w-xl text-balance">
                The fastest way to swap, track, and discover Web3 — across six
                networks, with one wallet.
              </p>
              <div className="mt-7 flex flex-col sm:flex-row gap-3">
                <MagneticButton asChild variant="primary" size="xl">
                  <Link to="/portfolio">
                    Open portfolio
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </MagneticButton>
                <Button asChild variant="secondary" size="xl">
                  <Link to="/defi">Browse pools</Link>
                </Button>
              </div>

              {/* Compact stats — secondary, not the hero */}
              <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4 text-sm">
                <div>
                  <p className="text-[11px] uppercase tracking-widest text-muted-foreground">
                    Total volume
                  </p>
                  <p className="font-display text-xl font-semibold tabular mt-0.5">
                    $124.8M
                  </p>
                </div>
                <div className="h-8 w-px bg-border" />
                <div>
                  <p className="text-[11px] uppercase tracking-widest text-muted-foreground">
                    Active users
                  </p>
                  <p className="font-display text-xl font-semibold tabular mt-0.5">
                    15.4K
                  </p>
                </div>
                <div className="h-8 w-px bg-border" />
                <div>
                  <p className="text-[11px] uppercase tracking-widest text-muted-foreground">
                    Networks
                  </p>
                  <div className="flex items-center -space-x-1.5 mt-0.5">
                    {["Ethereum", "Polygon", "Arbitrum", "Base", "Optimism", "BNB Chain"].map(
                      (n) => (
                        <span
                          key={n}
                          className="ring-2 ring-background rounded-full"
                          title={n}
                        >
                          <ChainIcon name={n} size="sm" />
                        </span>
                      ),
                    )}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Right: Swap widget — the primary action */}
            <motion.div
              initial={{ opacity: 0, y: 32, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
              className="lg:col-span-5 lg:justify-self-end w-full lg:max-w-md"
            >
              <SwapWidget />
            </motion.div>
          </div>
        </div>
      </section>

      <Ticker />

      {/* Trust signals — backed by + audited by */}
      <Section className="py-12 md:py-16">
        <TrustStrip />
      </Section>

      {/* Markets pulse — single condensed cross-module view */}
      <Section className="py-16 md:py-24">
        <MarketsPulse />
      </Section>

      {/* Networks strip — quick credibility */}
      <Section className="py-12 md:py-16">
        <div className="container-page">
          <div className="surface rounded-2xl px-6 py-6 md:px-10 md:py-8 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            <div className="md:col-span-4">
              <p className="eyebrow eyebrow-dot mb-3">Multi-chain native</p>
              <p className="font-display text-xl md:text-2xl font-semibold tracking-tight">
                Six networks.{" "}
                <span className="font-serif italic font-normal text-muted-foreground">
                  One wallet.
                </span>
              </p>
            </div>
            <div className="md:col-span-8 grid grid-cols-3 sm:grid-cols-6 gap-3">
              {[
                "Ethereum",
                "Polygon",
                "Arbitrum",
                "Base",
                "Optimism",
                "BNB Chain",
              ].map((n) => (
                <div
                  key={n}
                  className="flex flex-col items-center gap-2 py-3 rounded-lg surface-muted hover:bg-elevated transition-colors"
                >
                  <ChainIcon name={n} size="lg" />
                  <span className="text-[11px] text-muted-foreground font-medium">
                    {n}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* The full platform — secondary, smaller cards */}
      <Section className="py-16 md:py-24">
        <div className="container-page">
          <SectionHeader
            eyebrow="The full platform"
            title={
              <>
                Six modules,{" "}
                <span className="font-serif italic font-normal text-muted-foreground">
                  one wallet.
                </span>
              </>
            }
            description="Trading is just the start — explore the rest of the hub when you're ready."
            align="center"
          />
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {features.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.id}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.4, delay: i * 0.04 }}
                >
                  <Link
                    to={`/${feature.id}`}
                    className={cn(
                      "group relative h-full flex flex-col surface rounded-xl p-5 transition-colors hover:bg-elevated",
                    )}
                  >
                    <div className="flex items-start justify-between mb-5">
                      <span className="font-mono text-[11px] text-muted-foreground tabular">
                        {feature.no}
                      </span>
                      <Icon className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                    <h3 className="font-display text-lg font-semibold tracking-tight">
                      {feature.title}
                    </h3>
                    <p className="mt-1.5 text-[12px] text-muted-foreground leading-relaxed">
                      {feature.blurb}
                    </p>
                    <div className="mt-auto pt-4 inline-flex items-center gap-1 text-[11px] font-medium text-foreground/80 group-hover:gap-2 group-hover:text-foreground transition-all">
                      Open
                      <ArrowRight className="h-3 w-3" />
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </Section>

      {/* Trust + CTA combined */}
      <Section className="pb-24 md:pb-32 pt-10">
        <div className="container-page">
          <div className="surface rounded-2xl p-8 md:p-14 relative overflow-hidden">
            <div className="absolute inset-0 grid-bg opacity-30 pointer-events-none" aria-hidden />
            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10">
              <div className="lg:col-span-7">
                <p className="eyebrow eyebrow-dot mb-5">Why Defiance</p>
                <h2 className="display-1 text-[clamp(36px,5.5vw,72px)] text-balance">
                  Bring your wallet.
                  <br />
                  <span className="font-serif italic font-normal text-muted-foreground">
                    We&apos;ll do the rest.
                  </span>
                </h2>
                <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-5">
                  {trustPoints.map((p) => (
                    <div key={p.title}>
                      <p.icon className="h-4 w-4 text-primary mb-3" />
                      <p className="font-display font-semibold text-sm">
                        {p.title}
                      </p>
                      <p className="text-[12px] text-muted-foreground mt-1 leading-relaxed">
                        {p.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="lg:col-span-5 flex flex-col gap-3 lg:items-end lg:justify-end">
                <MagneticButton asChild variant="primary" size="xl">
                  <Link to="/portfolio">
                    Connect & launch
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </MagneticButton>
                <Button asChild variant="outline" size="xl">
                  <Link to="/launchpad">Upcoming launches</Link>
                </Button>
              </div>
            </div>
            <div className="relative z-10 mt-12 pt-8 border-t border-border flex flex-col md:flex-row md:items-center gap-4 justify-between">
              <p className="eyebrow">Works with your favorite wallets</p>
              <div className="flex items-center gap-5 grayscale opacity-80 hover:opacity-100 hover:grayscale-0 transition-all">
                <MetaMaskMark size={28} />
                <WalletConnectMark size={28} />
                <CoinbaseMark size={28} />
                <RainbowMark size={28} />
                <PhantomMark size={28} />
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* Hidden: keep the unused import-ready helpers reachable */}
      {false && (
        <div>
          <StatTile label="Hidden" value={0} />
        </div>
      )}
    </>
  );
}

export default HomePage;
