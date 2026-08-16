import type { Metadata } from "next";

import { contoprixGraphQL } from "@/lib/contoprix/graphql.server";
import { CodeBlock, JsonBlock } from "../CodeBlock";

// Live delivery data on every request -- same reasoning as the REST example.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "GraphQL API",
  description:
    "Querying the tenant's GraphQL.NET endpoint (POST /graphql) directly, authenticated with a delivery key.",
};

const PAGE_QUERY = /* GraphQL */ `
  query HomePage($path: String!) {
    page(path: $path) {
      id
      name
      slug
      locale
      blocks {
        __typename
      }
    }
  }
`;

const BLOG_POSTS_QUERY = /* GraphQL */ `
  query BlogPosts($first: Int) {
    blogPost(first: $first) {
      totalCount
      nodes {
        id
        title
        slug
        excerpt
        author
        category
        publishedAt
        readingMinutes
        isFeatured
        featuredImage {
          url
          altText
          width
          height
        }
      }
    }
  }
`;

interface PageQueryResult {
  page: { id: string; name: string; slug: string; locale: string; blocks: { __typename: string }[] } | null;
}

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt?: string | null;
  author?: string | null;
  category?: string | null;
  publishedAt?: string | null;
  readingMinutes?: number | null;
  isFeatured?: boolean | null;
  featuredImage?: { url: string; altText?: string | null; width?: number; height?: number } | null;
}

interface BlogPostsQueryResult {
  blogPost: { totalCount: number; nodes: BlogPost[] };
}

export default async function GraphQLExamplePage() {
  const [pageResult, blogPostsResult] = await Promise.all([
    contoprixGraphQL<PageQueryResult>(PAGE_QUERY, { path: "/" }),
    contoprixGraphQL<BlogPostsQueryResult>(BLOG_POSTS_QUERY, { first: 3 }),
  ]);

  return (
    <div className="space-y-14">
      <header>
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-orange-600">
          POST /graphql
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">
          GraphQL delivery API
        </h1>
        <p className="mt-4 max-w-2xl leading-7 text-slate-600">
          There&apos;s no GraphQL client bundled in the SDK -- the tenant&apos;s
          GraphQL.NET schema is generated from your content model, so its
          shape is different for every project. Querying it is a plain,
          delivery-key-authenticated <code>fetch</code> POST; see{" "}
          <code>src/lib/contoprix/graphql.server.ts</code> for the ~25-line
          helper both queries on this page use.
        </p>
      </header>

      <Section
        title="1. The query helper"
        description="contoprixGraphQL(query, variables) posts to CONTOPRIX_BASE_URL + /graphql with the x-contoprix-delivery-key header, server-side only."
      >
        <CodeBlock
          label="src/lib/contoprix/graphql.server.ts"
          code={`export async function contoprixGraphQL<T>(query: string, variables?: object) {\n  const response = await fetch(new URL("/graphql", baseUrl), {\n    method: "POST",\n    headers: {\n      "content-type": "application/json",\n      "x-contoprix-delivery-key": deliveryKey,\n    },\n    body: JSON.stringify({ query, variables }),\n  });\n  return response.json();\n}`}
        />
      </Section>

      <Section
        title="2. Query a page by path"
        description="A nullable field, not an error -- this tenant has no page published at '/' yet, so the query below correctly resolves page: null rather than throwing."
      >
        <CodeBlock label="Query" code={PAGE_QUERY.trim()} />
        {pageResult.errors?.length ? (
          <ErrorList errors={pageResult.errors} />
        ) : pageResult.data?.page ? (
          <p className="text-sm text-slate-600">
            Resolved <strong className="text-slate-950">{pageResult.data.page.name}</strong> (
            {pageResult.data.page.blocks.length} block
            {pageResult.data.page.blocks.length === 1 ? "" : "s"}).
          </p>
        ) : (
          <p className="border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600">
            No page published at <code>/</code> for this website yet -- <code>page</code>{" "}
            resolved to <code>null</code>, exactly as the schema says it can.
          </p>
        )}
        <JsonBlock value={pageResult} />
      </Section>

      <Section
        title="3. Query a content collection"
        description={`blogPost(first) -- a Relay-style connection generated from the "blog_post" content type, same underlying data as the REST content.list() call on the REST tab.`}
      >
        <CodeBlock label="Query" code={BLOG_POSTS_QUERY.trim()} />
        {blogPostsResult.errors?.length ? (
          <ErrorList errors={blogPostsResult.errors} />
        ) : (
          <BlogPostList result={blogPostsResult.data?.blogPost} />
        )}
        <JsonBlock value={blogPostsResult} />
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

function ErrorList({ errors }: { errors: { message: string }[] }) {
  return (
    <ul className="space-y-2 border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
      {errors.map((error, index) => (
        <li key={index}>{error.message}</li>
      ))}
    </ul>
  );
}

function BlogPostList({ result }: { result?: { totalCount: number; nodes: BlogPost[] } }) {
  if (!result || result.nodes.length === 0) {
    return <p className="text-sm text-slate-500">No published entries yet.</p>;
  }

  return (
    <ul className="divide-y divide-slate-200 border border-slate-200 bg-white">
      {result.nodes.map((post) => (
        <li key={post.id} className="px-4 py-3">
          <p className="text-sm font-medium text-slate-950">{post.title}</p>
          <p className="text-xs text-slate-500">
            /{post.slug}
            {post.author ? ` · ${post.author}` : ""}
            {post.readingMinutes ? ` · ${post.readingMinutes} min read` : ""}
          </p>
        </li>
      ))}
    </ul>
  );
}
