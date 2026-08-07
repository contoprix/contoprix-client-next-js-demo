import { NextResponse } from "next/server";

import { getFormsClient } from "@/lib/contoprix/forms.server";

type RouteContext = {
  params: Promise<{ code: string }>;
};

// Schema fetch for the generic form renderer (`@contoprix/react`'s
// `GenericFormRenderer`, wired in by `BlockRenderer` for "form" blocks with
// no registered override). Server-side only so the delivery key never
// reaches the browser; the response includes a fresh submissionToken.
export async function GET(_request: Request, context: RouteContext) {
  const { code } = await context.params;

  try {
    const form = await getFormsClient().forms.get(code);
    return NextResponse.json(form, {
      status: 200,
      headers: { "cache-control": "no-store" },
    });
  } catch (error) {
    console.error(`Contoprix form "${code}" could not be loaded.`, error);
    return NextResponse.json(
      { message: `Form "${code}" was not found.` },
      { status: 404 },
    );
  }
}

export async function POST(request: Request, context: RouteContext) {
  const { code } = await context.params;

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { message: "The submitted form data is invalid." },
      { status: 400 },
    );
  }

  if (!isSubmissionRequest(body)) {
    return NextResponse.json(
      { message: "The submission token and form data are required." },
      { status: 400 },
    );
  }

  try {
    const result = await getFormsClient().forms.submit(code, body);
    return NextResponse.json(result, { status: 202 });
  } catch (error) {
    console.error(`Contoprix form "${code}" could not be submitted.`, error);

    return NextResponse.json(
      {
        message:
          "We could not send your message. Please review the form and try again.",
      },
      { status: 502 },
    );
  }
}

function isSubmissionRequest(
  value: unknown,
): value is {
  submissionToken: string;
  data: Record<string, unknown>;
  honeypot?: string;
} {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return false;
  }

  const request = value as Record<string, unknown>;
  const data = request.data;

  return (
    typeof request.submissionToken === "string" &&
    request.submissionToken.trim().length > 0 &&
    Boolean(data) &&
    typeof data === "object" &&
    !Array.isArray(data) &&
    (request.honeypot === undefined || typeof request.honeypot === "string")
  );
}
