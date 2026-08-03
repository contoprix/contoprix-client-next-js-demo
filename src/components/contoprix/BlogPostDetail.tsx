"use client";

import {
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Clock3,
  Copy,
  ExternalLink,
  ListTree,
  UserRound,
} from "lucide-react";

import type { ContoprixComponentProps } from "@contoprix/react";

type MediaVariant = {
  VariantType?: string;
  variantType?: string;
  Url?: string;
  url?: string;
  Width?: number | null;
  width?: number | null;
  Height?: number | null;
  height?: number | null;
};

type MediaValue = {
  Id?: string;
  id?: string;
  FileName?: string;
  fileName?: string;
  Url?: string;
  url?: string;
  AltText?: string | null;
  altText?: string | null;
  Caption?: string | null;
  caption?: string | null;
  Variants?: MediaVariant[] | null;
  variants?: MediaVariant[] | null;
};

type ButtonValue = {
  label?: string | null;
  url?: string | null;
  variant?: string | null;
  size?: string | null;
  start_icon?: string | null;
  end_icon?: string | null;
  open_in_new_tab?: boolean;
  full_width?: boolean;
  disabled?: boolean;
  aria_label?: string | null;
};

type BlogCtaValue = {
  heading?: string | null;
  description?: string | null;
  primary_button?: ButtonValue | null;
  secondary_button?: ButtonValue | null;
};

type RelatedLinkValue = {
  text?: string | null;
  url?: string | null;
  title?: string | null;
  target?: "_self" | "_blank" | string | null;
  rel?: string | null;
  aria_label?: string | null;
};

type RelationValue =
  | string
  | {
      id?: string;
      data?: Record<string, unknown>;
      title?: string;
      name?: string;
      slug?: string;
    }
  | null;

type RichTextNode = {
  type?: string;
  text?: string;
  attrs?: Record<string, unknown> | null;
  marks?: Array<{
    type?: string;
    attrs?: Record<string, unknown> | null;
  }> | null;
  content?: RichTextNode[] | null;
};

type RichTextDocument = {
  type?: string;
  content?: RichTextNode[] | null;
};

type BlogPostData = {
  title?: string | null;
  slug?: string | null;
  excerpt?: string | null;
  content?: RichTextDocument | string | null;
  featured_image?: MediaValue | string | null;
  featured_image_alt?: string | null;
  author?: RelationValue;
  categories?: RelationValue[] | RelationValue;
  tags?: RelationValue[] | RelationValue;
  status?: string | null;
  publish_date?: string | null;
  updated_date?: string | null;
  featured?: boolean;
  show_author?: boolean;
  show_toc?: boolean;
  allow_comments?: boolean;
  cta?: BlogCtaValue | null;
  related_links?: Array<RelatedLinkValue | { links?: RelatedLinkValue | null }> | null;
};

type HeadingItem = {
  id: string;
  text: string;
  level: 2 | 3;
};

export default function BlogPostDetail({
  content,
  previewAttributes,
}: ContoprixComponentProps) {
  const [readingProgress, setReadingProgress] = useState(0);
  const [copied, setCopied] = useState(false);

  const contentEntry = asRecord(content);
  const data = asRecord(contentEntry?.data) as BlogPostData | null;

  const title = data?.title?.trim() || "Untitled article";
  const excerpt = data?.excerpt?.trim() || "";
  const imageUrl = getMediaUrl(data?.featured_image, "medium");
  const imageAlt =
    data?.featured_image_alt?.trim() ||
    getMediaAlt(data?.featured_image) ||
    title;

  const headings = useMemo(
    () => extractHeadings(data?.content),
    [data?.content],
  );

  const readingTime = useMemo(
    () => calculateReadingTime(data?.content),
    [data?.content],
  );

  const authorName = getRelationLabel(data?.author ?? "");
  const categories = normalizeRelations(data?.categories);
  const tags = normalizeRelations(data?.tags);
  const relatedLinks = normalizeRelatedLinks(data?.related_links);

  useEffect(() => {
    function updateProgress() {
      const article = document.getElementById("blog-article");

      if (!article) {
        setReadingProgress(0);
        return;
      }

      const rect = article.getBoundingClientRect();
      const articleTop = window.scrollY + rect.top;
      const articleHeight = article.offsetHeight;
      const viewportBottom = window.scrollY + window.innerHeight;

      const progress =
        ((viewportBottom - articleTop) / articleHeight) * 100;

      setReadingProgress(
        Math.max(0, Math.min(100, progress)),
      );
    }

    updateProgress();
    window.addEventListener("scroll", updateProgress, {
      passive: true,
    });
    window.addEventListener("resize", updateProgress);

    return () => {
      window.removeEventListener("scroll", updateProgress);
      window.removeEventListener("resize", updateProgress);
    };
  }, []);

  async function copyCurrentUrl() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  }

  return (
    <article
      id="blog-article"
      {...previewAttributes}
      className="relative bg-white"
    >
      <div
        aria-hidden="true"
        className="fixed left-0 top-0 z-[60] h-1 bg-orange-600 transition-[width]"
        style={{ width: `${readingProgress}%` }}
      />

      <header className="border-b border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-5xl px-5 py-12 sm:px-8 lg:py-16">
          {categories.length > 0 ? (
            <div className="mb-5 flex flex-wrap gap-2">
              {categories.map((category) => (
                <span
                  key={category}
                  className="rounded-full bg-orange-100 px-3 py-1 text-sm font-semibold text-orange-800"
                >
                  {category}
                </span>
              ))}
            </div>
          ) : null}

          <h1 className="max-w-4xl text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
            {title}
          </h1>

          {excerpt ? (
            <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-600 sm:text-xl">
              {excerpt}
            </p>
          ) : null}

          <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-3 text-sm text-slate-600">
            {data?.show_author !== false && authorName ? (
              <span className="inline-flex items-center gap-2">
                <UserRound className="size-4" aria-hidden="true" />
                {authorName}
              </span>
            ) : null}

            {data?.publish_date ? (
              <time
                dateTime={data.publish_date}
                className="inline-flex items-center gap-2"
              >
                <CalendarDays className="size-4" aria-hidden="true" />
                {formatDate(data.publish_date)}
              </time>
            ) : null}

            <span className="inline-flex items-center gap-2">
              <Clock3 className="size-4" aria-hidden="true" />
              {readingTime} min read
            </span>

            <button
              type="button"
              onClick={copyCurrentUrl}
              className="inline-flex items-center gap-2 font-medium text-slate-700 transition-colors hover:text-orange-700"
            >
              <Copy className="size-4" aria-hidden="true" />
              {copied ? "Copied" : "Copy link"}
            </button>
          </div>
        </div>
      </header>

      {imageUrl ? (
        <div className="mx-auto max-w-6xl px-5 pt-10 sm:px-8">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imageUrl}
            alt={imageAlt}
            className="max-h-[620px] w-full rounded-2xl border border-slate-200 object-cover shadow-sm"
          />
        </div>
      ) : null}

      <div className="mx-auto grid max-w-6xl gap-12 px-5 py-12 sm:px-8 lg:grid-cols-[minmax(0,1fr)_280px] lg:py-16">
        <main className="min-w-0">
          <div className="prose prose-slate max-w-none prose-headings:scroll-mt-28 prose-headings:text-slate-950 prose-a:text-orange-700 prose-a:no-underline hover:prose-a:underline prose-img:rounded-xl">
            <RichTextRenderer value={data?.content} />
          </div>

          {tags.length > 0 ? (
            <div className="mt-10 flex flex-wrap gap-2 border-t border-slate-200 pt-6">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-md border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm text-slate-700"
                >
                  #{tag}
                </span>
              ))}
            </div>
          ) : null}

          {relatedLinks.length > 0 ? (
            <section className="mt-10 rounded-xl border border-slate-200 bg-slate-50 p-6">
              <h2 className="text-xl font-bold text-slate-950">
                Related links
              </h2>

              <ul className="mt-4 grid gap-3">
                {relatedLinks.map((item, index) => {
                  const href = normalizeHref(item.url);
                  const newTab = item.target === "_blank";

                  return (
                    <li key={`${href}-${index}`}>
                      <a
                        href={href}
                        target={newTab ? "_blank" : undefined}
                        rel={
                          newTab
                            ? normalizeRel(item.rel)
                            : item.rel || undefined
                        }
                        aria-label={item.aria_label || undefined}
                        className="inline-flex items-center gap-2 font-semibold text-orange-700 hover:underline"
                      >
                        {item.text || item.title || href}
                        {newTab ? (
                          <ExternalLink
                            className="size-4"
                            aria-hidden="true"
                          />
                        ) : null}
                      </a>
                    </li>
                  );
                })}
              </ul>
            </section>
          ) : null}

          {data?.cta ? <BlogCta value={data.cta} /> : null}

          <nav
            aria-label="Blog post navigation"
            className="mt-12 grid gap-4 border-t border-slate-200 pt-8 sm:grid-cols-2"
          >
            <Link
              href="/blog"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md border border-slate-300 px-5 font-semibold text-slate-800 transition-colors hover:bg-slate-50"
            >
              <ArrowLeft className="size-4" aria-hidden="true" />
              Back to blog
            </Link>

            <Link
              href="/"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-orange-600 px-5 font-semibold text-white transition-colors hover:bg-orange-700"
            >
              Go to home
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </nav>
        </main>

        <aside className="space-y-6">
          {data?.show_toc && headings.length > 0 ? (
            <div className="sticky top-28 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-slate-900">
                <ListTree className="size-4" aria-hidden="true" />
                On this page
              </h2>

              <nav className="mt-4">
                <ul className="space-y-2 text-sm">
                  {headings.map((heading) => (
                    <li
                      key={heading.id}
                      className={heading.level === 3 ? "pl-4" : ""}
                    >
                      <a
                        href={`#${heading.id}`}
                        className="text-slate-600 transition-colors hover:text-orange-700"
                      >
                        {heading.text}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
          ) : null}
        </aside>
      </div>
    </article>
  );
}

function BlogCta({ value }: { value: BlogCtaValue }) {
  const heading = value.heading?.trim();
  const description = value.description?.trim();

  if (
    !heading &&
    !description &&
    !value.primary_button &&
    !value.secondary_button
  ) {
    return null;
  }

  return (
    <section className="mt-12 rounded-2xl bg-slate-950 px-6 py-8 text-white sm:px-8">
      {heading ? (
        <h2 className="text-2xl font-bold tracking-tight">
          {heading}
        </h2>
      ) : null}

      {description ? (
        <p className="mt-3 max-w-2xl text-slate-300">
          {description}
        </p>
      ) : null}

      <div className="mt-6 flex flex-wrap gap-3">
        {value.primary_button ? (
          <BlogButton value={value.primary_button} primary />
        ) : null}

        {value.secondary_button ? (
          <BlogButton value={value.secondary_button} />
        ) : null}
      </div>
    </section>
  );
}

function BlogButton({
  value,
  primary = false,
}: {
  value: ButtonValue;
  primary?: boolean;
}) {
  const label = value.label?.trim();

  if (!label || value.disabled) {
    return null;
  }

  const href = normalizeHref(value.url);
  const newTab = value.open_in_new_tab === true;

  return (
    <a
      href={href}
      target={newTab ? "_blank" : undefined}
      rel={newTab ? "noopener noreferrer" : undefined}
      aria-label={value.aria_label || label}
      className={[
        "inline-flex min-h-11 items-center justify-center rounded-md px-5 font-semibold transition-colors",
        value.full_width ? "w-full sm:w-auto" : "",
        primary
          ? "bg-orange-600 text-white hover:bg-orange-700"
          : "border border-slate-600 bg-transparent text-white hover:bg-slate-800",
      ].join(" ")}
    >
      {label}
    </a>
  );
}

function RichTextRenderer({
  value,
}: {
  value: BlogPostData["content"];
}) {
  if (!value) {
    return null;
  }

  if (typeof value === "string") {
    return <p>{value}</p>;
  }

  return (
    <>
      {(value.content || []).map((node, index) => (
        <RichTextNodeRenderer
          key={`${node.type || "node"}-${index}`}
          node={node}
          path={`${index}`}
        />
      ))}
    </>
  );
}

function RichTextNodeRenderer({
  node,
  path,
}: {
  node: RichTextNode;
  path: string;
}): ReactNode {
  const children = (node.content || []).map((child, index) => (
    <RichTextNodeRenderer
      key={`${path}-${index}`}
      node={child}
      path={`${path}-${index}`}
    />
  ));

  switch (node.type) {
    case "text":
      return applyMarks(node.text || "", node.marks || []);

    case "paragraph":
      return <p>{children}</p>;

    case "heading": {
      const level = Number(node.attrs?.level || 2);
      const text = extractNodeText(node);
      const id = slugify(text);

      if (level === 1) return <h1 id={id}>{children}</h1>;
      if (level === 3) return <h3 id={id}>{children}</h3>;
      if (level === 4) return <h4 id={id}>{children}</h4>;
      if (level === 5) return <h5 id={id}>{children}</h5>;
      if (level === 6) return <h6 id={id}>{children}</h6>;

      return <h2 id={id}>{children}</h2>;
    }

    case "bulletList":
      return <ul>{children}</ul>;

    case "orderedList":
      return <ol>{children}</ol>;

    case "listItem":
      return <li>{children}</li>;

    case "blockquote":
      return <blockquote>{children}</blockquote>;

    case "codeBlock":
      return (
        <pre>
          <code>{extractNodeText(node)}</code>
        </pre>
      );

    case "hardBreak":
      return <br />;

    case "horizontalRule":
      return <hr />;

    default:
      return <>{children}</>;
  }
}

function applyMarks(
  text: string,
  marks: NonNullable<RichTextNode["marks"]>,
): ReactNode {
  return marks.reduce<ReactNode>((result, mark, index) => {
    switch (mark.type) {
      case "bold":
        return <strong key={index}>{result}</strong>;

      case "italic":
        return <em key={index}>{result}</em>;

      case "strike":
        return <s key={index}>{result}</s>;

      case "code":
        return <code key={index}>{result}</code>;

      case "link": {
        const href = normalizeHref(
          typeof mark.attrs?.href === "string"
            ? mark.attrs.href
            : undefined,
        );

        const target =
          typeof mark.attrs?.target === "string"
            ? mark.attrs.target
            : undefined;

        const rel =
          typeof mark.attrs?.rel === "string"
            ? mark.attrs.rel
            : undefined;

        return (
          <a
            key={index}
            href={href}
            target={target}
            rel={
              target === "_blank"
                ? normalizeRel(rel)
                : rel
            }
          >
            {result}
          </a>
        );
      }

      default:
        return result;
    }
  }, text);
}

function extractHeadings(
  value: BlogPostData["content"],
): HeadingItem[] {
  if (!value || typeof value === "string") {
    return [];
  }

  const result: HeadingItem[] = [];

  function walk(nodes: RichTextNode[] | null | undefined) {
    for (const node of nodes || []) {
      if (node.type === "heading") {
        const level = Number(node.attrs?.level || 2);

        if (level === 2 || level === 3) {
          const text = extractNodeText(node).trim();

          if (text) {
            result.push({
              id: slugify(text),
              text,
              level,
            });
          }
        }
      }

      walk(node.content);
    }
  }

  walk(value.content);
  return result;
}

function calculateReadingTime(
  value: BlogPostData["content"],
): number {
  const text =
    typeof value === "string"
      ? value
      : extractDocumentText(value);

  const words = text
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;

  return Math.max(1, Math.ceil(words / 220));
}

function extractDocumentText(
  value: RichTextDocument | null | undefined,
): string {
  return (value?.content || [])
    .map(extractNodeText)
    .join(" ");
}

function extractNodeText(node: RichTextNode): string {
  if (node.type === "text") {
    return node.text || "";
  }

  return (node.content || [])
    .map(extractNodeText)
    .join(" ");
}

function normalizeRelations(
  value: BlogPostData["categories"] | BlogPostData["tags"],
): string[] {
  const values = Array.isArray(value)
    ? value
    : value
      ? [value]
      : [];

  return values
    .map(getRelationLabel)
    .filter((item): item is string => Boolean(item));
}

function getRelationLabel(
  value: RelationValue,
): string {
  if (!value) {
    return "";
  }

  if (typeof value === "string") {
    return value.trim();
  }

  const data = asRecord(value.data);

  return (
    value.title ||
    value.name ||
    (typeof data?.title === "string" ? data.title : "") ||
    (typeof data?.name === "string" ? data.name : "") ||
    ""
  ).trim();
}

function normalizeRelatedLinks(
  items: BlogPostData["related_links"],
): RelatedLinkValue[] {
  if (!Array.isArray(items)) {
    return [];
  }

  return items
    .map((item) => {
      const record = asRecord(item);
      const nested = asRecord(record?.links);

      return (nested || record) as RelatedLinkValue | null;
    })
    .filter(
      (item): item is RelatedLinkValue =>
        Boolean(item?.url || item?.text || item?.title),
    );
}

function getMediaUrl(
  value: MediaValue | string | null | undefined,
  preferredVariant?: string,
): string {
  if (typeof value === "string") {
    return value.trim();
  }

  const variants = value?.Variants || value?.variants || [];

  const preferred = variants.find((variant) => {
    const type =
      variant.VariantType || variant.variantType;

    return type === preferredVariant;
  });

  return (
    preferred?.Url ||
    preferred?.url ||
    value?.Url ||
    value?.url ||
    ""
  );
}

function getMediaAlt(
  value: MediaValue | string | null | undefined,
): string {
  if (!value || typeof value === "string") {
    return "";
  }

  return value.AltText || value.altText || "";
}

function normalizeHref(value?: string | null): string {
  const href = value?.trim();

  if (!href) {
    return "#";
  }

  if (
    href.startsWith("/") ||
    href.startsWith("#") ||
    href.startsWith("http://") ||
    href.startsWith("https://") ||
    href.startsWith("mailto:") ||
    href.startsWith("tel:")
  ) {
    return href;
  }

  return `/${href}`;
}

function normalizeRel(value?: string | null): string {
  const parts = new Set(
    (value || "")
      .split(/\s+/)
      .map((item) => item.trim())
      .filter(Boolean),
  );

  parts.add("noopener");
  parts.add("noreferrer");

  return Array.from(parts).join(" ");
}

function formatDate(value: string): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function asRecord(
  value: unknown,
): Record<string, unknown> | null {
  return value &&
    typeof value === "object" &&
    !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : null;
}
