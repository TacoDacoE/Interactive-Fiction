import { useState } from "react";

// ─── Design Tokens ───────────────────────────────────────────────
const SUITS = {
  spades: { symbol: "♠", zh: "黑", color: "#1a1a2e", accent: "#2d4a3e" },
  hearts: { symbol: "♥", zh: "心", color: "#8b1a1a", accent: "#c0392b" },
  diamonds: { symbol: "♦", zh: "方", color: "#8b1a1a", accent: "#c0392b" },
  clubs: { symbol: "♣", zh: "梅", color: "#1a1a2e", accent: "#2d4a3e" },
};

export const RANKS = {
  'A': { value: "A", zh: "A", num: 1 },
  '2': { value: "2", zh: "二", num: 2 },
  '3': { value: "3", zh: "三", num: 3 },
  '4': { value: "4", zh: "四", num: 4 },
  '5': { value: "5", zh: "五", num: 5 },
  '6': { value: "6", zh: "六", num: 6 },
  '7': { value: "7", zh: "七", num: 7 },
  '8': { value: "8", zh: "八", num: 8 },
  '9': { value: "9", zh: "九", num: 9 },
  '10': { value: "10", zh: "十", num: 10 },
  'J': { value: "J", zh: "將", num: 11 },
  'Q': { value: "Q", zh: "皇", num: 12 },
  'K': { value: "K", zh: "王", num: 13 },
};

// ─── Border / Corner Motif ────────────────────────────────────────
function MahjongBorder({ color }) {
  return (
    <g>
      <rect x="3" y="3" width="94" height="134" rx="6" ry="6"
        fill="none" stroke={color} strokeWidth="1.5" opacity="0.35" />
      <rect x="6" y="6" width="88" height="128" rx="4" ry="4"
        fill="none" stroke={color} strokeWidth="0.6" opacity="0.2" />
      {[[50, 5], [50, 135]].map(([cx, cy], i) => (
        <g key={i} transform={`translate(${cx},${cy})`}>
          <line x1="-8" y1="0" x2="8" y2="0" stroke={color} strokeWidth="0.8" opacity="0.25" />
          <circle cx="0" cy="0" r="1.5" fill={color} opacity="0.3" />
        </g>
      ))}
    </g>
  );
}

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

// ─── Card Back ────────────────────────────────────────────────────
export function CardBack() {
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

export function PlayingCardBack({ width = 80, height = 112, }) {
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

// // ─── Full Deck Preview App ────────────────────────────────────────
// const FULL_DECK = Object.keys(SUITS).flatMap(suit =>
//   RANKS.map(rank => ({ rank, suit }))
// );

const SIZE_PRESETS = [
  { label: "XS", width: 48, height: 67 },
  { label: "S", width: 64, height: 90 },
  { label: "M", width: 80, height: 112 },
  { label: "L", width: 110, height: 154 },
  { label: "XL", width: 150, height: 210 },
];

// export function DeckPreview() {
//   const [selected, setSelected] = useState(new Set());
//   const [filterSuit, setFilterSuit] = useState("all");
//   const [showBack, setShowBack] = useState(false);
//   const [sizeIdx, setSizeIdx] = useState(2); // default "M"

//   const { width, height } = SIZE_PRESETS[sizeIdx];

//   const toggle = (key) => setSelected(prev => {
//     const next = new Set(prev);
//     next.has(key) ? next.delete(key) : next.add(key);
//     return next;
//   });

//   const displayed = filterSuit === "all"
//     ? FULL_DECK
//     : FULL_DECK.filter(c => c.suit === filterSuit);

//   return (
//     <div style={{
//       minHeight: "100vh",
//       background: "linear-gradient(135deg, #0d1f16 0%, #1a3a2a 50%, #0d2020 100%)",
//       fontFamily: "serif",
//       padding: "32px 24px",
//     }}>
//       {/* Header */}
//       <div style={{ textAlign: "center", marginBottom: 32 }}>
//         <div style={{
//           color: "#c8a951", fontSize: 11, letterSpacing: 6,
//           textTransform: "uppercase", marginBottom: 8, opacity: 0.7
//         }}>
//           Interactive Fiction
//         </div>
//         <h1 style={{
//           color: "#f5f0e8", fontSize: 28, margin: 0,
//           fontWeight: "normal", letterSpacing: 2
//         }}>
//           麻將風格牌組
//         </h1>
//         <p style={{ color: "#c8b89a", fontSize: 13, marginTop: 8, opacity: 0.6 }}>
//           Mahjong-Inspired Playing Card Deck — 52 Cards
//         </p>
//       </div>

//       {/* Controls */}
//       <div style={{
//         display: "flex", gap: 12, justifyContent: "center",
//         flexWrap: "wrap", marginBottom: 16
//       }}>
//         {["all", ...Object.keys(SUITS)].map(s => (
//           <button key={s} onClick={() => setFilterSuit(s)} style={{
//             padding: "6px 18px", borderRadius: 4, border: "1px solid",
//             borderColor: filterSuit === s ? "#c8a951" : "#2d4a3e",
//             background: filterSuit === s ? "#c8a951" : "transparent",
//             color: filterSuit === s ? "#0d1f16" : "#c8b89a",
//             cursor: "pointer", fontSize: 13, fontFamily: "serif",
//             letterSpacing: 1, transition: "all 0.15s",
//           }}>
//             {s === "all" ? "全部 All" : `${SUITS[s].symbol} ${SUITS[s].zh}`}
//           </button>
//         ))}
//         <button onClick={() => setShowBack(b => !b)} style={{
//           padding: "6px 18px", borderRadius: 4, border: "1px solid #2d4a3e",
//           background: showBack ? "#2d4a3e" : "transparent",
//           color: "#c8b89a", cursor: "pointer", fontSize: 13,
//           fontFamily: "serif", letterSpacing: 1,
//         }}>
//           {showBack ? "Show Face" : "Show Back"}
//         </button>
//         {selected.size > 0 && (
//           <button onClick={() => setSelected(new Set())} style={{
//             padding: "6px 18px", borderRadius: 4, border: "1px solid #8b1a1a",
//             background: "transparent", color: "#c0392b", cursor: "pointer",
//             fontSize: 13, fontFamily: "serif",
//           }}>
//             Clear ({selected.size})
//           </button>
//         )}
//       </div>

//       {/* Size picker */}
//       <div style={{
//         display: "flex", gap: 8, justifyContent: "center",
//         marginBottom: 28, alignItems: "center"
//       }}>
//         <span style={{ color: "#c8b89a", fontSize: 12, opacity: 0.6, letterSpacing: 1 }}>SIZE</span>
//         {SIZE_PRESETS.map((p, i) => (
//           <button key={p.label} onClick={() => setSizeIdx(i)} style={{
//             width: 36, padding: "4px 0", borderRadius: 4, border: "1px solid",
//             borderColor: sizeIdx === i ? "#c8a951" : "#2d4a3e",
//             background: sizeIdx === i ? "#c8a951" : "transparent",
//             color: sizeIdx === i ? "#0d1f16" : "#c8b89a",
//             cursor: "pointer", fontSize: 12, fontFamily: "serif", letterSpacing: 1,
//           }}>
//             {p.label}
//           </button>
//         ))}
//         <span style={{ color: "#c8b89a", fontSize: 11, opacity: 0.4, marginLeft: 4 }}>
//           {width}×{height}px
//         </span>
//       </div>

//       {/* Selected info */}
//       {selected.size > 0 && (
//         <div style={{
//           textAlign: "center", marginBottom: 20,
//           color: "#c8a951", fontSize: 13, letterSpacing: 1
//         }}>
//           Selected: {[...selected].join("  ·  ")}
//         </div>
//       )}

//       {/* Card Grid */}
//       <div style={{
//         display: "flex", flexWrap: "wrap", gap: 10,
//         justifyContent: "center", maxWidth: 1200, margin: "0 auto",
//         paddingBottom: Math.round(height * 0.12),
//       }}>
//         {displayed.map(({ rank, suit }) => {
//           const key = `${rank.value}-${suit}`;
//           return (
//             <PlayingCard
//               key={key}
//               rank={rank}
//               suit={suit}
//               faceDown={showBack}
//               selected={selected.has(key)}
//               onClick={() => toggle(key)}
//               width={width}
//               height={height}
//             />
//           );
//         })}
//       </div>

//       {/* Footer */}
//       <div style={{
//         textAlign: "center", marginTop: 40,
//         color: "#2d4a3e", fontSize: 11, letterSpacing: 3
//       }}>
//         ◆ CLICK CARDS TO SELECT · 點擊選牌 ◆
//       </div>
//     </div>
//   );
// }