import type { Metadata } from "next";
import type {
  ContoprixContentEntry,
  ContoprixPage,
  ContoprixSearchResult,
} from "@contoprix/types";
import { createContoprixClient } from "@contoprix/next/server";

import { CodeBlock, JsonBlock } from "../CodeBlock";

// Live delivery data on every request -- this page exists to show the raw
// SDK calls and their responses, not to be a fast production route.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "REST API",
  description:
    "Calling the Contoprix delivery REST API directly through @contoprix/client, server-side.",
};

const CONTENT_TYPE = "blog_post";

export default async function RestExamplePage() {
  const client = createContoprixClient();

  const [homePage, blogPosts, searchResults] = await Promise.all([
    settle(client.pages.getBySlug("/")),
    settle(client.content.list({ contentType: CONTENT_TYPE, take: 3 })),
    settle(client.search.query("blog", 3)),
  ]);

  return (
    <div className="space-y-14">
      <header>
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-orange-600">
          @contoprix/client
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">
          REST delivery API
        </h1>
        <p className="mt-4 max-w-2xl leading-7 text-slate-600">
          Every call below runs server-side in this page&apos;s Server
          Component, through the same <code>ContoprixClient</code> used
          everywhere else in this app. The delivery key never reaches the
          browser -- open devtools and confirm there&apos;s no trace of it in
          the page source or network requests.
        </p>
      </header>

      <Section
        title="1. Get a client"
        description="createContoprixClient() (from @contoprix/next/server) resolves CONTOPRIX_BASE_URL / CONTOPRIX_DELIVERY_KEY from the environment for you -- no config object required in the common case."
      >
        <CodeBlock
          label="src/app/examples/rest/page.tsx"
          code={`import { createContoprixClient } from "@contoprix/next/server";\n\nconst client = createContoprixClient();`}
        />
      </Section>

      <Section
        title="2. Fetch a page by slug"
        description={`client.pages.getBySlug("/") -- the same call getContoprixPage() wraps for the delivery routes elsewhere in this app.`}
      >
        <CodeBlock code={`const page = await client.pages.getBySlug("/");`} />
        <Result result={homePage} render={(page) => <PageSummary page={page} />} />
      </Section>

      <Section
        title="3. List content entries"
        description={`client.content.list({ contentType, take }) -- paginated, schema-driven content, independent of any page. Listing the "${CONTENT_TYPE}" collection here.`}
      >
        <CodeBlock
          code={`const { items, pagination } = await client.content.list({\n  contentType: "${CONTENT_TYPE}",\n  take: 3,\n});`}
        />
        <Result
          result={blogPosts}
          render={(response) => <ContentList items={response.items} />}
        />
      </Section>

      <Section
        title="4. Search"
        description="client.search.query(text, take) -- full-text search across pages and content."
      >
        <CodeBlock code={`const results = await client.search.query("blog", 3);`} />
        <Result result={searchResults} render={(results) => <SearchList results={results} />} />
      </Section>
    </div>
  );
}

function Section({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-slate-950">{title}</h2>
        <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-600">{description}</p>
      </div>
      <div className="space-y-3">{children}</div>
    </section>
  );
}

type Settled<T> = { status: "ok"; value: T } | { status: "error"; message: string };

async function settle<T>(promise: Promise<T>): Promise<Settled<T>> {
  try {
    return { status: "ok", value: await promise };
  } catch (error) {
    return {
      status: "error",
      message: error instanceof Error ? error.message : "Request failed.",
    };
  }
}

function Result<T>({
  result,
  render,
}: {
  result: Settled<T>;
  render: (value: T) => React.ReactNode;
}) {
  if (result.status === "error") {
    return (
      <p className="border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
        {result.message}
      </p>
    );
  }

  return (
    <>
      {render(result.value)}
      <JsonBlock value={result.value} />
    </>
  );
}

function PageSummary({ page }: { page: ContoprixPage }) {
  return (
    <p className="text-sm text-slate-600">
      Resolved <strong className="text-slate-950">{page.name}</strong> ({page.blocks.length}{" "}
      block{page.blocks.length === 1 ? "" : "s"}).
    </p>
  );
}

function ContentList({ items }: { items: ContoprixContentEntry[] }) {
  if (items.length === 0) {
    return <p className="text-sm text-slate-500">No published entries yet.</p>;
  }

  return (
    <ul className="divide-y divide-slate-200 border border-slate-200 bg-white">
      {items.map((item) => (
        <li key={item.id} className="px-4 py-3">
          <p className="text-sm font-medium text-slate-950">
            {String(item.data.title ?? item.slug ?? item.id)}
          </p>
          {item.slug ? <p className="text-xs text-slate-500">/{item.slug}</p> : null}
        </li>
      ))}
    </ul>
  );
}

function SearchList({ results }: { results: ContoprixSearchResult[] }) {
  if (results.length === 0) {
    return <p className="text-sm text-slate-500">No matches.</p>;
  }

  return (
    <ul className="divide-y divide-slate-200 border border-slate-200 bg-white">
      {results.map((result) => (
        <li key={`${result.type}-${result.id}`} className="px-4 py-3">
          <p className="text-sm font-medium text-slate-950">{result.title}</p>
          <p className="text-xs text-slate-500">
            {result.type}
            {result.slug ? ` · /${result.slug}` : ""}
          </p>
        </li>
      ))}
    </ul>
  );
}
