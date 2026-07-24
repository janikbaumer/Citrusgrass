"use client";

import type { ReactNode } from "react";
import { useRequireRole } from "@/hooks/useRequireRole";
import { RoleNav } from "@/components/RoleNav";

export default function HomeownerLayout({ children }: { children: ReactNode }) {
  const { ready } = useRequireRole("homeowner");

  if (!ready) {
    return <p className="px-6 py-16 text-center text-gray-500">Loading...</p>;
  }

  return (
    <div className="flex flex-1 flex-col">
      <RoleNav role="homeowner" />
      <div className="flex flex-1 flex-col">{children}</div>
    </div>
  );
}
