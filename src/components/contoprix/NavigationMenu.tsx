"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

import { resolveComponentSettings } from "@contoprix/react";
import type { ContoprixComponentProps } from "@contoprix/react";
import type { MenuItemComponentComponentSettings, NavigationMenuComponentSettings } from "@/contoprix/generated";
import { DynamicIcon } from "./icons";

export default function NavigationMenu(props: ContoprixComponentProps) {
  const { data, previewAttributes } = resolveComponentSettings<NavigationMenuComponentSettings>(props);
  const items = data?.items ?? [];
  if (items.length === 0) return null;

  return (
    <nav aria-label={data?.name ?? "Navigation"} className="flex items-center gap-1" {...previewAttributes}>
      {items.map((item, index) => (
        <MenuItemLink key={`${item.label}-${index}`} item={item} />
      ))}
    </nav>
  );
}

function MenuItemLink({ item }: { item: MenuItemComponentComponentSettings }) {
  const [open, setOpen] = useState(false);
  const hasChildren = Boolean(item.children?.length);

  return (
    <div
      className="relative"
      onMouseEnter={() => hasChildren && setOpen(true)}
      onMouseLeave={() => hasChildren && setOpen(false)}
    >
      <a
        href={item.url ?? "#"}
        className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-slate-700 hover:text-orange-600"
      >
        {item.icon ? <DynamicIcon icon={item.icon} className="size-4" aria-hidden /> : null}
        {item.label}
        {hasChildren ? <ChevronDown className="size-3.5" aria-hidden /> : null}
      </a>

      {hasChildren && open ? (
        <div className="absolute left-0 top-full z-10 min-w-48 border border-slate-200 bg-white py-1 shadow-md">
          {item.children!.map((child, index) => (
            <a
              key={`${child.label}-${index}`}
              href={child.url ?? "#"}
              className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-orange-600"
            >
              {child.label}
            </a>
          ))}
        </div>
      ) : null}
    </div>
  );
}
