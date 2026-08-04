export function HandoffIllustration({ className }: { className?: string }) {
  const grassX = [40, 64, 88, 112, 136, 344, 368, 392, 416, 440];

  return (
    <svg
      viewBox="0 0 480 320"
      className={className}
      aria-hidden
      xmlns="http://www.w3.org/2000/svg"
    >
      <ellipse cx="240" cy="180" rx="210" ry="120" fill="var(--color-good-bg)" />

      <path
        d="M110 150 C 220 60, 280 60, 360 130"
        fill="none"
        stroke="var(--color-line)"
        strokeWidth="3"
        strokeDasharray="2 10"
        strokeLinecap="round"
      />

      {/* house */}
      <polygon points="130,110 70,150 190,150" fill="var(--color-good)" />
      <rect x="80" y="150" width="100" height="70" rx="4" fill="var(--color-accent)" />
      <rect x="112" y="180" width="36" height="40" rx="2" fill="var(--color-ink)" />
      <rect x="158" y="164" width="16" height="16" rx="2" fill="var(--color-bg)" />

      {/* key */}
      <g transform="translate(345 130) rotate(-28)">
        <circle cx="0" cy="0" r="26" fill="var(--color-accent)" />
        <circle cx="0" cy="0" r="11" fill="var(--color-good-bg)" />
        <rect x="26" y="-8" width="52" height="16" fill="var(--color-accent)" />
        <rect x="60" y="8" width="10" height="16" fill="var(--color-accent)" />
        <rect x="76" y="8" width="10" height="20" fill="var(--color-accent)" />
      </g>

      {/* grass */}
      {grassX.map((x, i) => (
        <rect
          key={x}
          x={x}
          y={264 - (i % 3) * 6}
          width="6"
          height={16 + (i % 3) * 6}
          rx="3"
          fill="var(--color-good)"
          fillOpacity="0.7"
        />
      ))}
    </svg>
  );
}
