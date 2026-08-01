import "server-only";

import { ContoprixClient } from "@contoprix/client";

let client: ContoprixClient | undefined;

export function getFormsClient(): ContoprixClient {
  if (client) {
    return client;
  }

  const baseUrl = process.env.CONTOPRIX_BASE_URL?.trim();
  const deliveryKey = process.env.CONTOPRIX_DELIVERY_KEY?.trim();

  if (!baseUrl || !deliveryKey) {
    throw new Error(
      "CONTOPRIX_BASE_URL and CONTOPRIX_DELIVERY_KEY are required to use forms.",
    );
  }

  client = new ContoprixClient({
    baseUrl,
    auth: {
      type: "deliveryKey",
      deliveryKey,
    },
  });

  return client;
}
