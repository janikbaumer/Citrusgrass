"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import type { UserRole } from "@/lib/types";

export function useRequireRole(requiredRole: UserRole) {
  const router = useRouter();
  const { user, profile, loading } = useAuth();

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.replace("/login");
      return;
    }
    if (!profile) {
      router.replace("/onboarding");
      return;
    }
    if (profile.role !== requiredRole) {
      router.replace(`/${profile.role}/dashboard`);
    }
  }, [loading, user, profile, requiredRole, router]);

  const ready = !loading && !!user && !!profile && profile.role === requiredRole;
  return { user, profile, ready };
}
