# Defiance Hub

A reimagined version of the [Defi-Hub](https://github.com/defiancecapital/Defi-Hub) project — same six modules (Home, Gaming, DeFi, NFTs, Launchpad, Governance), but rebuilt with a tighter design system, animated visuals, real charts, and a proper light/dark theme toggle.

## Highlights vs. the original

| Area | Original | This version |
| --- | --- | --- |
| Branding | Inconsistent ("DGMeta Hub" / "Defi-Hub" / "APOM Solutions") | Single brand: **Defiance Hub** |
| Theme | Dark only | Dark + Light, persisted, system-preference aware |
| Animations | One floating blob | Framer Motion scroll reveals, animated counters, hover transforms |
| Page art | Emoji thumbnails (🏰 🏎️ 🛡️) | Generative gradient artwork + iconography |
| Data viz | None | Real Recharts area chart (DeFi TVL) |
| Layout | Header/Footer copy-pasted in every page | Single `<Layout>` wrapper, reusable `<PageHero>` and `<Section>` |
| Dependencies | 40+ Radix packages, suspicious `chai-beta` | Only the Radix packages actually used; suspicious package removed |
| Styling bugs | Dynamic Tailwind classes (`hover:${...}`), missing `gradient-accent` | Statically-defined utility classes, JIT-friendly |
| SEO | Default Vite title | Title, description, OG tags |
| Wallet support | Mainnet + Sepolia, RainbowKit basic | Mainnet, Polygon, Arbitrum, Base, Optimism, Sepolia, themed RainbowKit |

## Stack

- **Vite + React 18 + TypeScript**
- **Tailwind CSS** with a custom token system (HSL CSS variables, dark/light)
- **Framer Motion** for animations
- **Recharts** for data visualization
- **Wagmi + RainbowKit + Viem** for wallet connection
- **TanStack Query** for async state
- **Lucide** for icons

## Getting started

```bash
npm install
npm run dev
```

The app runs at `http://localhost:8080`.

To enable WalletConnect, set your project ID from [cloud.walletconnect.com](https://cloud.walletconnect.com) in `src/providers/web3-provider.tsx`.

## Project structure

```
src/
├── App.tsx                 # Routes
├── main.tsx                # Entrypoint, providers
├── index.css               # Tailwind + design tokens
├── components/
│   ├── layout.tsx          # App shell
│   ├── header.tsx          # Sticky animated header
│   ├── footer.tsx
│   ├── page-hero.tsx       # Reusable page hero
│   ├── section.tsx         # Animated section wrapper
│   ├── animated-counter.tsx
│   ├── theme-provider.tsx
│   ├── theme-toggle.tsx
│   ├── logo.tsx
│   └── ui/                 # Button, Card, Badge
├── pages/
│   ├── home.tsx
│   ├── gaming.tsx
│   ├── defi.tsx
│   ├── nft-marketplace.tsx
│   ├── launchpad.tsx
│   ├── governance.tsx
│   └── not-found.tsx
├── providers/
│   └── web3-provider.tsx   # Wagmi + RainbowKit setup
└── lib/
    └── utils.ts            # cn(), formatters
```
