import { ConnectButton } from "@rainbow-me/rainbowkit";
import { ChevronDown, Wallet } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * Custom-sized Connect Wallet button that matches the header rhythm
 * (h-9, text-[13px]) instead of RainbowKit's default chunky button.
 */
export function ConnectWalletButton({ className }: { className?: string }) {
  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        mounted,
      }) => {
        const ready = mounted;
        const connected = ready && account && chain;

        return (
          <div
            aria-hidden={!ready}
            style={{
              opacity: ready ? 1 : 0,
              pointerEvents: ready ? "auto" : "none",
              userSelect: ready ? "auto" : "none",
            }}
            className={cn("flex items-center gap-1.5", className)}
          >
            {(() => {
              if (!connected) {
                return (
                  <button
                    type="button"
                    onClick={openConnectModal}
                    className="inline-flex items-center gap-1.5 h-9 px-3.5 rounded-md bg-primary text-primary-foreground text-[13px] font-medium hover:shadow-glow-sm hover:-translate-y-px active:translate-y-0 transition-all"
                  >
                    <Wallet className="h-3.5 w-3.5" />
                    Connect
                  </button>
                );
              }

              if (chain.unsupported) {
                return (
                  <button
                    type="button"
                    onClick={openChainModal}
                    className="h-9 px-3 rounded-md bg-[hsl(var(--danger))] text-white text-[13px] font-medium hover:opacity-90"
                  >
                    Wrong network
                  </button>
                );
              }

              return (
                <>
                  {/* Chain pill */}
                  <button
                    type="button"
                    onClick={openChainModal}
                    className="hidden md:inline-flex items-center gap-1.5 h-9 px-2.5 rounded-md surface text-[12px] font-medium text-muted-foreground hover:text-foreground hover:bg-elevated transition-colors"
                    aria-label={`${chain.name} — switch network`}
                  >
                    {chain.hasIcon && chain.iconUrl ? (
                      <span
                        className="h-4 w-4 rounded-full overflow-hidden"
                        style={{ background: chain.iconBackground }}
                      >
                        <img
                          src={chain.iconUrl}
                          alt={chain.name ?? ""}
                          className="h-4 w-4"
                        />
                      </span>
                    ) : (
                      <span className="h-4 w-4 rounded-full bg-muted" />
                    )}
                    <span className="hidden xl:inline">{chain.name}</span>
                    <ChevronDown className="h-3 w-3 opacity-60" />
                  </button>

                  {/* Account pill */}
                  <button
                    type="button"
                    onClick={openAccountModal}
                    className="inline-flex items-center gap-1.5 h-9 px-2.5 rounded-md bg-secondary text-foreground text-[13px] font-medium tabular hover:bg-elevated transition-colors"
                  >
                    {account.ensAvatar ? (
                      <img
                        src={account.ensAvatar}
                        alt=""
                        className="h-5 w-5 rounded-full"
                      />
                    ) : (
                      <span className="h-5 w-5 rounded-full bg-gradient-to-br from-primary to-accent" />
                    )}
                    <span className="font-mono">
                      {account.displayName}
                    </span>
                  </button>
                </>
              );
            })()}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
}
