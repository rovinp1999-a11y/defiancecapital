import { TokenIcon } from "@/components/icons/token-icon";

const chainToToken: Record<string, string> = {
  ethereum: "ETH",
  polygon: "MATIC",
  arbitrum: "ARB",
  optimism: "OP",
  base: "BASE",
  bnb: "BNB",
  "bnb chain": "BNB",
  solana: "SOL",
};

export function ChainIcon({
  name,
  size = "md",
  className,
}: {
  name: string;
  size?: "xs" | "sm" | "md" | "lg";
  className?: string;
}) {
  const symbol = chainToToken[name.toLowerCase()] ?? name.toUpperCase();
  return <TokenIcon symbol={symbol} size={size} className={className} />;
}
