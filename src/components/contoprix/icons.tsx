import * as LucideIcons from "lucide-react";
import { Sparkles, type LucideIcon } from "lucide-react";

/** `capability_item.icon` / `hero_callout.callout_icon` are plain text fields (an icon key,
 * e.g. "layout-grid"), not an enum -- there's no fixed option list to type against. Resolved
 * dynamically against lucide-react's own export names rather than a hand-maintained lookup,
 * with a safe default for keys that don't match a known icon. */
export function resolveIcon(key: string | null | undefined): LucideIcon {
  if (!key) return Sparkles;

  const pascalCase = key
    .split(/[-_\s]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("");

  const icon = (LucideIcons as unknown as Record<string, LucideIcon>)[pascalCase];
  return icon ?? Sparkles;
}
