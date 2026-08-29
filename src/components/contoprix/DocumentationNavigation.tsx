import { resolveComponentSettings } from "@contoprix/react";
import type { ContoprixComponentProps } from "@contoprix/react";
import type { DocumentationNavigationComponentSettings, MenuItemComponentComponentSettings } from "@/contoprix/generated";
import { DynamicIcon } from "./icons";

export default function DocumentationNavigation(props: ContoprixComponentProps) {
  const { data, previewAttributes } = resolveComponentSettings<DocumentationNavigationComponentSettings>(props);
  const items = data?.items ?? [];
  if (items.length === 0) return null;

  return (
    <nav aria-label="Documentation" className="w-64 shrink-0 space-y-1 text-sm" {...previewAttributes}>
      {items.map((item, index) => (
        <DocNavItem key={`${item.label}-${index}`} item={item} depth={0} />
      ))}
    </nav>
  );
}

function DocNavItem({ item, depth }: { item: MenuItemComponentComponentSettings; depth: number }) {
  const children = item.children ?? [];

  return (
    <div>
      <a
        href={item.url ?? "#"}
        style={{ paddingLeft: `${depth * 0.75 + 0.75}rem` }}
        className="flex items-center gap-2 py-1.5 pr-3 text-slate-600 hover:text-orange-600"
      >
        {item.icon ? <DynamicIcon icon={item.icon} className="size-3.5" aria-hidden /> : null}
        {item.label}
      </a>
      {children.length > 0 ? (
        <div>
          {children.map((child, index) => (
            <DocNavItem key={`${child.label}-${index}`} item={child} depth={depth + 1} />
          ))}
        </div>
      ) : null}
    </div>
  );
}
