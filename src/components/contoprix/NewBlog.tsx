"use client";

import { ContoprixComponentProps } from "@contoprix/react";
import Image from "next/image";

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function getText(source: Record<string, unknown> | undefined, key: string) {
  const value = source?.[key];

  return typeof value === "string" && value.trim().length > 0
    ? value
    : undefined;
}

export default function NewBlog({
  content,
}: ContoprixComponentProps) {
  const data = isRecord(content) && isRecord(content.data)
    ? content.data
    : {};

  const button = isRecord(data.button) ? data.button : undefined;
  const product = isRecord(data.product) ? data.product : undefined;

  const title = getText(data, "test") ?? "Blog";
  const buttonUrl = getText(button, "url") ?? "#";
  const buttonLabel =
    getText(button, "label") ?? getText(button, "lable") ?? "Read more";

  const productTitle = getText(product, "title") ?? "Featured story";
  const productDescription =
    getText(product, "desc") ?? "Discover the latest update from our blog.";
  const productImage = getText(product, "image");
  const productUrl = getText(product, "producturl") ?? buttonUrl;

  return (
    <section className="bg-stone-50 px-6 py-16 text-zinc-950">
      <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:items-center">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700">
            New blog
          </p>

          <h2 className="mt-3 max-w-xl text-4xl font-bold leading-tight sm:text-5xl">
            {title}
          </h2>

          <p className="mt-5 max-w-xl text-base leading-7 text-zinc-600">
            {productDescription}
          </p>

          <a
            href={buttonUrl}
            className="mt-8 inline-flex w-fit rounded-md bg-emerald-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800"
          >
            {buttonLabel}
          </a>
        </div>

        <article className="overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-sm">
          {productImage ? (
            <a
              href={productUrl}
              className="relative block min-h-72 bg-zinc-100 sm:min-h-96"
            >
              <Image
                src={productImage}
                alt={productTitle}
                fill
                sizes="(min-width: 1024px) 52vw, 100vw"
                className="object-cover"
              />
            </a>
          ) : (
            <div className="flex min-h-72 items-center justify-center bg-zinc-100 text-sm font-medium text-zinc-500 sm:min-h-96">
              No image
            </div>
          )}

          <div className="p-6 sm:p-8">
            <h3 className="text-2xl font-bold leading-tight">
              {productTitle}
            </h3>

            <p className="mt-4 line-clamp-4 text-base leading-7 text-zinc-600">
              {productDescription}
            </p>

            <a
              href={productUrl}
              className="mt-6 inline-flex text-sm font-semibold text-emerald-700 hover:text-emerald-800"
            >
              Open blog
            </a>
          </div>
        </article>
      </div>
    </section>
  );
}
