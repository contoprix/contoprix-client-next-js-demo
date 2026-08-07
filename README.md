# Contoprix Demo (Next.js)

A reference Next.js / React application showing how to build a site on top of Contoprix using the **`@contoprix/react`** and **`@contoprix/next`** SDKs. Read this as a worked example of everything a developer needs to do to consume the SDK in their own project, from installation through rendering to live visual editing, ISR/webhook revalidation, and forms.

## What this app demonstrates

- **Delivery rendering** — fetching a published page by slug and rendering its blocks server-side (React Server Components).
- **Custom components alongside the generic renderer** — [`src/contoprix/components.ts`](./src/contoprix/components.ts) registers hand-built React components for several component types (`header`, `footer`, `hero_banner`, `blog_post`, …). Any component type **not** in that registry — or any form/content-entry block — falls back to the SDK's schema-driven `GenericBlockRenderer` or the `MissingComponent` placeholder. Both paths are live on this site at once, so you can compare them directly.
- **Live visual editing** — a `/preview/page/[pageId]` route the Contoprix admin embeds in an iframe when an editor opens the visual builder: click-to-select, the block toolbar (drag/move/duplicate/delete), the "Add item" insertion flow, and live refresh on every edit, all driven by `@contoprix/react`'s `VisualEditingBridge` over `postMessage`.
- **ISR + webhook revalidation** — published content updates the live site via a signed CMS webhook, with time-based ISR as a safety net.
- **A delivery-rendered form** (`/contact-us`) — the generic, schema-driven form-rendering pattern, served through a same-origin API route so the delivery key never reaches the browser.

---

## Using `@contoprix/react` + `@contoprix/next` in your own project

Everything below is the general recipe; this app is a working implementation of it you can read alongside the steps.

### 1. Install the SDK

```bash
npm install @contoprix/react @contoprix/next @contoprix/client @contoprix/types
```

- **`@contoprix/client`** — the framework-agnostic API client (auth, pages, content, forms, media, search, schema).
- **`@contoprix/types`** — shared TypeScript types used across every Contoprix SDK package.
- **`@contoprix/react`** — React rendering primitives (`PageRenderer`, `BlockRenderer`, `GenericBlockRenderer`, `VisualEditingBridge`, `GenericFormRenderer`, …) built on top of `@contoprix/client`.
- **`@contoprix/next`** — Next.js-specific glue: server-only data helpers (`getContoprixPage`, `createContoprixClient`), webhook handling, ISR/static-params helpers.

If you'll use the CLI to pull your schema and generate typed helpers (recommended — see step 5), also install it:

```bash
npm install -D @contoprix/cli
```

Peer dependencies: `react@^19`, `react-dom@^19`, `next@^15` (or later).

### 2. Get your credentials

In the Contoprix admin, go to **Settings → API Clients** (or your website's own settings) and create a **delivery key** scoped to the website you want to render. You'll also need the base URL of your Contoprix CMS API instance.

Set them as environment variables (never with a `NEXT_PUBLIC_` prefix — they must stay server-side):

```bash
CONTOPRIX_BASE_URL=https://api.yourtenant.contoprix.com
CONTOPRIX_DELIVERY_KEY=<your delivery key>
```

### 3. Fetch and render a page

`@contoprix/next/server` wraps client construction and page fetching in one call:

```tsx
// src/app/[...slug]/page.tsx
import { notFound } from "next/navigation";
import { getContoprixPage } from "@contoprix/next/server";
import { ContoprixRenderer } from "@/contoprix/ContoprixRenderer";

export default async function CmsPage({ params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await params;
  const page = await getContoprixPage({ slug: `/${slug.join("/")}` });

  if (!page) notFound();

  return <ContoprixRenderer page={page} />;
}
```

`ContoprixRenderer` is a thin wrapper around `@contoprix/react`'s `BlockRenderer`/`PageRenderer`, passing your component registry and pulled schema (see [`src/contoprix/ContoprixRenderer.tsx`](./src/contoprix/ContoprixRenderer.tsx)):

```tsx
// src/contoprix/ContoprixRenderer.tsx
"use client";
import { PageRenderer } from "@contoprix/react/client";
import components from "./components";
import { contoprixSchemas } from "./schema";

export function ContoprixRenderer({ page }: { page: ContoprixPage }) {
  return <PageRenderer page={page} components={components} schemas={contoprixSchemas} />;
}
```

### 4. Register custom components

`components` is a `ComponentRegistry` — a plain object mapping component codes to your own React components:

```ts
// src/contoprix/components.ts
import HeroBannerDetail from "@/components/contoprix/HeroBannerDetail";

export const components = {
  "hero_banner-detail": HeroBannerDetail
  // one entry per component code you want custom UI for
};

export default components;
```

Any code **not** in this registry — and any form or content-entry block — falls back to the schema-driven generic renderer or the placeholder. See [How rendering works](#how-rendering-works) below for the exact resolution order.

### 5. Pull your schema (enables the generic renderer)

`schemas` above comes from your content model, pulled from the CMS via the CLI. Add a `contoprix.config.json`:

```json
{
  "baseUrl": "https://api.yourtenant.contoprix.com",
  "languageCode": "en",
  "componentsDir": "src/components/contoprix",
  "outputDir": "src/contoprix",
  "schemaDir": ".contoprix/schema",
  "generatedTypesFile": "src/contoprix/generated.ts"
}
```

Then, after logging in (`npx contoprix login`) once per machine:

```bash
npx contoprix pull       # writes .contoprix/schema/schema.json
npx contoprix generate   # optional: typed field helpers in src/contoprix/generated.ts
```

Turn the pulled schema into the registry `PageRenderer` expects:

```ts
// src/contoprix/schema.ts
import { buildSchemaRegistry } from "@contoprix/react";
import type { SdkSchema } from "@contoprix/client";
import pulledSchema from "../../.contoprix/schema/schema.json";

export const contoprixSchemas = buildSchemaRegistry(pulledSchema as SdkSchema);
```

Re-run `contoprix pull` whenever your content model changes.

### 6. Add live visual editing (optional but recommended)

To let editors use the CMS admin's visual builder against your site, add a preview route that renders the current **draft** and turns on `VisualEditingBridge`:

```tsx
// src/app/preview/page/[pageId]/page.tsx
import { createContoprixClient } from "@contoprix/next/server";
import { ContoprixPreviewRenderer } from "@/contoprix/ContoprixPreviewRenderer";

export default async function PreviewPage({ params }: { params: Promise<{ pageId: string }> }) {
  const { pageId } = await params;
  const page = await createContoprixClient().pages.getPreview(pageId);

  return <ContoprixPreviewRenderer pageId={pageId} initialPage={page} />;
}
```

Then in **Contoprix Admin → Websites → Edit Website**, set the **Preview URL** to `https://your-site.example.com/preview/page/[pageId]` — the admin substitutes the page id and embeds this route in an iframe. See [`src/contoprix/ContoprixPreviewRenderer.tsx`](./src/contoprix/ContoprixPreviewRenderer.tsx) for the full version: resolving `adminOrigin` dynamically (works in both dev and production), refetching the page on every admin edit, and refreshing schema live so brand-new component types render before the next `contoprix pull`.

### 7. Keep the delivery site in sync (ISR + webhook)

Delivery pages here use `export const revalidate = 60` (ISR) as a safety net, plus a signed webhook for near-instant invalidation:

```ts
// src/app/api/contoprix/webhook/route.ts
import { handleContoprixWebhook } from "@contoprix/next/server";
import { revalidatePath } from "next/cache";

export async function POST(request: Request) {
  return handleContoprixWebhook(request, {
    secret: process.env.CONTOPRIX_WEBHOOK_SECRET!,
    onPagePublished(event) {
      revalidatePath(`/${event.data.slug ?? ""}`);
    }
  });
}
```

Configure this route (`https://your-site.example.com/api/contoprix/webhook`) as the CMS's webhook destination, using the same secret as `CONTOPRIX_WEBHOOK_SECRET`. The CMS signs every request with `X-Contoprix-Signature`; unsigned requests are rejected. **Saving a draft never changes the public site** — only publishing does.

### 8. Forms (optional)

`@contoprix/react` exports `GenericFormRenderer`, a schema-driven fallback for `"form"` blocks (opt-in, not part of the default resolution — see below). It needs a same-origin route to fetch the form schema and proxy submissions, keeping the delivery key server-side:

```ts
// src/app/api/forms/[code]/route.ts
export async function GET(_req: Request, { params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  return Response.json(await client.forms.get(code));
}

export async function POST(req: Request, { params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const body = await req.json(); // { submissionToken, data, honeypot? }
  return Response.json(await client.forms.submit(code, body), { status: 202 });
}
```

This app's `/contact-us` page shows a fully custom, hand-styled form instead ([`ContactForm.tsx`](./src/app/contact-us/ContactForm.tsx)) built the same way — fetch the schema server-side, submit through a proxy route. Publish a form with the code set in `CONTOPRIX_DEMO_FORM_CODE` (defaults to `contact-us`) before opening the page.

---

## How rendering works

`PageRenderer`/`BlockRenderer` resolve each block in this order:

1. **Registered override** — a component in your `ComponentRegistry` for that code.
2. **Generic renderer** — only for `"component"`-kind blocks whose schema is known (from `schemas`) and marked `renderableAsBlock`. Renders every visible field using a built-in per-field-type renderer (text, richtext/markdown with sanitization, media, choice lists, repeaters, nested components, dynamic zones — recursion-guarded).
3. **Placeholder (`MissingComponent`)** — everything else: forms, content entries (single or list), and any component with no known schema. Shows a type badge, name/code, and a "Show JSON" toggle to inspect the raw block data. This is intentional, not a gap — forms and content entries are their own subsystems with their own data shapes, and generically generating UI for either is out of scope for this renderer by design. (`GenericFormRenderer`, above, is an explicit opt-in override for form blocks, not part of this default resolution.)

## Project structure

```
contoprix-demo-next/
├── .env.local                        # CONTOPRIX_BASE_URL / CONTOPRIX_DELIVERY_KEY / webhook secret / admin origins
├── contoprix.config.json             # contoprix pull/generate config (schema output paths)
├── .contoprix/schema/schema.json     # pulled schema, regenerated by `contoprix pull`
├── src/app/
│   ├── layout.tsx                    # root layout, wraps children in LayoutChrome
│   ├── page.tsx                      # home page (slug "/")
│   ├── [...slug]/page.tsx            # catch-all delivery route
│   ├── preview/page/[pageId]/page.tsx# visual-editing preview route (embedded by the admin iframe)
│   ├── contact-us/                   # hand-built form demo
│   └── api/
│       ├── contoprix/
│       │   ├── preview/pages/[pageId]/route.ts # draft/preview page by id
│       │   ├── preview/schema/route.ts         # live preview-schema (step 6)
│       │   └── webhook/route.ts                # signed publish webhook -> revalidatePath
│       └── forms/[code]/route.ts     # same-origin form fetch/submit proxy (step 8)
├── src/contoprix/
│   ├── components.ts                 # ComponentRegistry — custom overrides for some types
│   ├── schema.ts                     # buildSchemaRegistry() from the pulled schema.json
│   ├── generated.ts                  # `contoprix generate` output (typed field helpers)
│   ├── ContoprixRenderer.tsx         # thin wrapper around @contoprix/react's PageRenderer/BlockRenderer
│   ├── ContoprixPreviewRenderer.tsx  # preview-route renderer: live refresh + VisualEditingBridge wiring
│   └── LayoutChrome.tsx              # fetches __header/__footer pages, wraps every route
└── src/components/contoprix/         # custom, hand-built React components registered in components.ts
```

## Running this demo

```bash
cp .env.example .env.local   # fill in CONTOPRIX_BASE_URL, CONTOPRIX_DELIVERY_KEY, etc.
npm install
npx contoprix pull           # requires npx contoprix login first
npm run dev
```

Pages are served at their CMS slug, e.g. `/` for the home page.

## Available scripts

| Script | Description |
| --- | --- |
| `npm run dev` | Start the Next.js dev server. |
| `npm run build` | Production build. |
| `npm run start` | Run the production build. |
| `npm run lint` | Lint the project. |

## Troubleshooting

- **`fetch failed` from `contoprix pull`/`contoprix generate`** — usually TLS: a local CMS API using a self-signed dev certificate needs `NODE_TLS_REJECT_UNAUTHORIZED=0` set in the shell running the CLI. Confirm the backend is actually running and reachable at `CONTOPRIX_BASE_URL`.
- **A page 404s / "Page content not found"** — the delivery API only serves *published* content. Either publish the page in the CMS admin, or view it through `/preview/page/[pageId]` instead, which shows the current draft.
- **Nothing happens when clicking a block in the admin's preview iframe** — check the website's Preview URL setting actually points at this app, and that `NEXT_PUBLIC_CONTOPRIX_ADMIN_ORIGINS`/`CONTOPRIX_ADMIN_ORIGINS` include the admin's actual origin.
- **A brand-new component type renders as the placeholder, not custom UI** — either register a component for its code in `components.ts`, or re-run `contoprix pull` to refresh the schema the generic renderer uses (the live preview route also self-refreshes this, so it should already work there without a re-pull).
- **Webhook requests are rejected** — confirm `CONTOPRIX_WEBHOOK_SECRET` matches what's configured in the CMS, and that the CMS is sending `X-Contoprix-Signature`.
- **The contact form 500s** — publish a form in Contoprix with the code set in `CONTOPRIX_DEMO_FORM_CODE` (default `contact-us`); the page falls back to a "temporarily unavailable" message if it can't load one.
