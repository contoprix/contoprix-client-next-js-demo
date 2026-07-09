"use client";

import { ContoprixComponentProps } from "@contoprix/react";
import Image from "next/image";

function getText(source: Record<string, unknown> | undefined, key: string) {
  const value = source?.[key];

  return typeof value === "string" && value.trim().length > 0
    ? value
    : undefined;
}

export default function ProductCard({
  settings,
}: ContoprixComponentProps) {
  const title = getText(settings, "title") ?? "Product";
  const description = getText(settings, "desc") ?? "Explore this product.";
  const image = getText(settings, "image");
  const productUrl = getText(settings, "producturl") ?? "#";

  return (
    <section className="bg-white px-6 py-14 text-zinc-950">
      <div className="mx-auto max-w-7xl">
        <article className="grid overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-sm md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
          {image ? (
            <div className="relative min-h-64 bg-zinc-100">
              <Image
                src={image}
                alt={title}
                fill
                sizes="(min-width: 768px) 45vw, 100vw"
                className="object-cover"
                unoptimized
              />
            </div>
          ) : (
            <div className="flex min-h-64 items-center justify-center bg-zinc-100 text-sm font-medium text-zinc-500">
              No image
            </div>
          )}

          <div className="flex flex-col justify-center p-6 sm:p-8">
            <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700">
              Featured product
            </p>

            <h2 className="mt-3 text-3xl font-bold leading-tight">
              {title}
            </h2>

            <p className="mt-4 max-w-2xl text-base leading-7 text-zinc-600">
              {description}
            </p>

            <a
              href={productUrl}
              className="mt-7 inline-flex w-fit rounded-md bg-zinc-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-zinc-800"
            >
              View product
            </a>
          </div>
        </article>
      </div>
    </section>
  );
}
