import { BrowserRouter, Route, Routes } from "react-router-dom";

import { Layout } from "@/components/layout";
import { PageTransition } from "@/components/page-transition";
import { HomePage } from "@/pages/home";
import { GamingPage } from "@/pages/gaming";
import { DefiPage } from "@/pages/defi";
import { NftMarketplacePage } from "@/pages/nft-marketplace";
import { LaunchpadPage } from "@/pages/launchpad";
import { GovernancePage } from "@/pages/governance";
import { PortfolioPage } from "@/pages/portfolio";
import { WatchlistPage } from "@/pages/watchlist";
import { TokenPage } from "@/pages/token";
import { AboutPage } from "@/pages/about";
import { StatsPage } from "@/pages/stats";
import { DeckPage } from "@/pages/deck";
import { NotFoundPage } from "@/pages/not-found";

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route element={<PageTransition />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/gaming" element={<GamingPage />} />
            <Route path="/defi" element={<DefiPage />} />
            <Route path="/nft-marketplace" element={<NftMarketplacePage />} />
            <Route path="/launchpad" element={<LaunchpadPage />} />
            <Route path="/governance" element={<GovernancePage />} />
            <Route path="/portfolio" element={<PortfolioPage />} />
            <Route path="/watchlist" element={<WatchlistPage />} />
            <Route path="/token" element={<TokenPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/stats" element={<StatsPage />} />
            <Route path="/deck" element={<DeckPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
