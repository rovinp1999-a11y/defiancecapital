/**
 * Wallet brand marks — used in the "supported wallets" strip.
 * Recognizable but stylized; RainbowKit ships its own art for the actual modal.
 */

export function MetaMaskMark({ size = 22 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      aria-label="MetaMask"
    >
      <path
        d="M27.4 4 18 11l1.7-4.1L27.4 4z"
        fill="#E17726"
        stroke="#E17726"
        strokeWidth="0.3"
      />
      <path
        d="m4.6 4 9.3 7.06L12.3 6.9 4.6 4zm19.4 16.5-2.5 3.8 5.4 1.5 1.5-5.2-4.4-.1zM3.7 20.6l1.5 5.2 5.4-1.5-2.5-3.8-4.4.1z"
        fill="#E27625"
        stroke="#E27625"
        strokeWidth="0.3"
      />
      <path
        d="M10.3 14.4 8.8 16.7l5.3.24-.18-5.7-3.62 3.16zm11.4 0-3.66-3.22-.12 5.76 5.3-.24-1.52-2.3zM10.6 24.3l3.2-1.55-2.76-2.16-.44 3.71zm7.6-1.55 3.2 1.55-.44-3.71-2.76 2.16z"
        fill="#E27625"
        stroke="#E27625"
        strokeWidth="0.3"
      />
      <path
        d="m21.4 24.3-3.2-1.55.26 2.07-.03.86 2.97-1.38zm-10.8 0 2.97 1.38-.02-.86.24-2.07-3.19 1.55z"
        fill="#D5BFB2"
        stroke="#D5BFB2"
        strokeWidth="0.3"
      />
      <path
        d="m13.6 19.4-2.66-.78 1.88-.86.78 1.64zm4.8 0 .78-1.64 1.9.86-2.68.78z"
        fill="#233447"
        stroke="#233447"
        strokeWidth="0.3"
      />
      <path
        d="m10.6 24.3.46-3.8-2.92.08 2.46 3.72zm10.34-3.8.46 3.8 2.46-3.72-2.92-.08zm2.28-3.8-5.3.24.49 2.72.78-1.64 1.9.86 2.13-2.18zm-12.32 2.18 1.88-.86.78 1.64.5-2.72-5.3-.24 2.14 2.18z"
        fill="#CC6228"
        stroke="#CC6228"
        strokeWidth="0.3"
      />
      <path
        d="m8.78 16.7 2.22 4.34-.07-2.16-2.15-2.18zm12.46 2.18-.09 2.16 2.24-4.34-2.15 2.18zm-7.16-1.94-.5 2.72.62 3.2.14-4.22-.26-1.7zm3.86 0-.25 1.7.13 4.22.62-3.2-.5-2.72z"
        fill="#E27525"
        stroke="#E27525"
        strokeWidth="0.3"
      />
      <path
        d="m18.4 19.4-.62 3.2.45.31 2.76-2.16.09-2.16-2.68.81zm-7.46-.81.07 2.16 2.76 2.16.45-.31-.62-3.2-2.66-.81z"
        fill="#F5841F"
        stroke="#F5841F"
        strokeWidth="0.3"
      />
      <path
        d="m18.45 25.84.03-.86-.23-.2h-3.5l-.21.2.02.86-2.97-1.38 1.04.85 2.1 1.45h3.6l2.11-1.45 1.04-.85-3.03 1.38z"
        fill="#C0AC9D"
        stroke="#C0AC9D"
        strokeWidth="0.3"
      />
      <path
        d="m18.23 22.6-.45-.31h-3.56l-.45.31-.24 2.07.21-.2h4.5l.23.2-.24-2.07z"
        fill="#161616"
        stroke="#161616"
        strokeWidth="0.3"
      />
      <path
        d="m27.8 11.45.8-3.83L27.4 4 18.23 10.8l3.5 2.95 4.97 1.45 1.1-1.28-.48-.34.76-.7-.6-.46.76-.58-.44-.39zM3.4 7.62l.8 3.83-.51.39.76.58-.59.46.76.7-.48.34 1.1 1.28 4.97-1.45 3.5-2.95L4.6 4 3.4 7.62z"
        fill="#763E1A"
        stroke="#763E1A"
        strokeWidth="0.3"
      />
      <path
        d="m26.7 15.2-4.97-1.45 1.5 2.3-2.24 4.34 2.93-.04h4.41l-1.63-5.15zm-16.4-1.45L5.32 15.2 3.7 20.35h4.42l2.92.04-2.24-4.34 1.5-2.3zm5.84 2.18.32-5.5 1.45-3.93h-6.46l1.45 3.93.32 5.5.12 1.72.01 4.21h2.66l.01-4.21.12-1.72z"
        fill="#F5841F"
        stroke="#F5841F"
        strokeWidth="0.3"
      />
    </svg>
  );
}

export function WalletConnectMark({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-label="WalletConnect">
      <circle cx="16" cy="16" r="16" fill="#3B99FC" />
      <path
        d="M9.84 12.55a8.71 8.71 0 0 1 12.32 0l.41.41a.42.42 0 0 1 0 .6l-1.4 1.4a.22.22 0 0 1-.3 0l-.57-.57a6.07 6.07 0 0 0-8.59 0l-.6.6a.22.22 0 0 1-.3 0l-1.4-1.4a.42.42 0 0 1 0-.6l.43-.44zm15.21 2.84 1.25 1.25a.42.42 0 0 1 0 .6l-5.65 5.66a.42.42 0 0 1-.6 0l-4.01-4.02a.1.1 0 0 0-.15 0l-4.02 4.02a.42.42 0 0 1-.6 0l-5.65-5.66a.42.42 0 0 1 0-.6l1.24-1.25a.42.42 0 0 1 .6 0l4.02 4.02a.1.1 0 0 0 .15 0l4.02-4.02a.42.42 0 0 1 .6 0l4.02 4.02a.1.1 0 0 0 .14 0l4.02-4.02a.42.42 0 0 1 .6 0l.02 0z"
        fill="#FFF"
      />
    </svg>
  );
}

export function CoinbaseMark({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-label="Coinbase">
      <circle cx="16" cy="16" r="16" fill="#0052FF" />
      <path
        d="M16 22a6 6 0 1 1 5.92-7H28a12 12 0 1 0 0 2h-6.08A6 6 0 0 1 16 22z"
        fill="#FFF"
      />
    </svg>
  );
}

export function PhantomMark({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-label="Phantom">
      <circle cx="16" cy="16" r="16" fill="#AB9FF2" />
      <path
        d="M26.5 16.05c0 5.79-4.7 10.5-10.5 10.5h-.62c-.71 0-1.27-.58-1.27-1.29v-1.04c0-.7-.49-1.29-1.18-1.42-.34-.08-.68-.15-1.04-.18-.07 0-.13-.04-.13-.13 0-3.16 2.56-5.72 5.72-5.72.36 0 .68.04 1.04.13.07 0 .13-.04.13-.13v-1.04c0-3.42-2.78-6.2-6.2-6.2H10c-.04-.04-.05-.07-.05-.11 0-3.36 2.73-6.1 6.1-6.1 5.79 0 10.45 4.71 10.45 10.5l-.04.23zM12.13 13.5a1.42 1.42 0 1 0 0 2.84 1.42 1.42 0 0 0 0-2.84z"
        fill="#FFF"
      />
    </svg>
  );
}

export function RainbowMark({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-label="Rainbow">
      <defs>
        <linearGradient id="rb-bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#174299" />
          <stop offset="100%" stopColor="#001E59" />
        </linearGradient>
        <linearGradient id="rb-1" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FF4000" />
          <stop offset="100%" stopColor="#8754C9" />
        </linearGradient>
        <linearGradient id="rb-2" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFF700" />
          <stop offset="100%" stopColor="#FF9901" />
        </linearGradient>
        <linearGradient id="rb-3" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#00AAFF" />
          <stop offset="100%" stopColor="#01DA40" />
        </linearGradient>
      </defs>
      <rect width="32" height="32" rx="7" fill="url(#rb-bg)" />
      <path
        d="M7 22a7 7 0 0 1 7-7v3a4 4 0 0 0-4 4H7zm0-7v-3a14 14 0 0 1 14 14h-3a11 11 0 0 0-11-11zm0-4V7a18 18 0 0 1 18 18h-4A14 14 0 0 0 7 11z"
        fill="url(#rb-1)"
      />
      <circle cx="9" cy="23" r="2" fill="url(#rb-2)" />
    </svg>
  );
}
