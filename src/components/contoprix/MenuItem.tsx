import { resolveComponentSettings } from "@contoprix/react";
import type { ContoprixComponentProps } from "@contoprix/react";
import type { MenuItemComponentComponentSettings } from "@/contoprix/generated";
import { DynamicIcon } from "./icons";

/** Standalone rendering of a single menu item (nested trees normally render through
 * NavigationMenu/DocumentationNavigation -- this covers a menu_item_component block used on
 * its own). */
export default function MenuItem(props: ContoprixComponentProps) {
  const { data, previewAttributes } = resolveComponentSettings<MenuItemComponentComponentSettings>(props);
  if (!data?.label) return null;

  return (
    <a
      href={data.url ?? "#"}
      className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-700 hover:text-orange-600"
      {...previewAttributes}
    >
      {data.icon ? <DynamicIcon icon={data.icon} className="size-4" aria-hidden /> : null}
      {data.label}
    </a>
  );
}
