export function EmptyStateIllustration({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 120 100"
      className={className}
      aria-hidden
      xmlns="http://www.w3.org/2000/svg"
    >
      <polygon
        points="18,48 42,42 34,60 10,62"
        fill="var(--color-good-bg)"
        stroke="var(--color-line)"
      />
      <polygon
        points="102,48 78,42 86,60 110,62"
        fill="var(--color-good-bg)"
        stroke="var(--color-line)"
      />
      <rect
        x="25"
        y="60"
        width="70"
        height="28"
        rx="3"
        fill="var(--color-surface)"
        stroke="var(--color-line)"
      />
      <circle cx="50" cy="74" r="2.5" fill="var(--color-muted)" />
      <circle cx="60" cy="74" r="2.5" fill="var(--color-muted)" />
      <circle cx="70" cy="74" r="2.5" fill="var(--color-muted)" />
    </svg>
  );
}
