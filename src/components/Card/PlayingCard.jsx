import MahjongBorder from "./MahjongBorder";

// ─── Design Tokens ───────────────────────────────────────────────
const SUITS = {
  spades: { symbol: "♠", zh: "黑", color: "#1a1a2e", accent: "#2d4a3e" },
  hearts: { symbol: "♥", zh: "心", color: "#8b1a1a", accent: "#c0392b" },
  diamonds: { symbol: "♦", zh: "方", color: "#8b1a1a", accent: "#c0392b" },
  clubs: { symbol: "♣", zh: "梅", color: "#1a1a2e", accent: "#2d4a3e" },
};

// ─── Tile Background ─────────────────────────────────────────────
function TileBackground() {
  return (
    <>
      <rect width="100" height="140" rx="8" ry="8" fill="#f5f0e8" />
      <defs>
        <pattern id="grain" x="0" y="0" width="4" height="4" patternUnits="userSpaceOnUse">
          <rect width="4" height="4" fill="transparent" />
          <circle cx="1" cy="1" r="0.3" fill="#c8b89a" opacity="0.15" />
          <circle cx="3" cy="3" r="0.3" fill="#c8b89a" opacity="0.1" />
        </pattern>
        <pattern id="gridlines" x="0" y="0" width="10" height="10" patternUnits="userSpaceOnUse">
          <line x1="0" y1="0" x2="10" y2="0" stroke="#c8b89a" strokeWidth="0.2" opacity="0.2" />
          <line x1="0" y1="0" x2="0" y2="10" stroke="#c8b89a" strokeWidth="0.2" opacity="0.2" />
        </pattern>
      </defs>
      <rect width="100" height="140" rx="8" ry="8" fill="url(#grain)" />
      <rect width="100" height="140" rx="8" ry="8"
        fill="none" stroke="#c8b89a" strokeWidth="1" opacity="0.4" />
    </>
  );
}



// ─── Suit Pip ─────────────────────────────────────────────────────
function Pip({ suit, size = 12, x = 0, y = 0 }) {
  const { symbol, color } = SUITS[suit];
  return (
    <text x={x} y={y} textAnchor="middle" dominantBaseline="central"
      fontSize={size} fill={color} fontFamily="serif"
      style={{ userSelect: "none" }}>
      {symbol}
    </text>
  );
}

// ─── Pip grid layouts for number cards ───────────────────────────
function getPipPositions(num) {
  const cx = 50;
  const patterns = {
    1: [[cx, 70]],
    2: [[cx, 40], [cx, 100]],
    3: [[cx, 35], [cx, 70], [cx, 105]],
    4: [[35, 40], [65, 40], [35, 100], [65, 100]],
    5: [[35, 40], [65, 40], [cx, 70], [35, 100], [65, 100]],
    6: [[35, 38], [65, 38], [35, 70], [65, 70], [35, 102], [65, 102]],
    7: [[35, 35], [65, 35], [cx, 55], [35, 70], [65, 70], [35, 100], [65, 100]],
    8: [[35, 35], [65, 35], [35, 58], [65, 58], [35, 82], [65, 82], [35, 105], [65, 105]],
    9: [[35, 33], [65, 33], [35, 53], [65, 53], [cx, 70], [35, 87], [65, 87], [35, 107], [65, 107]],
    10: [[35, 32], [65, 32], [35, 50], [65, 50], [35, 68], [65, 68], [35, 86], [65, 86], [35, 104], [65, 104]],
  };
  return patterns[num] || patterns[1];
}

// ─── Face card center illustration ───────────────────────────────
function FaceIllustration({ rank, suit }) {
  const { color, accent } = SUITS[suit];
  const label = { J: "將", Q: "皇", K: "王" }[rank.value];
  return (
    <g>
      <rect x="20" y="28" width="60" height="84" rx="4" ry="4"
        fill={accent} opacity="0.08" />
      <rect x="20" y="28" width="60" height="84" rx="4" ry="4"
        fill="none" stroke={color} strokeWidth="0.8" opacity="0.2" />
      <text x="50" y="70" textAnchor="middle" dominantBaseline="central"
        fontSize="90" fontFamily="serif" fill={color} opacity="0.25">
        {SUITS[suit].symbol}
      </text>
      <text x="50" y="72" textAnchor="middle" dominantBaseline="central"
        fontSize="32" fontFamily="serif" fill={color} opacity="0.85"
        fontWeight="bold">{label}</text>
    </g>
  );
}

// ─── Ace center ───────────────────────────────────────────────────
function AceCenter({ suit }) {
  const { color } = SUITS[suit];
  return (
    <g>
      <text x="50" y="70" textAnchor="middle" dominantBaseline="central"
        fontSize="36" fontFamily="serif" fill={color} opacity="0.9">
        {SUITS[suit].symbol}
      </text>
      <text x="50" y="95" textAnchor="middle" dominantBaseline="central"
        fontSize="9" fontFamily="serif" fill={color} opacity="0.35"
        letterSpacing="2">ACE</text>
    </g>
  );
}

// ─── Single Playing Card SVG ──────────────────────────────────────
// width / height props control the rendered size of the card.
// All internal artwork lives in a fixed 100×140 viewBox, so the SVG
// viewport scaling takes care of everything automatically — no math needed
// inside the card components themselves.
export default function PlayingCard({
  rank,
  suit,
  faceDown = false,
  selected = false,
  onClick,
  width = 80,
  height = 112,
}) {
  const { color, zh } = SUITS[suit];
  const isFace = ["J", "Q", "K"].includes(rank.value);
  const isAce = rank.value === "A";

  // Lift scales proportionally with card height
  const liftPx = Math.round(height * 0.107);

  return (
    <div onClick={onClick} style={{
      width,
      height,
      cursor: onClick ? "pointer" : "default",
      transform: selected ? `translateY(-${liftPx}px)` : "translateY(0)",
      transition: "transform 0.18s cubic-bezier(.34,1.56,.64,1)",
      filter: selected
        ? "drop-shadow(0 8px 16px rgba(200,169,81,0.5))"
        : "drop-shadow(0 3px 6px rgba(0,0,0,0.25))",
      flexShrink: 0,
    }}>
      {/* viewBox stays 100×140 always; width/height on <svg> drives the scale */}
      <svg viewBox="0 0 100 140" xmlns="http://www.w3.org/2000/svg"
        style={{ width: "100%", height: "100%", display: "block" }}>

        {faceDown ? <CardBack /> : (
          <>
            <TileBackground />
            <MahjongBorder color={color} />

            {/* top-left rank + suit — block starts at y=10, lines spaced 11px */}
            <g transform="translate(14, 10)">
              <text x="0" y="0" fontSize="16" fontFamily="serif" fill={color} fontWeight="bold"
                dominantBaseline="hanging" textAnchor="middle">{rank.value}</text>
              <text x="0" y="16" fontSize="9" fontFamily="serif" fill={color} opacity="0.7"
                dominantBaseline="hanging" textAnchor="middle">{zh}</text>
              <text x="0" y="25" fontSize="9" fontFamily="serif" fill={color}
                dominantBaseline="hanging" textAnchor="middle">{SUITS[suit].symbol}</text>
            </g>

            {/* bottom-right (rotated) */}
            <g transform="rotate(180,50,70)">
              <g transform="translate(14, 10)">
                <text x="0" y="0" fontSize="16" fontFamily="serif" fill={color} fontWeight="bold"
                  dominantBaseline="hanging" textAnchor="middle">{rank.value}</text>
                <text x="0" y="16" fontSize="9" fontFamily="serif" fill={color} opacity="0.7"
                  dominantBaseline="hanging" textAnchor="middle">{zh}</text>
                <text x="0" y="25" fontSize="9" fontFamily="serif" fill={color}
                  dominantBaseline="hanging" textAnchor="middle">{SUITS[suit].symbol}</text>
              </g>
            </g>

            {/* center */}
            {isAce && <AceCenter suit={suit} />}
            {isFace && <FaceIllustration rank={rank} suit={suit} />}
            {!isAce && !isFace && getPipPositions(rank.num).map(([px, py], i) => (
              <Pip key={i} suit={suit} size={24} x={px} y={py} />
            ))}

            {selected && (
              <rect width="100" height="140" rx="8" ry="8"
                fill="#c8a951" opacity="0.08" />
            )}
          </>
        )}
      </svg>
    </div>
  );
}