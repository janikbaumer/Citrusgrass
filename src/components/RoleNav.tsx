"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import type { UserRole } from "@/lib/types";

const LINKS: Record<UserRole, { href: string; label: string }[]> = {
  renter: [
    { href: "/renter/dashboard", label: "Dashboard" },
    { href: "/renter/profile", label: "Profile" },
    { href: "/renter/listings", label: "Applications" },
  ],
  homeowner: [
    { href: "/homeowner/dashboard", label: "Dashboard" },
    { href: "/homeowner/properties", label: "Properties" },
    { href: "/homeowner/profile", label: "Profile" },
  ],
};

export function RoleNav({ role }: { role: UserRole }) {
  const pathname = usePathname();
  const { signOut } = useAuth();

  return (
    <nav className="flex items-center justify-between border-b border-line bg-surface px-6 py-3">
      <div className="flex gap-5">
        {LINKS[role].map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={
              pathname === link.href || pathname.startsWith(`${link.href}/`)
                ? "text-sm font-medium text-accent"
                : "text-sm font-medium text-muted hover:text-ink"
            }
          >
            {link.label}
          </Link>
        ))}
      </div>
      <button
        onClick={() => signOut()}
        className="text-sm font-medium text-muted hover:text-ink"
      >
        Sign out
      </button>
    </nav>
  );
}
