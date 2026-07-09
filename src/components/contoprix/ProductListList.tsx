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

function getMediaUrl(value: unknown) {
  if (typeof value === "string" && value.trim().length > 0) {
    return value;
  }

  if (!isRecord(value)) return undefined;

  return getText(value, "Url") ?? getText(value, "url");
}

function getMediaAlt(value: unknown) {
  if (!isRecord(value)) return undefined;

  return (
    getText(value, "AltText") ??
    getText(value, "altText") ??
    getText(value, "Caption") ??
    getText(value, "caption")
  );
}

function normalizeHref(value: string | undefined) {
  if (!value) return "#";

  return value.startsWith("/") || value.startsWith("http") ? value : "#";
}

function getProductData(entry: Record<string, unknown>) {
  const data = isRecord(entry.data) ? entry.data : {};
  const productCards = data.productcards ?? data.productCards ?? data.product;

  return isRecord(productCards) ? productCards : data;
}

export default function ProductListList({
  contents,
}: ContoprixComponentProps) {
  const entries = Array.isArray(contents)
    ? contents.filter(isRecord)
    : [];

  return (
    <section className="bg-zinc-50 px-6 py-16 text-zinc-950">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700">
              Products
            </p>

            <h2 className="mt-3 text-3xl font-bold leading-tight sm:text-4xl">
              Product list
            </h2>
          </div>

          <p className="max-w-xl text-sm leading-6 text-zinc-600">
            Items rendered from the selected Contoprix product list block.
          </p>
        </div>

        {entries.length > 0 ? (
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {entries.map((entry, index) => {
              const product = getProductData(entry);
              const title = getText(product, "title") ?? `Product ${index + 1}`;
              const description =
                getText(product, "desc") ??
                getText(product, "description") ??
                "Explore this product.";
              const image = product.image;
              const imageUrl = getMediaUrl(image);
              const button = isRecord(product.product_button)
                ? product.product_button
                : isRecord(product.productButton)
                  ? product.productButton
                  : undefined;
              const buttonLabel =
                getText(button, "label") ??
                getText(button, "lable") ??
                "View product";
              const href = normalizeHref(
                getText(button, "url") ?? getText(product, "producturl"),
              );

              return (
                <article
                  key={getText(entry, "id") ?? `${title}-${index}`}
                  className="overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-sm"
                >
                  {imageUrl ? (
                    <a href={href} className="relative block min-h-60 bg-zinc-100">
                      <Image
                        src={imageUrl}
                        alt={getMediaAlt(image) ?? title}
                        fill
                        sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                        className="object-cover"
                      />
                    </a>
                  ) : (
                    <div className="flex min-h-60 items-center justify-center bg-zinc-100 text-sm font-medium text-zinc-500">
                      No image
                    </div>
                  )}

                  <div className="p-5">
                    <h3 className="text-xl font-bold leading-tight">
                      {title}
                    </h3>

                    <p className="mt-3 line-clamp-3 text-sm leading-6 text-zinc-600">
                      {description}
                    </p>

                    <a
                      href={href}
                      className="mt-5 inline-flex rounded-md bg-zinc-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-zinc-800"
                    >
                      {buttonLabel}
                    </a>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="mt-8 rounded-lg border border-dashed border-zinc-300 bg-white p-6 text-sm font-medium text-zinc-500">
            No products found.
          </div>
        )}
      </div>
    </section>
  );
}
