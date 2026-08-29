import { resolveContentList } from "@contoprix/react";
import type { ContoprixComponentProps } from "@contoprix/react";
import type { ContoprixContentEntry } from "@contoprix/types";
import type { BlogPostContent } from "@/contoprix/generated";

const CATEGORY_LABELS: Record<string, string> = {
  engineering: "Engineering",
  product: "Product",
  company_news: "Company News",
  tutorial: "Tutorial",
};

export default function BlogPostList(props: ContoprixComponentProps) {
  const { entries, previewAttributes } = resolveContentList(props);
  if (entries.length === 0) return null;

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3" {...previewAttributes}>
      {entries.map((entry) => (
        <BlogPostCard key={entry.id} entry={entry} />
      ))}
    </div>
  );
}

export function BlogPostCard({ entry }: { entry: ContoprixContentEntry }) {
  const data = entry.data as Partial<BlogPostContent>;
  const image = mediaUrl(data.featured_image);

  return (
    <article className="flex flex-col overflow-hidden border border-slate-200 bg-white">
      {image ? (
        // eslint-disable-next-line @next/next/no-img-element -- media host isn't a configured next/image remote pattern in this demo
        <img src={image} alt="" className="aspect-video w-full object-cover" />
      ) : null}
      <div className="flex flex-1 flex-col p-5">
        {data.category ? (
          <span className="w-fit border border-slate-200 px-2 py-0.5 text-xs font-medium text-slate-600">
            {CATEGORY_LABELS[data.category] ?? data.category}
          </span>
        ) : null}
        <h3 className="mt-3 text-lg font-semibold text-slate-950">{data.title ?? "Untitled post"}</h3>
        {data.excerpt ? <p className="mt-2 flex-1 text-sm leading-6 text-slate-600">{data.excerpt}</p> : null}
        <div className="mt-4 flex items-center gap-2 text-xs text-slate-500">
          {data.author ? <span>{data.author}</span> : null}
          {data.author && data.reading_minutes ? <span aria-hidden>·</span> : null}
          {data.reading_minutes ? <span>{data.reading_minutes} min read</span> : null}
        </div>
      </div>
    </article>
  );
}

/** `image` fields generate as `string` in generated.ts (a media reference id), but the delivery
 * API actually resolves them to a media object -- see the REST/GraphQL example pages. Narrowed
 * defensively here rather than trusting the generated type for this one field. */
function mediaUrl(value: unknown): string | null {
  if (value && typeof value === "object" && "Url" in value && typeof (value as { Url: unknown }).Url === "string") {
    return (value as { Url: string }).Url;
  }
  return null;
}
