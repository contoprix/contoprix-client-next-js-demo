import "server-only";

/**
 * Thin client for the tenant's own GraphQL.NET endpoint (`POST /graphql`).
 *
 * There's no GraphQL query helper in `@contoprix/client` (its `getGraphQLSchema()`
 * only exports introspection for `contoprix graphql` codegen) -- executing queries
 * is just a same-origin-safe POST, authenticated exactly like the REST delivery
 * routes: `x-contoprix-delivery-key`. Keep this on the server so the key never
 * reaches the browser, same reasoning as `forms.server.ts`.
 */

export interface ContoprixGraphQLError {
  message: string;
  path?: (string | number)[];
  extensions?: Record<string, unknown>;
}

export interface ContoprixGraphQLResult<T> {
  data: T | null;
  errors?: ContoprixGraphQLError[];
}

export async function contoprixGraphQL<T = unknown>(
  query: string,
  variables?: Record<string, unknown>,
): Promise<ContoprixGraphQLResult<T>> {
  const baseUrl = process.env.CONTOPRIX_BASE_URL?.trim();
  const deliveryKey = process.env.CONTOPRIX_DELIVERY_KEY?.trim();

  if (!baseUrl || !deliveryKey) {
    throw new Error(
      "CONTOPRIX_BASE_URL and CONTOPRIX_DELIVERY_KEY are required to query the Contoprix GraphQL endpoint.",
    );
  }

  const response = await fetch(new URL("/graphql", baseUrl), {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-contoprix-delivery-key": deliveryKey,
    },
    body: JSON.stringify({ query, variables }),
    cache: "no-store",
  });

  let payload: ContoprixGraphQLResult<T>;

  try {
    payload = await response.json();
  } catch {
    throw new Error(
      `Contoprix GraphQL request failed with status ${response.status} and a non-JSON response.`,
    );
  }

  if (!response.ok && !payload.errors?.length) {
    throw new Error(`Contoprix GraphQL request failed with status ${response.status}.`);
  }

  return payload;
}
