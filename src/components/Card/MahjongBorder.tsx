
// ─── Border / Corner Motif ────────────────────────────────────────
export default function MahjongBorder({ color }) {
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