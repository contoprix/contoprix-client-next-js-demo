"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

import { resolveComponentSettings } from "@contoprix/react";
import type { ContoprixComponentProps } from "@contoprix/react";
import type { AccordionComponentSettings } from "@/contoprix/generated";
import { RichText } from "./richtext";

export default function Accordion(props: ContoprixComponentProps) {
  const { data, previewAttributes } = resolveComponentSettings<AccordionComponentSettings>(props);
  const items = data?.items ?? [];
  const [openIndexes, setOpenIndexes] = useState<Set<number>>(new Set([0]));
  if (items.length === 0) return null;

  const allowMultiple = data?.allow_multiple_open ?? false;

  const toggle = (index: number) => {
    setOpenIndexes((current) => {
      const next = allowMultiple ? new Set(current) : new Set<number>();
      if (current.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  };

  return (
    <section className="px-5 py-16 sm:px-8 lg:py-20" {...previewAttributes}>
      <div className="mx-auto max-w-3xl">
        {data?.heading ? (
          <h2 className="mb-8 text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">{data.heading}</h2>
        ) : null}
        <div className="divide-y divide-slate-200 border border-slate-200">
          {items.map((item, index) => {
            const isOpen = openIndexes.has(index);
            return (
              <div key={`${item.title}-${index}`}>
                <button
                  type="button"
                  onClick={() => toggle(index)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-sm font-medium text-slate-950 hover:bg-slate-50"
                >
                  {item.title}
                  <ChevronDown className={`size-4 shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`} aria-hidden />
                </button>
                {isOpen && item.content ? (
                  <div className="px-5 pb-4 text-sm">
                    <RichText value={item.content} />
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
