import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Contoprix Demo",
  description:
    "A Next.js reference app for the Contoprix SDK -- REST and GraphQL delivery examples, live visual editing, and forms.",
};

export default function HomePage() {
  return (
    <div className="bg-white">
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
        </div>
      </section>

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

      <section className="border-t border-slate-200 bg-slate-50 px-5 py-16 sm:px-8 lg:py-20">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
            More of the SDK
          </h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            <InfoCard
              title="Any published page"
              description="Visit any published slug (e.g. /about) to see it delivery-rendered through the generic, schema-driven block renderer -- this demo currently ships with no custom component overrides, so every block resolves through GenericBlockRenderer."
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
