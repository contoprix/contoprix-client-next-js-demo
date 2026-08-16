import type { Metadata } from "next";
import Link from "next/link";
import { createContoprixClient, getContoprixPage } from "@contoprix/next/server";
import type { ContoprixContentEntry } from "@contoprix/types";

import BlogPostList from "@/components/contoprix/BlogPostList";
import { ContoprixRenderer } from "@/contoprix/ContoprixRenderer";
import { isNotFoundError } from "@/lib/contoprix/errors";

export const metadata: Metadata = {
  title: "Contoprix Demo",
  description:
    "A Next.js reference app for the Contoprix SDK -- REST and GraphQL delivery examples, live visual editing, and forms.",
};

// Live delivery data -- a published page at "/", plus "Latest from the blog" below.
export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [cmsPage, posts] = await Promise.all([loadHomePage(), loadFeaturedPosts()]);

  return (
    <div className="bg-white">
      {cmsPage ? (
        // A published page at "/" -- e.g. a hero_banner + capabilities_section block --
        // renders through the normal custom-component/generic-renderer resolution, same as
        // any other delivery-rendered page. See src/contoprix/components.ts.
        <ContoprixRenderer page={cmsPage} />
      ) : (
        <section className="border-b border-slate-200 bg-slate-50 px-5 py-20 sm:px-8 lg:py-28">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-orange-600">
              @contoprix/react + @contoprix/next
            </p>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
              Contoprix SDK demo
            </h1>
            <p className="mx-auto mt-5 max-w-xl leading-7 text-slate-600">
              A worked example of consuming Contoprix from a Next.js app: two
              ways to fetch content -- REST and GraphQL -- plus visual editing,
              ISR/webhook revalidation, and a schema-driven form.
            </p>
            <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-slate-500">
              No page is published at <code>/</code> yet -- publish one with a{" "}
              <code>hero_banner</code> or <code>capabilities_section</code> block in the
              Contoprix admin and it renders here automatically.
            </p>
          </div>
        </section>
      )}

      <section className="px-5 py-16 sm:px-8 lg:py-20">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
            Delivery API examples
          </h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            <ExampleCard
              href="/examples/rest"
              eyebrow="@contoprix/client"
              title="REST"
              description="Fetch a page, list a content collection, and search -- all through ContoprixClient's typed REST methods, server-side."
            />
            <ExampleCard
              href="/examples/graphql"
              eyebrow="POST /graphql"
              title="GraphQL"
              description="Query the tenant's own generated GraphQL.NET schema directly with a delivery-key-authenticated fetch."
            />
          </div>
        </div>
      </section>

      {posts.length > 0 ? (
        <section className="border-t border-slate-200 px-5 py-16 sm:px-8 lg:py-20">
          <div className="mx-auto max-w-5xl">
            <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
              Latest from the blog
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
              Rendered by <code>BlogPostList</code> -- a registered custom component in{" "}
              <code>src/contoprix/components.ts</code>, invoked directly here with real{" "}
              <code>blog_post</code> entries fetched via <code>client.content.list()</code>.
            </p>
            <div className="mt-6">
              <BlogPostList contents={posts} />
            </div>
          </div>
        </section>
      ) : null}

      <section className="border-t border-slate-200 bg-slate-50 px-5 py-16 sm:px-8 lg:py-20">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
            More of the SDK
          </h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            <InfoCard
              title="Any published page"
              description="Visit any published slug (e.g. /about) to see it delivery-rendered. Registered custom components (src/contoprix/components.ts) render first; anything else falls back to the generic, schema-driven block renderer."
            />
            <InfoCard
              title="Contact form"
              description="/contact-us renders a schema-driven form, submitted through a same-origin API route so the delivery key never reaches the browser."
              href="/contact-us"
            />
          </div>
        </div>
      </section>

      <section className="px-5 py-16 sm:px-8 lg:py-20">
        <div className="mx-auto max-w-4xl border border-slate-200 bg-white p-8 sm:p-10">
          <h2 className="text-lg font-semibold text-slate-950">Configured for this environment</h2>
          <dl className="mt-4 grid gap-4 text-sm sm:grid-cols-2">
            <div>
              <dt className="font-medium text-slate-500">CONTOPRIX_BASE_URL</dt>
              <dd className="mt-1 text-slate-950">
                {process.env.CONTOPRIX_BASE_URL || "not set"}
              </dd>
            </div>
            <div>
              <dt className="font-medium text-slate-500">CONTOPRIX_DELIVERY_KEY</dt>
              <dd className="mt-1 text-slate-950">
                {process.env.CONTOPRIX_DELIVERY_KEY ? "configured" : "not set"}
              </dd>
            </div>
          </dl>
          <p className="mt-4 text-sm leading-6 text-slate-600">
            Set in <code>.env.local</code>. See this project&apos;s{" "}
            <code>README.md</code> for the full setup recipe, including
            pulling your schema with <code>npx contoprix pull</code>.
          </p>
        </div>
      </section>
    </div>
  );
}

async function loadHomePage() {
  return getContoprixPage({ slug: "/" }).catch((error) => {
    if (isNotFoundError(error)) return null;
    throw error;
  });
}

async function loadFeaturedPosts(): Promise<ContoprixContentEntry[]> {
  try {
    const client = createContoprixClient();
    const { items } = await client.content.list({ contentType: "blog_post", take: 12 });

    return items
      .slice()
      .sort((left, right) => {
        const leftFeatured = left.data.is_featured === true;
        const rightFeatured = right.data.is_featured === true;
        if (leftFeatured !== rightFeatured) return leftFeatured ? -1 : 1;

        const leftDate = typeof left.data.published_at === "string" ? Date.parse(left.data.published_at) : 0;
        const rightDate = typeof right.data.published_at === "string" ? Date.parse(right.data.published_at) : 0;
        return (rightDate || 0) - (leftDate || 0);
      })
      .slice(0, 3);
  } catch (error) {
    console.error("Failed to load blog_post entries for the home page.", error);
    return [];
  }
}

function ExampleCard({
  href,
  eyebrow,
  title,
  description,
}: {
  href: string;
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <Link
      href={href}
      className="group block border border-slate-200 bg-white p-6 transition-colors hover:border-orange-300"
    >
      <p className="text-xs font-semibold uppercase tracking-[0.15em] text-orange-600">
        {eyebrow}
      </p>
      <h3 className="mt-2 text-xl font-semibold text-slate-950">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
      <p className="mt-4 text-sm font-medium text-slate-950 group-hover:text-orange-600">
        View example →
      </p>
    </Link>
  );
}

function InfoCard({
  title,
  description,
  href,
}: {
  title: string;
  description: string;
  href?: string;
}) {
  const content = (
    <>
      <h3 className="text-base font-semibold text-slate-950">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
    </>
  );

  if (href) {
    return (
      <Link href={href} className="block border border-slate-200 bg-white p-6 hover:border-orange-300">
        {content}
      </Link>
    );
  }

  return <div className="border border-slate-200 bg-white p-6">{content}</div>;
}
