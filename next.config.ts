import type { NextConfig } from "next";
import { PHASE_PRODUCTION_BUILD } from "next/constants";

export default function nextConfig(phase: string): NextConfig {
  // Only static-export for `next build` (i.e. for deployment). Skipping it
  // for `next dev` keeps dynamicParams unrestricted locally, so the three
  // dynamic routes (apply/[propertyId], homeowner/properties/[id], .../edit)
  // can still be dev-tested with arbitrary real IDs instead of only the
  // "placeholder" param used for the static export shell.
  if (phase === PHASE_PRODUCTION_BUILD) {
    return { output: "export" };
  }
  return {};
}
