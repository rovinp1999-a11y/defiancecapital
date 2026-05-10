import { cn } from "@/lib/utils";

type ArtVariant =
  | "sword"
  | "avatar"
  | "racer"
  | "citadel"
  | "warrior"
  | "artifact"
  | "vehicle"
  | "land";

const palettes: Record<ArtVariant, [string, string, string]> = {
  sword: ["#3B0764", "#A21CAF", "#F472B6"],
  avatar: ["#0F172A", "#1D4ED8", "#22D3EE"],
  racer: ["#052E2B", "#0F766E", "#34D399"],
  citadel: ["#3B0F0F", "#C2410C", "#FBBF24"],
  warrior: ["#1E1B4B", "#4F46E5", "#A78BFA"],
  artifact: ["#3F1D38", "#BE185D", "#FBBF24"],
  vehicle: ["#0B1B2B", "#0EA5E9", "#7DD3FC"],
  land: ["#062E1F", "#15803D", "#A7F3D0"],
};

function Bg({
  id,
  colors,
}: {
  id: string;
  colors: [string, string, string];
}) {
  return (
    <>
      <defs>
        <linearGradient id={`bg-${id}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={colors[0]} />
          <stop offset="55%" stopColor={colors[1]} />
          <stop offset="100%" stopColor={colors[2]} />
        </linearGradient>
        <radialGradient id={`glow-${id}`} cx="0.5" cy="0.45" r="0.6">
          <stop offset="0%" stopColor={colors[2]} stopOpacity="0.55" />
          <stop offset="100%" stopColor={colors[2]} stopOpacity="0" />
        </radialGradient>
        <pattern
          id={`grid-${id}`}
          x="0"
          y="0"
          width="20"
          height="20"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M 20 0 L 0 0 0 20"
            fill="none"
            stroke="white"
            strokeOpacity="0.08"
            strokeWidth="1"
          />
        </pattern>
        <pattern
          id={`dots-${id}`}
          x="0"
          y="0"
          width="14"
          height="14"
          patternUnits="userSpaceOnUse"
        >
          <circle cx="2" cy="2" r="1" fill="white" fillOpacity="0.12" />
        </pattern>
      </defs>
      <rect width="400" height="400" fill={`url(#bg-${id})`} />
      <rect width="400" height="400" fill={`url(#grid-${id})`} />
      <rect width="400" height="400" fill={`url(#glow-${id})`} />
    </>
  );
}

function Stamp({ tokenId, color = "white" }: { tokenId?: string; color?: string }) {
  if (!tokenId) return null;
  return (
    <g opacity="0.92">
      <rect
        x="20"
        y="20"
        rx="6"
        ry="6"
        width={tokenId.length * 9 + 18}
        height="22"
        fill="black"
        fillOpacity="0.45"
      />
      <text
        x={29}
        y={36}
        fontFamily="ui-monospace, 'Geist Mono', monospace"
        fontSize="12"
        fontWeight="500"
        letterSpacing="0.05em"
        fill={color}
      >
        {tokenId}
      </text>
    </g>
  );
}

function Signature({ name }: { name: string }) {
  return (
    <g opacity="0.6">
      <text
        x="380"
        y="380"
        fontFamily="ui-monospace, 'Geist Mono', monospace"
        fontSize="10"
        letterSpacing="0.18em"
        textAnchor="end"
        fill="white"
      >
        {name.toUpperCase()}
      </text>
    </g>
  );
}

function Sword({ tokenId }: { tokenId?: string }) {
  return (
    <svg viewBox="0 0 400 400" preserveAspectRatio="xMidYMid slice">
      <Bg id="sword" colors={palettes.sword} />
      {/* radial rays */}
      <g opacity="0.5">
        {Array.from({ length: 12 }).map((_, i) => (
          <line
            key={i}
            x1="200"
            y1="200"
            x2={200 + Math.cos((i / 12) * Math.PI * 2) * 220}
            y2={200 + Math.sin((i / 12) * Math.PI * 2) * 220}
            stroke="white"
            strokeOpacity="0.18"
            strokeWidth="1"
          />
        ))}
      </g>
      {/* sword */}
      <g transform="translate(200 200) rotate(-30)">
        {/* blade */}
        <path
          d="M -8 -130 L 8 -130 L 12 60 L -12 60 Z"
          fill="white"
          fillOpacity="0.95"
        />
        <path d="M 0 -130 L 0 60" stroke="black" strokeOpacity="0.25" strokeWidth="1.5" />
        {/* tip */}
        <path d="M -8 -130 L 8 -130 L 0 -150 Z" fill="white" />
        {/* crossguard */}
        <rect x="-44" y="58" width="88" height="14" rx="2" fill="#FBBF24" />
        <rect x="-44" y="58" width="88" height="14" rx="2" fill="black" fillOpacity="0.15" />
        {/* hilt */}
        <rect x="-7" y="72" width="14" height="48" fill="#7C2D12" />
        <rect x="-7" y="72" width="14" height="48" fill="black" fillOpacity="0.2" />
        {/* pommel */}
        <circle cx="0" cy="126" r="9" fill="#FBBF24" />
        <circle cx="0" cy="126" r="9" fill="black" fillOpacity="0.15" />
      </g>
      {/* sparks */}
      {[40, 90, 320, 350, 320, 50].map((x, i) => (
        <circle
          key={i}
          cx={x}
          cy={[60, 320, 80, 280, 200, 250][i]}
          r="2"
          fill="white"
          opacity="0.7"
        />
      ))}
      <Stamp tokenId={tokenId} />
      <Signature name="defiance" />
    </svg>
  );
}

function Avatar({ tokenId }: { tokenId?: string }) {
  return (
    <svg viewBox="0 0 400 400" preserveAspectRatio="xMidYMid slice">
      <Bg id="avatar" colors={palettes.avatar} />
      <rect width="400" height="400" fill="url(#dots-avatar)" />
      {/* head */}
      <g transform="translate(200 220)">
        <ellipse cx="0" cy="-30" rx="98" ry="120" fill="#0F172A" />
        <ellipse cx="0" cy="-30" rx="98" ry="120" fill="white" fillOpacity="0.05" />
        {/* hair top */}
        <path
          d="M -98 -90 Q -100 -150 0 -150 Q 100 -150 98 -90 Q 80 -120 0 -120 Q -80 -120 -98 -90 Z"
          fill="#0B1530"
        />
        {/* visor */}
        <rect x="-78" y="-50" width="156" height="34" rx="17" fill="#22D3EE" />
        <rect
          x="-78"
          y="-50"
          width="156"
          height="34"
          rx="17"
          fill="black"
          fillOpacity="0.25"
        />
        <rect x="-72" y="-46" width="68" height="26" rx="13" fill="#67E8F9" opacity="0.85" />
        <rect x="4" y="-46" width="68" height="26" rx="13" fill="#67E8F9" opacity="0.85" />
        <rect x="-44" y="-40" width="14" height="14" rx="2" fill="white" />
        <rect x="32" y="-40" width="14" height="14" rx="2" fill="white" />
        {/* mouth */}
        <rect x="-22" y="14" width="44" height="6" rx="3" fill="#22D3EE" />
        {/* cheek lights */}
        <circle cx="-66" cy="6" r="4" fill="#22D3EE" opacity="0.85" />
        <circle cx="66" cy="6" r="4" fill="#22D3EE" opacity="0.85" />
        {/* neck */}
        <rect x="-24" y="80" width="48" height="40" fill="#0B1530" />
        {/* collar circuit */}
        <path
          d="M -90 130 L 90 130"
          stroke="#22D3EE"
          strokeOpacity="0.65"
          strokeWidth="2"
        />
        <circle cx="-50" cy="130" r="3" fill="#22D3EE" />
        <circle cx="50" cy="130" r="3" fill="#22D3EE" />
      </g>
      <Stamp tokenId={tokenId} />
      <Signature name="defiance" />
    </svg>
  );
}

function Racer({ tokenId }: { tokenId?: string }) {
  return (
    <svg viewBox="0 0 400 400" preserveAspectRatio="xMidYMid slice">
      <Bg id="racer" colors={palettes.racer} />
      {/* speed lines */}
      <g opacity="0.7">
        {[80, 140, 240, 300].map((y) => (
          <line
            key={y}
            x1="0"
            y1={y}
            x2="400"
            y2={y}
            stroke="white"
            strokeOpacity="0.08"
            strokeWidth="1"
          />
        ))}
      </g>
      {/* car body */}
      <g transform="translate(200 230)">
        {/* shadow */}
        <ellipse cx="0" cy="58" rx="170" ry="10" fill="black" opacity="0.45" />
        {/* lower body */}
        <path
          d="M -160 0 Q -150 -10 -130 -12 L -90 -38 Q -50 -60 0 -60 Q 60 -60 110 -36 L 140 -10 Q 160 -8 168 0 L 168 28 Q 168 40 156 40 L -156 40 Q -168 40 -168 28 Z"
          fill="#0F766E"
        />
        <path
          d="M -160 0 Q -150 -10 -130 -12 L -90 -38 Q -50 -60 0 -60 Q 60 -60 110 -36 L 140 -10 Q 160 -8 168 0 L 168 28 Q 168 40 156 40 L -156 40 Q -168 40 -168 28 Z"
          fill="white"
          fillOpacity="0.05"
        />
        {/* canopy */}
        <path
          d="M -80 -38 Q -40 -54 0 -54 Q 50 -54 90 -36 L 70 -8 L -60 -8 Z"
          fill="#022C22"
        />
        <path
          d="M -78 -36 Q -40 -50 0 -50 Q 48 -50 86 -36"
          stroke="#34D399"
          strokeOpacity="0.6"
          strokeWidth="1.5"
          fill="none"
        />
        {/* light streak */}
        <rect x="-150" y="-2" width="60" height="4" rx="2" fill="#34D399" />
        <rect x="90" y="-2" width="60" height="4" rx="2" fill="#FBBF24" opacity="0.85" />
        {/* wheels */}
        <circle cx="-90" cy="38" r="26" fill="#0B0F19" />
        <circle cx="-90" cy="38" r="14" fill="#34D399" />
        <circle cx="-90" cy="38" r="6" fill="#022C22" />
        <circle cx="90" cy="38" r="26" fill="#0B0F19" />
        <circle cx="90" cy="38" r="14" fill="#34D399" />
        <circle cx="90" cy="38" r="6" fill="#022C22" />
      </g>
      <Stamp tokenId={tokenId} />
      <Signature name="defiance" />
    </svg>
  );
}

function Citadel({ tokenId }: { tokenId?: string }) {
  return (
    <svg viewBox="0 0 400 400" preserveAspectRatio="xMidYMid slice">
      <Bg id="citadel" colors={palettes.citadel} />
      {/* sun */}
      <circle cx="320" cy="120" r="40" fill="#FBBF24" opacity="0.9" />
      <circle cx="320" cy="120" r="60" fill="#FBBF24" opacity="0.25" />
      {/* clouds */}
      <ellipse cx="80" cy="100" rx="40" ry="10" fill="white" opacity="0.4" />
      <ellipse cx="280" cy="220" rx="36" ry="8" fill="white" opacity="0.3" />
      {/* floating island base */}
      <g transform="translate(200 230)">
        <path
          d="M -130 -30 Q -100 -40 -50 -40 L 60 -40 Q 110 -40 130 -30 L 90 60 Q 60 90 0 90 Q -60 90 -100 60 Z"
          fill="#7C2D12"
        />
        <path
          d="M -130 -30 Q -100 -40 -50 -40 L 60 -40 Q 110 -40 130 -30 L 90 60 Q 60 90 0 90 Q -60 90 -100 60 Z"
          fill="black"
          fillOpacity="0.2"
        />
        {/* grass top */}
        <path
          d="M -130 -30 Q -100 -42 -50 -42 L 60 -42 Q 110 -42 130 -30 L 130 -22 Q 110 -34 60 -34 L -50 -34 Q -100 -34 -130 -22 Z"
          fill="#16A34A"
        />
        {/* tower */}
        <rect x="-30" y="-110" width="60" height="80" fill="#FBBF24" />
        <rect x="-30" y="-110" width="60" height="80" fill="black" fillOpacity="0.2" />
        <polygon points="-36,-110 36,-110 0,-150" fill="#DC2626" />
        <rect x="-12" y="-78" width="24" height="32" fill="#0F0A02" />
        <rect x="-8" y="-72" width="6" height="20" fill="#FBBF24" opacity="0.6" />
        <rect x="2" y="-72" width="6" height="20" fill="#FBBF24" opacity="0.6" />
        {/* small house */}
        <rect x="-90" y="-46" width="36" height="22" fill="#92400E" />
        <polygon points="-92,-46 -52,-46 -72,-58" fill="#0F0A02" />
        <rect x="58" y="-50" width="30" height="26" fill="#92400E" />
        <polygon points="56,-50 90,-50 73,-62" fill="#0F0A02" />
      </g>
      <Stamp tokenId={tokenId} />
      <Signature name="defiance" />
    </svg>
  );
}

function Warrior() {
  return (
    <svg viewBox="0 0 400 400" preserveAspectRatio="xMidYMid slice">
      <Bg id="warrior" colors={palettes.warrior} />
      <g transform="translate(200 230)">
        {/* shoulders */}
        <path
          d="M -120 80 L -120 30 Q -120 0 -90 -10 L -30 -30 Q -30 -50 0 -50 Q 30 -50 30 -30 L 90 -10 Q 120 0 120 30 L 120 80 Z"
          fill="#1E1B4B"
        />
        {/* helmet */}
        <path
          d="M -50 -30 Q -50 -110 0 -110 Q 50 -110 50 -30 Z"
          fill="#312E81"
        />
        <path
          d="M -50 -30 Q -50 -110 0 -110 Q 50 -110 50 -30 Z"
          fill="white"
          fillOpacity="0.1"
        />
        {/* visor slit */}
        <rect x="-32" y="-70" width="64" height="6" fill="#A78BFA" />
        <rect x="-32" y="-70" width="64" height="6" fill="white" fillOpacity="0.3" />
        {/* helmet plume */}
        <path
          d="M 0 -110 Q 30 -130 60 -120 Q 30 -100 0 -100 Z"
          fill="#A78BFA"
        />
        {/* chest emblem */}
        <circle cx="0" cy="20" r="14" fill="#A78BFA" opacity="0.85" />
        <circle cx="0" cy="20" r="6" fill="#1E1B4B" />
      </g>
      <Signature name="cyberwarriors" />
    </svg>
  );
}

function Artifact() {
  return (
    <svg viewBox="0 0 400 400" preserveAspectRatio="xMidYMid slice">
      <Bg id="artifact" colors={palettes.artifact} />
      <g transform="translate(200 200)">
        {/* outer ring */}
        <circle r="120" fill="none" stroke="#FBBF24" strokeWidth="2" opacity="0.7" />
        <circle r="100" fill="none" stroke="#FBBF24" strokeWidth="1" opacity="0.4" />
        {/* gem */}
        <polygon
          points="0,-78 60,-20 38,68 -38,68 -60,-20"
          fill="#FBBF24"
        />
        <polygon
          points="0,-78 60,-20 38,68 -38,68 -60,-20"
          fill="white"
          fillOpacity="0.18"
        />
        <polygon points="0,-78 60,-20 0,-20" fill="white" fillOpacity="0.35" />
        <polygon points="0,-78 -60,-20 0,-20" fill="black" fillOpacity="0.15" />
        <polygon points="0,68 -38,68 -60,-20 0,-20" fill="black" fillOpacity="0.18" />
        {/* hanging chain */}
        <line x1="0" y1="-78" x2="0" y2="-110" stroke="#FBBF24" strokeWidth="3" />
        <circle cx="0" cy="-114" r="6" fill="#FBBF24" />
        <circle cx="0" cy="-114" r="6" fill="black" fillOpacity="0.15" />
      </g>
      <Signature name="artifacts" />
    </svg>
  );
}

function Vehicle() {
  return (
    <svg viewBox="0 0 400 400" preserveAspectRatio="xMidYMid slice">
      <Bg id="vehicle" colors={palettes.vehicle} />
      <g transform="translate(200 220)">
        {/* base disc */}
        <ellipse cx="0" cy="40" rx="170" ry="20" fill="black" opacity="0.45" />
        {/* hover light */}
        <ellipse cx="0" cy="46" rx="120" ry="6" fill="#7DD3FC" opacity="0.7" />
        {/* hull */}
        <path
          d="M -160 0 Q -120 -40 0 -40 Q 120 -40 160 0 L 130 30 L -130 30 Z"
          fill="#0EA5E9"
        />
        <path
          d="M -160 0 Q -120 -40 0 -40 Q 120 -40 160 0 L 130 30 L -130 30 Z"
          fill="white"
          fillOpacity="0.1"
        />
        {/* canopy */}
        <path
          d="M -70 -34 Q -30 -52 0 -52 Q 30 -52 70 -34 L 60 -10 L -60 -10 Z"
          fill="#082F49"
        />
        {/* glowing seam */}
        <line
          x1="-160"
          y1="0"
          x2="160"
          y2="0"
          stroke="#7DD3FC"
          strokeWidth="2"
          opacity="0.85"
        />
        {/* wing tips */}
        <polygon points="-160,0 -190,8 -160,16" fill="#0EA5E9" />
        <polygon points="160,0 190,8 160,16" fill="#0EA5E9" />
      </g>
      <Signature name="quantum" />
    </svg>
  );
}

function Land() {
  return (
    <svg viewBox="0 0 400 400" preserveAspectRatio="xMidYMid slice">
      <Bg id="land" colors={palettes.land} />
      {/* isometric terraced grid */}
      <g transform="translate(200 230)">
        {/* tier 3 */}
        <polygon points="-160,40 0,-10 160,40 0,90" fill="#15803D" />
        <polygon points="-160,40 0,-10 160,40 0,90" fill="black" fillOpacity="0.15" />
        {/* tier 2 */}
        <polygon points="-110,15 0,-35 110,15 0,65" fill="#16A34A" />
        <polygon points="-110,15 0,-35 110,15 0,65" fill="white" fillOpacity="0.05" />
        {/* tier 1 */}
        <polygon points="-60,-10 0,-50 60,-10 0,30" fill="#22C55E" />
        <polygon points="-60,-10 0,-50 60,-10 0,30" fill="white" fillOpacity="0.1" />
        {/* tower */}
        <rect x="-8" y="-90" width="16" height="40" fill="#A7F3D0" />
        <polygon points="-12,-90 12,-90 0,-110" fill="#FBBF24" />
        {/* trees */}
        <circle cx="-80" cy="32" r="10" fill="#166534" />
        <rect x="-82" y="32" width="4" height="12" fill="#581C09" />
        <circle cx="80" cy="40" r="10" fill="#166534" />
        <rect x="78" y="40" width="4" height="12" fill="#581C09" />
        {/* grid lines */}
        <line x1="0" y1="-10" x2="0" y2="90" stroke="white" strokeOpacity="0.2" />
        <line
          x1="-160"
          y1="40"
          x2="160"
          y2="40"
          stroke="white"
          strokeOpacity="0.2"
        />
      </g>
      <Signature name="metalands" />
    </svg>
  );
}

const map: Record<ArtVariant, (props: { tokenId?: string }) => JSX.Element> = {
  sword: Sword,
  avatar: Avatar,
  racer: Racer,
  citadel: Citadel,
  warrior: () => <Warrior />,
  artifact: () => <Artifact />,
  vehicle: () => <Vehicle />,
  land: () => <Land />,
};

export function NftArt({
  variant,
  tokenId,
  className,
}: {
  variant: ArtVariant;
  tokenId?: string;
  className?: string;
}) {
  const Cmp = map[variant];
  return (
    <div
      className={cn(
        "relative w-full overflow-hidden bg-muted aspect-[4/3]",
        className,
      )}
    >
      <Cmp tokenId={tokenId} />
    </div>
  );
}

export type { ArtVariant };
