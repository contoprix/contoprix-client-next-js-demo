import { resolveContentList } from "@contoprix/react";
import type { ContoprixComponentProps } from "@contoprix/react";
import type { ContoprixContentEntry } from "@contoprix/types";
import type { DocumentationPageContent } from "@/contoprix/generated";

/** Renders the "documentation_page-list" content-list block -- a page listing multiple
 * documentation_page entries, e.g. a docs index/hub page. Modeled on BlogPostList.tsx. */
export default function DocumentationPageList(props: ContoprixComponentProps) {
  const { entries, previewAttributes } = resolveContentList(props);
  if (entries.length === 0) return null;

  const sorted = [...entries].sort((left, right) => {
    const leftOrder = (left.data as Partial<DocumentationPageContent>).sort_order ?? 0;
    const rightOrder = (right.data as Partial<DocumentationPageContent>).sort_order ?? 0;
    return (leftOrder ?? 0) - (rightOrder ?? 0);
  });

  return (
    <div className="divide-y divide-slate-200 border border-slate-200" {...previewAttributes}>
      {sorted.map((entry) => (
        <DocumentationPageRow key={entry.id} entry={entry} />
      ))}
    </div>
  );
}

function DocumentationPageRow({ entry }: { entry: ContoprixContentEntry }) {
  const data = entry.data as Partial<DocumentationPageContent>;
  if (!data.title) return null;

  return (
    <a
      href={data.slug ? `/${data.slug}` : "#"}
      className="flex items-center justify-between gap-4 px-5 py-4 hover:bg-slate-50"
    >
      <span className="text-sm font-medium text-slate-950">{data.title}</span>
      {data.section ? (
        <span className="shrink-0 border border-slate-200 px-2 py-0.5 text-xs font-medium text-slate-500">
          {data.section}
        </span>
      ) : null}
    </a>
  );
}
