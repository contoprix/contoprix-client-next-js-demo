import { resolveContentList } from "@contoprix/react";
import type { ContoprixComponentProps } from "@contoprix/react";

/** Generic fallback for a "content-list" block not tied to a content type with its own
 * registered override (e.g. `blog_post-list`, above, takes precedence for that type). Renders
 * whatever fields are present without assuming a shape. */
export default function ContentList(props: ContoprixComponentProps) {
  const { entries, previewAttributes } = resolveContentList(props);
  if (entries.length === 0) return null;

  return (
    <ul className="divide-y divide-slate-200 border border-slate-200 bg-white" {...previewAttributes}>
      {entries.map((entry) => (
        <li key={entry.id} className="px-4 py-3">
          <p className="text-sm font-medium text-slate-950">
            {String(entry.data.title ?? entry.slug ?? entry.id)}
          </p>
          {entry.slug ? <p className="text-xs text-slate-500">/{entry.slug}</p> : null}
        </li>
      ))}
    </ul>
  );
}
