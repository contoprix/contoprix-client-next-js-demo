import { buildSchemaRegistry } from "@contoprix/react";
import type { SdkSchema } from "@contoprix/client";

import pulledSchema from "../../.contoprix/schema/schema.json";

/**
 * Schema registry built once at module load from the build-time pulled
 * `.contoprix/schema/schema.json` (`contoprix pull`) — powers the SDK's
 * generic fallback renderer for any component/content type with no entry
 * in `./components.ts`. Refresh by re-running `contoprix pull`.
 *
 * The live visual-editing iframe (`ContoprixPreviewRenderer`) additionally
 * refreshes this at runtime from the preview-schema endpoint, since a
 * component type created moments ago won't be in this file until the next
 * pull.
 */
export const contoprixSchemas = buildSchemaRegistry(pulledSchema as SdkSchema);
