import { StickyNote } from "lucide-react";

import { resolveComponentSettings } from "@contoprix/react";
import type { ContoprixComponentProps } from "@contoprix/react";
import type { NoteComponentSettings } from "@/contoprix/generated";
import { RichText } from "./richtext";

export default function Note(props: ContoprixComponentProps) {
  const { data, previewAttributes } = resolveComponentSettings<NoteComponentSettings>(props);
  if (!data?.content) return null;

  return (
    <div className="flex gap-3 border border-slate-200 bg-slate-50 p-4 text-slate-700" {...previewAttributes}>
      <StickyNote className="mt-0.5 size-4 shrink-0 text-slate-500" aria-hidden />
      <div className="text-sm leading-6">
        <RichText value={data.content} />
      </div>
    </div>
  );
}
