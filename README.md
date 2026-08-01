# Contoprix Next.js demo

This application renders published pages from the Contoprix delivery API.

## Configuration

Copy `.env.example` to `.env.local` and configure:

- `CONTOPRIX_BASE_URL`: CMS API origin.
- `CONTOPRIX_DELIVERY_KEY`: delivery API credential for this website.
- `CONTOPRIX_DEMO_FORM_CODE`: published form code rendered at `/contact-us` (defaults to `contact-us`).
- `CONTOPRIX_WEBHOOK_SECRET`: long random secret shared with the CMS webhook.

Do not expose these values with a `NEXT_PUBLIC_` prefix and do not commit real
credentials.

## Delivery form demo

The `/contact-us` route loads the published form schema through
`client.forms.get()` on the server. The interactive form posts to a same-origin
route handler, which submits through `client.forms.submit()`. This keeps the
delivery key out of browser JavaScript while preserving CMS validation and the
form-version submission token.

Publish a form in Contoprix with the code configured by
`CONTOPRIX_DEMO_FORM_CODE` before opening the page.

## Content refresh

Production pages use two refresh mechanisms:

1. A signed CMS webhook invalidates the affected page immediately after a
   `page.published` or `content.published` event.
2. Incremental Static Regeneration refreshes a page after at most 60 seconds if
   a webhook is missed or delayed.

Configure the CMS webhook destination as:

```text
https://your-site.example.com/api/contoprix/webhook
```

Use the same secret as `CONTOPRIX_WEBHOOK_SECRET`. The CMS must send the HMAC
signature in `X-Contoprix-Signature`; unsigned requests are rejected.

Saving a draft does not change the public website. Publish the page or content
entry to update the delivery API and trigger revalidation.

## Development

```bash
npm install
npm run dev
```

Before deployment:

```bash
npm run lint
npm run build
```
