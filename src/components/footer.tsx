import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { Logo, Wordmark } from "@/components/logo";
import { ChainPill } from "@/components/icons/chain-pill";
import {
  XMark,
  GitHubMark,
  DiscordMark,
  TelegramMark,
} from "@/components/icons/social-icons";

const platform = [
  { to: "/defi", label: "DeFi Exchange" },
  { to: "/nft-marketplace", label: "NFT Marketplace" },
  { to: "/launchpad", label: "Launchpad" },
  { to: "/governance", label: "Governance" },
  { to: "/gaming", label: "Gaming Hub" },
  { to: "/portfolio", label: "Portfolio" },
];

const company = [
  { to: "/about", label: "About" },
  { to: "/token", label: "DEFY token" },
  { to: "/stats", label: "Live metrics" },
  { to: "/about#roadmap", label: "Roadmap" },
  { to: "/deck", label: "Pitch deck" },
];

const developers = [
  { label: "Documentation", href: "#", external: true },
  { label: "SDK & SDKs", href: "#", external: true },
  { label: "Smart contracts", href: "/token", external: false },
  { label: "Bug bounty · $250K", href: "#", external: true },
  { label: "GitHub", href: "https://github.com/", external: true },
];

const networks = [
  "Ethereum",
  "Polygon",
  "Arbitrum",
  "Base",
  "Optimism",
  "BNB Chain",
];

const social = [
  { icon: XMark, label: "X (Twitter)", href: "#" },
  { icon: GitHubMark, label: "GitHub", href: "#" },
  { icon: DiscordMark, label: "Discord", href: "#" },
  { icon: TelegramMark, label: "Telegram", href: "#" },
];

export function Footer() {
  return (
    <footer className="border-t border-border mt-32">
      <div className="container-page pt-20 pb-10">
        {/* Big watermark wordmark */}
        <div className="mb-16 select-none">
          <h2 className="display-1 text-[clamp(64px,12vw,200px)] text-foreground/[0.04]">
            DEFIANCE
            <span className="text-primary/30">.</span>
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-10 pt-10 border-t border-border">
          <div className="col-span-2 lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <Logo size={28} />
              <Wordmark />
            </Link>
            <p className="text-sm text-muted-foreground max-w-xs">
              The unified gateway to on-chain gaming, DeFi, NFTs, launchpads,
              and DAO governance.
            </p>
            <div className="flex items-center gap-2">
              {social.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  className="h-9 w-9 grid place-items-center rounded-md border border-border text-muted-foreground hover:text-foreground hover:border-foreground/40 transition-colors"
                >
                  <s.icon size={14} />
                </a>
              ))}
            </div>
          </div>

          <div>
            <p className="eyebrow eyebrow-dot mb-4">Platform</p>
            <ul className="space-y-2.5 text-sm">
              {platform.map((p) => (
                <li key={p.to}>
                  <Link
                    to={p.to}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {p.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="eyebrow eyebrow-dot mb-4">Company</p>
            <ul className="space-y-2.5 text-sm">
              {company.map((c) => (
                <li key={c.to}>
                  <Link
                    to={c.to}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {c.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="eyebrow eyebrow-dot mb-4">Developers</p>
            <ul className="space-y-2.5 text-sm">
              {developers.map((d) => (
                <li key={d.label}>
                  {d.external ? (
                    <a
                      href={d.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {d.label}
                      <ArrowUpRight className="h-3 w-3" />
                    </a>
                  ) : (
                    <Link
                      to={d.href}
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {d.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          <div className="col-span-2 md:col-span-1 lg:col-span-1">
            <p className="eyebrow eyebrow-dot mb-4">Networks</p>
            <div className="flex flex-wrap gap-1.5">
              {networks.map((n) => (
                <ChainPill key={n} name={n} />
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-border flex flex-col md:flex-row justify-between gap-3 text-xs text-muted-foreground">
          <p className="tabular">
            © {new Date().getFullYear()} Defiance Hub
          </p>
          <div className="flex gap-5">
            <a href="#" className="hover:text-foreground">
              Privacy
            </a>
            <a href="#" className="hover:text-foreground">
              Terms
            </a>
            <a href="#" className="hover:text-foreground">
              Security
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
