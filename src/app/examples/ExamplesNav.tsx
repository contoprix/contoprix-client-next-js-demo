"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  { href: "/examples/rest", label: "REST" },
  { href: "/examples/graphql", label: "GraphQL" },
  { href: "/examples/cards", label: "Cards" },
  { href: "/examples/blocks", label: "Blocks" },
];

export function ExamplesNav() {
  const pathname = usePathname();

  return (
    <nav className="mt-6 flex gap-2 border-b border-slate-200">
      {TABS.map((tab) => {
        const active = pathname?.startsWith(tab.href);

        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={`border-b-2 px-4 py-3 text-sm font-semibold transition-colors ${
              active
                ? "border-orange-600 text-slate-950"
                : "border-transparent text-slate-500 hover:text-slate-900"
            }`}
          >
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}
