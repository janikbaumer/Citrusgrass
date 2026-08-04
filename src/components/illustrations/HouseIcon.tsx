export function HouseIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 40 40"
      className={className}
      aria-hidden
      xmlns="http://www.w3.org/2000/svg"
    >
      <polygon points="20,6 5,20 35,20" fill="var(--color-good)" />
      <rect x="9" y="20" width="22" height="15" rx="2" fill="var(--color-accent)" />
      <rect x="17" y="26" width="6" height="9" rx="1" fill="var(--color-ink)" />
    </svg>
  );
}
