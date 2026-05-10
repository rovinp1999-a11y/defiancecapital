import "@rainbow-me/rainbowkit/styles.css";
import { WagmiProvider, http } from "wagmi";
import { mainnet, polygon, arbitrum, base, optimism, sepolia } from "wagmi/chains";
import {
  RainbowKitProvider,
  darkTheme,
  lightTheme,
  getDefaultConfig,
} from "@rainbow-me/rainbowkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { useTheme } from "@/components/theme-provider";

const config = getDefaultConfig({
  appName: "Defiance Hub",
  // Public RainbowKit demo project ID — replace with your own from https://cloud.walletconnect.com
  projectId: "YOUR_WALLETCONNECT_PROJECT_ID",
  chains: [mainnet, polygon, arbitrum, base, optimism, sepolia],
  transports: {
    [mainnet.id]: http(),
    [polygon.id]: http(),
    [arbitrum.id]: http(),
    [base.id]: http(),
    [optimism.id]: http(),
    [sepolia.id]: http(),
  },
  ssr: false,
});

const queryClient = new QueryClient();

export function Web3Provider({ children }: { children: React.ReactNode }) {
  const { theme } = useTheme();

  const rkTheme =
    theme === "dark"
      ? darkTheme({
          accentColor: "hsl(75 100% 56%)",
          accentColorForeground: "hsl(0 0% 6%)",
          borderRadius: "medium",
          overlayBlur: "small",
        })
      : lightTheme({
          accentColor: "hsl(75 80% 36%)",
          accentColorForeground: "hsl(40 33% 98%)",
          borderRadius: "medium",
          overlayBlur: "small",
        });

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider theme={rkTheme} modalSize="compact">
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
