import Link from "next/link";

const LINKS = [
  { href: "/about", label: "About us" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact" },
] as const;

export function PublicHeader({ active }: { active?: (typeof LINKS)[number]["href"] }) {
  return (
    <header className="flex items-center justify-between px-6 py-5">
      <Link href="/" className="text-lg font-semibold text-ink">
        Citrusgrass
      </Link>
      <nav className="flex gap-5 text-sm font-medium text-muted">
        {LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={link.href === active ? "text-accent" : "hover:text-ink"}
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
