import MahjongBorder from "./MahjongBorder";


// ─── Card Back ────────────────────────────────────────────────────
function CardBack() {
  return (
    <svg viewBox="0 0 100 140" xmlns="http://www.w3.org/2000/svg"
      style={{ width: "100%", height: "100%", display: "block" }}>
      <defs>
        <pattern id="backPattern" x="0" y="0" width="12" height="12" patternUnits="userSpaceOnUse">
          <rect width="12" height="12" fill="#1a3a2a" />
          <rect x="1" y="1" width="10" height="10" fill="none"
            stroke="#2d6a4f" strokeWidth="0.5" opacity="0.6" />
          <line x1="0" y1="6" x2="12" y2="6" stroke="#2d6a4f" strokeWidth="0.3" opacity="0.3" />
          <line x1="6" y1="0" x2="6" y2="12" stroke="#2d6a4f" strokeWidth="0.3" opacity="0.3" />
        </pattern>
        <radialGradient id="backVignette" cx="50%" cy="50%" r="60%">
          <stop offset="0%" stopColor="#1a3a2a" stopOpacity="0" />
          <stop offset="100%" stopColor="#0d1f16" stopOpacity="0.6" />
        </radialGradient>
      </defs>
      <rect width="100" height="140" rx="8" ry="8" fill="url(#backPattern)" />
      <rect width="100" height="140" rx="8" ry="8" fill="url(#backVignette)" />
      <g transform="translate(50,70)">
        <circle cx="0" cy="0" r="22" fill="none" stroke="#c8a951" strokeWidth="1" opacity="0.7" />
        <circle cx="0" cy="0" r="16" fill="none" stroke="#c8a951" strokeWidth="0.5" opacity="0.4" />
        <text x="0" y="5" textAnchor="middle" fontSize="18"
          fontFamily="serif" fill="#c8a951" opacity="0.9">牌</text>
        {Array.from({ length: 8 }, (_, i) => {
          const a = (i * 45 * Math.PI) / 180;
          return <line key={i}
            x1={Math.cos(a) * 18} y1={Math.sin(a) * 18}
            x2={Math.cos(a) * 22} y2={Math.sin(a) * 22}
            stroke="#c8a951" strokeWidth="0.8" opacity="0.5" />;
        })}
      </g>
      <MahjongBorder color="#c8a951" />
    </svg>
  );
}

export default function PlayingCardBack({ width = 80, height = 112, }) {
  return (
    <div style={{
      width,
      height,
      flexShrink: 0,
    }}>
      <svg viewBox="0 0 100 140" xmlns="http://www.w3.org/2000/svg"
        style={{ width: "100%", height: "100%", display: "block" }}>
        <CardBack />
      </svg>
    </div>
  )
}
