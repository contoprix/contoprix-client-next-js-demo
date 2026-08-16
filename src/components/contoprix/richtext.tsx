import type { ReactNode } from "react";

/**
 * Renders a ProseMirror/TipTap document (the shape `richtext` fields deliver, e.g.
 * BlogPostContent["content"]) as plain React elements -- never `dangerouslySetInnerHTML`, so
 * there's no sanitization to get right or wrong. Covers the common block/mark set; anything
 * unrecognized degrades to its own text content rather than being dropped silently.
 */

interface ProseMirrorMark {
  type: string;
  attrs?: Record<string, unknown>;
}

interface ProseMirrorNode {
  type: string;
  attrs?: Record<string, unknown>;
  text?: string;
  marks?: ProseMirrorMark[];
  content?: ProseMirrorNode[];
}

export function RichText({ value }: { value: unknown }) {
  const doc = parseDoc(value);
  if (!doc || !doc.content?.length) return null;

  return <div className="space-y-4">{doc.content.map((node, index) => renderBlock(node, index))}</div>;
}

function parseDoc(value: unknown): ProseMirrorNode | null {
  if (!value) return null;
  if (typeof value === "string") {
    try {
      return parseDoc(JSON.parse(value));
    } catch {
      return null;
    }
  }
  if (typeof value === "object" && "type" in value) return value as ProseMirrorNode;
  return null;
}

function renderBlock(node: ProseMirrorNode, key: number): ReactNode {
  const children = node.content?.map((child, index) => renderInline(child, index));

  switch (node.type) {
    case "paragraph":
      return (
        <p key={key} className="leading-7 text-slate-700">
          {children}
        </p>
      );
    case "heading": {
      const level = Number(node.attrs?.level) || 2;
      const Tag = (`h${Math.min(Math.max(level, 1), 6)}` as unknown) as "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
      return (
        <Tag key={key} className="font-semibold tracking-tight text-slate-950">
          {children}
        </Tag>
      );
    }
    case "bulletList":
      return (
        <ul key={key} className="list-disc space-y-1 pl-5 text-slate-700">
          {node.content?.map((item, index) => <li key={index}>{item.content?.map((c, i) => renderBlock(c, i))}</li>)}
        </ul>
      );
    case "orderedList":
      return (
        <ol key={key} className="list-decimal space-y-1 pl-5 text-slate-700">
          {node.content?.map((item, index) => <li key={index}>{item.content?.map((c, i) => renderBlock(c, i))}</li>)}
        </ol>
      );
    case "blockquote":
      return (
        <blockquote key={key} className="border-l-2 border-orange-300 pl-4 text-slate-600 italic">
          {children}
        </blockquote>
      );
    default:
      return children?.length ? (
        <p key={key} className="leading-7 text-slate-700">
          {children}
        </p>
      ) : null;
  }
}

function renderInline(node: ProseMirrorNode, key: number): ReactNode {
  if (node.type !== "text" || !node.text) {
    return node.content?.map((child, index) => renderInline(child, index)) ?? null;
  }

  let content: ReactNode = node.text;

  for (const mark of node.marks ?? []) {
    switch (mark.type) {
      case "bold":
        content = <strong key={key}>{content}</strong>;
        break;
      case "italic":
        content = <em key={key}>{content}</em>;
        break;
      case "link": {
        const href = typeof mark.attrs?.href === "string" ? mark.attrs.href : undefined;
        if (href) {
          content = (
            <a key={key} href={href} className="text-orange-600 underline underline-offset-2">
              {content}
            </a>
          );
        }
        break;
      }
    }
  }

  return <span key={key}>{content}</span>;
}
