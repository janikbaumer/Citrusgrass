export function KeyIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 40 40"
      className={className}
      aria-hidden
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="13" cy="20" r="8" fill="var(--color-accent)" />
      <circle cx="13" cy="20" r="3.5" fill="var(--color-bg)" />
      <rect x="19" y="17" width="16" height="6" fill="var(--color-accent)" />
      <rect x="27" y="23" width="3" height="6" fill="var(--color-accent)" />
      <rect x="32" y="23" width="3" height="8" fill="var(--color-accent)" />
    </svg>
  );
}
