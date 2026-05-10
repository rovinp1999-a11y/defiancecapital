import { useQuery } from "@tanstack/react-query";

/**
 * Real NFT collection data, with progressive fallback:
 *   1. OpenSea v2 — used if OPENSEA_API_KEY is set
 *      (https://docs.opensea.io/reference/api-keys)
 *   2. Magic Eden / Reservoir public Ethereum endpoint — free, no key
 *      (proxied via corsproxy.io for browsers)
 *   3. CoinGecko per-id metadata (free) for known collections
 *   4. Curated list with deterministic Dicebear avatars
 *
 * Image proxy is layered too: NFT-CDN images that some networks block
 * (i.seadn.io, wsrv.nl) fall back to Dicebear, which is a generated SVG
 * avatar — always reachable, deterministic per collection name.
 */

const OPENSEA_API_KEY = ""; // <- paste your OpenSea API key to switch sources

export type NftCollection = {
  id: string;
  name: string;
  symbol: string;
  image: string;
  description?: string;
  floorPriceEth: number | null;
  floorPriceUsd: number | null;
  volume24hEth: number | null;
  marketCapUsd: number | null;
  totalSupply: number | null;
  change24h: number | null;
  contract?: string;
  platform?: string;
  source: "opensea" | "magiceden" | "coingecko" | "fallback";
};

/* ─── Image helpers ─────────────────────────────────────────────────────── */

const BLOCKED_HOSTS = ["i.seadn.io", "openseauserdata.com", "magiceden.io"];

function dicebear(seed: string, style: "thumbs" | "shapes" | "identicon" = "thumbs") {
  const safe = encodeURIComponent(seed.toLowerCase().replace(/\s+/g, "-"));
  return `https://api.dicebear.com/7.x/${style}/svg?seed=${safe}&size=400&backgroundType=gradientLinear&backgroundColor=b6e3f4,d1d4f9,c0aede,ffd5dc,ffdfbf`;
}

/**
 * CoinGecko stores NFT images at `/nft_contracts/images/{id}/{size}/{slug}.{ext}`.
 * The API only returns `small` and `small_2x` (~200px) which are blurry on large
 * cards. Swap to `/large/` which is ~600px and crisp.
 */
function upgradeCoinGeckoSize(src: string): string {
  if (!src.includes("assets.coingecko.com") && !src.includes("coin-images.coingecko.com"))
    return src;
  return src
    .replace(/\/small_2x\//, "/large/")
    .replace(/\/small\//, "/large/")
    .replace(/\/thumb\//, "/large/");
}

function safeImage(src: string | undefined, seed: string): string {
  if (!src) return dicebear(seed);
  try {
    const url = new URL(src);
    if (BLOCKED_HOSTS.some((h) => url.host.includes(h))) {
      return dicebear(seed);
    }
    return upgradeCoinGeckoSize(src);
  } catch {
    return dicebear(seed);
  }
}

/* ─── CORS-aware JSON fetch ─────────────────────────────────────────────── */

async function fetchJsonWithCors<T>(url: string): Promise<T> {
  // Try direct
  try {
    const res = await fetch(url, { headers: { accept: "application/json" } });
    if (res.ok) return (await res.json()) as T;
  } catch {
    // fall through to proxy
  }
  // Fallback: route through corsproxy.io (proper ?url= query)
  const proxyUrl = `https://corsproxy.io/?url=${encodeURIComponent(url)}`;
  const res = await fetch(proxyUrl, { headers: { accept: "application/json" } });
  if (!res.ok) throw new Error(`proxy ${res.status}`);
  return (await res.json()) as T;
}

/* ─── Magic Eden / Reservoir public Ethereum endpoint ───────────────────── */

type MagicEdenCollection = {
  id: string;
  name: string;
  symbol?: string;
  description?: string;
  image?: string;
  contract?: string;
  primaryContract?: string;
  tokenCount?: string;
  onSaleCount?: string;
  floorAsk?: { price?: { amount?: { native?: number; usd?: number } } };
  volume?: { "1day"?: number; allTime?: number };
  volumeChange?: { "1day"?: number };
  floorSaleChange?: { "1day"?: number };
};

async function fetchMagicEden(limit = 12): Promise<NftCollection[]> {
  const url = `https://api-mainnet.magiceden.dev/v3/rtp/ethereum/collections/v7?sortBy=1DayVolume&limit=${limit}`;
  const json = await fetchJsonWithCors<{ collections: MagicEdenCollection[] }>(url);
  return json.collections.map((c) => ({
    id: c.id,
    name: c.name,
    symbol: c.symbol ?? "",
    image: safeImage(c.image, c.name),
    description: c.description,
    floorPriceEth: c.floorAsk?.price?.amount?.native ?? null,
    floorPriceUsd: c.floorAsk?.price?.amount?.usd ?? null,
    volume24hEth: c.volume?.["1day"] ?? null,
    marketCapUsd: null,
    totalSupply: c.tokenCount ? Number(c.tokenCount) : null,
    change24h:
      c.floorSaleChange?.["1day"] !== undefined
        ? (c.floorSaleChange["1day"] - 1) * 100
        : c.volumeChange?.["1day"] !== undefined
          ? (c.volumeChange["1day"] - 1) * 100
          : null,
    contract: c.contract ?? c.primaryContract,
    platform: "ethereum",
    source: "magiceden",
  }));
}

/* ─── OpenSea v2 (requires API key) ─────────────────────────────────────── */

type OpenSeaCollection = {
  collection: string;
  name: string;
  description?: string;
  image_url?: string;
  contracts?: { address: string; chain: string }[];
  total_supply?: number;
};

async function fetchOpenSea(limit = 12): Promise<NftCollection[]> {
  const res = await fetch(
    `https://api.opensea.io/api/v2/collections?limit=${limit}&order_by=market_cap`,
    {
      headers: {
        accept: "application/json",
        "x-api-key": OPENSEA_API_KEY,
      },
    },
  );
  if (!res.ok) throw new Error(`OpenSea ${res.status}`);
  const json = (await res.json()) as { collections: OpenSeaCollection[] };

  const enriched = await Promise.all(
    json.collections.map(async (c) => {
      try {
        const sRes = await fetch(
          `https://api.opensea.io/api/v2/collections/${c.collection}/stats`,
          {
            headers: {
              accept: "application/json",
              "x-api-key": OPENSEA_API_KEY,
            },
          },
        );
        const stats = sRes.ok ? await sRes.json() : null;
        return { c, stats };
      } catch {
        return { c, stats: null };
      }
    }),
  );

  return enriched.map(({ c, stats }) => {
    const total = stats?.total ?? {};
    const intervals: { interval: string; volume?: number; volume_change?: number }[] =
      stats?.intervals ?? [];
    const day = intervals.find((i) => i.interval === "one_day");
    return {
      id: c.collection,
      name: c.name,
      symbol: c.collection.toUpperCase(),
      image: safeImage(c.image_url, c.name),
      description: c.description,
      floorPriceEth: total.floor_price ?? null,
      floorPriceUsd: null,
      volume24hEth: day?.volume ?? null,
      marketCapUsd: total.market_cap ?? null,
      totalSupply: c.total_supply ?? null,
      change24h: day?.volume_change ?? null,
      contract: c.contracts?.[0]?.address,
      platform: c.contracts?.[0]?.chain,
      source: "opensea" as const,
    };
  });
}

/* ─── CoinGecko free per-id metadata ────────────────────────────────────── */

type CoinGeckoNft = {
  id: string;
  name: string;
  symbol?: string;
  contract_address?: string;
  asset_platform_id?: string;
  description?: string;
  image?: { small?: string; small_2x?: string };
  floor_price?: { native_currency: number; usd: number };
  market_cap?: { native_currency: number; usd: number };
  volume_24h?: { native_currency: number; usd: number };
  floor_price_in_usd_24h_percentage_change?: number;
  total_supply?: number;
};

const CURATED_IDS = [
  "boredapeyachtclub",
  "cryptopunks",
  "azuki",
  "pudgypenguins",
  "mutant-ape-yacht-club",
  "doodles-official",
  "miladymaker",
  "moonbirds",
  "clonex",
  "lilpudgys",
  "world-of-women-nft",
  "memeland-captainz",
];

async function fetchCoinGeckoBatch(ids: string[]): Promise<NftCollection[]> {
  const settled = await Promise.allSettled(
    ids.map((id) =>
      fetchJsonWithCors<CoinGeckoNft>(`https://api.coingecko.com/api/v3/nfts/${id}`),
    ),
  );
  const results: NftCollection[] = [];
  for (const r of settled) {
    if (r.status !== "fulfilled") continue;
    const c = r.value;
    const img = c.image?.small_2x ?? c.image?.small ?? "";
    results.push({
      id: c.id,
      name: c.name,
      symbol: (c.symbol ?? c.id).toUpperCase(),
      image: safeImage(img, c.name),
      description: c.description,
      floorPriceEth: c.floor_price?.native_currency ?? null,
      floorPriceUsd: c.floor_price?.usd ?? null,
      volume24hEth: c.volume_24h?.native_currency ?? null,
      marketCapUsd: c.market_cap?.usd ?? null,
      totalSupply: c.total_supply ?? null,
      change24h: c.floor_price_in_usd_24h_percentage_change ?? null,
      contract: c.contract_address,
      platform: c.asset_platform_id,
      source: "coingecko",
    });
  }
  return results;
}

/* ─── Curated fallback (always renders) ────────────────────────────────── */

const fallback: NftCollection[] = [
  {
    id: "boredapeyachtclub",
    name: "Bored Ape Yacht Club",
    symbol: "BAYC",
    image: dicebear("Bored Ape Yacht Club"),
    floorPriceEth: 12.95,
    floorPriceUsd: null,
    volume24hEth: 84.2,
    marketCapUsd: null,
    totalSupply: 10000,
    change24h: 4.2,
    contract: "0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d",
    platform: "ethereum",
    source: "fallback",
  },
  {
    id: "cryptopunks",
    name: "CryptoPunks",
    symbol: "PUNK",
    image: dicebear("CryptoPunks", "identicon"),
    floorPriceEth: 39.8,
    floorPriceUsd: null,
    volume24hEth: 312.6,
    marketCapUsd: null,
    totalSupply: 10000,
    change24h: -1.4,
    contract: "0xb47e3cd837ddf8e4c57f05d70ab865de6e193bbb",
    platform: "ethereum",
    source: "fallback",
  },
  {
    id: "azuki",
    name: "Azuki",
    symbol: "AZUKI",
    image: dicebear("Azuki"),
    floorPriceEth: 4.21,
    floorPriceUsd: null,
    volume24hEth: 56.7,
    marketCapUsd: null,
    totalSupply: 10000,
    change24h: 8.1,
    contract: "0xed5af388653567af2f388e6224dc7c4b3241c544",
    platform: "ethereum",
    source: "fallback",
  },
  {
    id: "pudgypenguins",
    name: "Pudgy Penguins",
    symbol: "PPG",
    image: dicebear("Pudgy Penguins"),
    floorPriceEth: 9.62,
    floorPriceUsd: null,
    volume24hEth: 142.3,
    marketCapUsd: null,
    totalSupply: 8888,
    change24h: 6.4,
    contract: "0xbd3531da5cf5857e7cfaa92426877b022e612cf8",
    platform: "ethereum",
    source: "fallback",
  },
  {
    id: "mutant-ape-yacht-club",
    name: "Mutant Ape Yacht Club",
    symbol: "MAYC",
    image: dicebear("Mutant Ape Yacht Club"),
    floorPriceEth: 1.84,
    floorPriceUsd: null,
    volume24hEth: 38.1,
    marketCapUsd: null,
    totalSupply: 19460,
    change24h: 1.2,
    contract: "0x60e4d786628fea6478f785a6d7e704777c86a7c6",
    platform: "ethereum",
    source: "fallback",
  },
  {
    id: "doodles-official",
    name: "Doodles",
    symbol: "DOODLE",
    image: dicebear("Doodles"),
    floorPriceEth: 1.45,
    floorPriceUsd: null,
    volume24hEth: 22.6,
    marketCapUsd: null,
    totalSupply: 10000,
    change24h: -2.7,
    contract: "0x8a90cab2b38dba80c64b7734e58ee1db38b8992e",
    platform: "ethereum",
    source: "fallback",
  },
  {
    id: "miladymaker",
    name: "Milady Maker",
    symbol: "MILADY",
    image: dicebear("Milady Maker"),
    floorPriceEth: 2.95,
    floorPriceUsd: null,
    volume24hEth: 41.2,
    marketCapUsd: null,
    totalSupply: 10000,
    change24h: 12.8,
    contract: "0x5af0d9827e0c53e4799bb226655a1de152a425a5",
    platform: "ethereum",
    source: "fallback",
  },
  {
    id: "moonbirds",
    name: "Moonbirds",
    symbol: "MOONBIRD",
    image: dicebear("Moonbirds"),
    floorPriceEth: 0.84,
    floorPriceUsd: null,
    volume24hEth: 18.3,
    marketCapUsd: null,
    totalSupply: 10000,
    change24h: -3.4,
    contract: "0x23581767a106ae21c074b2276d25e5c3e136a68b",
    platform: "ethereum",
    source: "fallback",
  },
  {
    id: "clonex",
    name: "CLONE X — X TAKASHI MURAKAMI",
    symbol: "CLONEX",
    image: dicebear("CLONE X"),
    floorPriceEth: 0.71,
    floorPriceUsd: null,
    volume24hEth: 14.4,
    marketCapUsd: null,
    totalSupply: 19999,
    change24h: 0.9,
    contract: "0x49cf6f5d44e70224e2e23fdcdd2c053f30ada28b",
    platform: "ethereum",
    source: "fallback",
  },
  {
    id: "lilpudgys",
    name: "Lil Pudgys",
    symbol: "LILPUDGYS",
    image: dicebear("Lil Pudgys"),
    floorPriceEth: 0.53,
    floorPriceUsd: null,
    volume24hEth: 28.7,
    marketCapUsd: null,
    totalSupply: 22222,
    change24h: 4.1,
    contract: "0x524cab2ec69124574082676e6f654a18df49a048",
    platform: "ethereum",
    source: "fallback",
  },
  {
    id: "world-of-women-nft",
    name: "World of Women",
    symbol: "WOW",
    image: dicebear("World of Women"),
    floorPriceEth: 0.42,
    floorPriceUsd: null,
    volume24hEth: 6.8,
    marketCapUsd: null,
    totalSupply: 10000,
    change24h: -1.1,
    contract: "0xe785e82358879f061bc3dcac6f0444462d4b5330",
    platform: "ethereum",
    source: "fallback",
  },
  {
    id: "memeland-captainz",
    name: "Captainz",
    symbol: "CAPTAINZ",
    image: dicebear("Captainz"),
    floorPriceEth: 1.62,
    floorPriceUsd: null,
    volume24hEth: 19.4,
    marketCapUsd: null,
    totalSupply: 9999,
    change24h: 5.6,
    contract: "0x769272677fab02575e84945f03eca517acc544cc",
    platform: "ethereum",
    source: "fallback",
  },
];

async function fetchWithFallback(limit = 12): Promise<NftCollection[]> {
  if (OPENSEA_API_KEY) {
    try {
      return await fetchOpenSea(limit);
    } catch (e) {
      console.warn("[NFT] OpenSea failed, trying Magic Eden", e);
    }
  }
  // 1. Try Magic Eden (live data, but images may be on a blocked CDN)
  try {
    const result = await fetchMagicEden(limit);
    if (result.length > 0) return result;
  } catch (e) {
    console.warn("[NFT] Magic Eden failed, trying CoinGecko", e);
  }
  // 2. Try CoinGecko per-id (free, real images on assets.coingecko.com which works)
  try {
    const result = await fetchCoinGeckoBatch(CURATED_IDS.slice(0, limit));
    if (result.length >= limit / 2) return result;
  } catch (e) {
    console.warn("[NFT] CoinGecko batch failed, using curated", e);
  }
  // 3. Curated list with Dicebear avatars
  return fallback.slice(0, limit);
}

export function useNftCollections(limit = 12) {
  return useQuery({
    queryKey: ["nft-collections", limit, OPENSEA_API_KEY ? "os" : "auto"],
    queryFn: () => fetchWithFallback(limit),
    staleTime: 5 * 60_000,
    retry: 1,
  });
}

export function chainFromPlatform(platform?: string): string {
  if (!platform) return "Ethereum";
  const map: Record<string, string> = {
    ethereum: "Ethereum",
    polygon: "Polygon",
    "polygon-pos": "Polygon",
    arbitrum: "Arbitrum",
    "arbitrum-one": "Arbitrum",
    optimism: "Optimism",
    "optimistic-ethereum": "Optimism",
    base: "Base",
    "binance-smart-chain": "BNB Chain",
    bsc: "BNB Chain",
    solana: "Solana",
  };
  return (
    map[platform.toLowerCase()] ?? platform[0].toUpperCase() + platform.slice(1)
  );
}
