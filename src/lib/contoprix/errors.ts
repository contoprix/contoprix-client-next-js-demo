/** True for a ContoprixError (or anything shaped like one) carrying a 404 status --
 * the SDK's delivery methods reject rather than resolve to null on a 404, so callers that
 * treat "not published" as a normal, expected outcome (not a server error) need this. */
export function isNotFoundError(error: unknown): boolean {
  return (
    error instanceof Error &&
    "statusCode" in error &&
    (error as { statusCode?: number }).statusCode === 404
  );
}
