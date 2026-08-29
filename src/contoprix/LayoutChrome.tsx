import { getContoprixPage } from "@contoprix/next/server";
import type { ContoprixPage } from "@contoprix/types";

import { ContoprixRenderer } from "./ContoprixRenderer";
import { isNotFoundError } from "@/lib/contoprix/errors";

type LayoutChromeProps = {
  children: React.ReactNode;
};

export async function LayoutChrome({ children }: LayoutChromeProps) {
  const [header, footer] = await Promise.all([
    getLayoutPage("__header"),
    getLayoutPage("__footer"),
  ]);

  return (
    <>
      {header ? <ContoprixRenderer page={header} /> : null}
      <main className="flex-1">{children}</main>
      {footer ? <ContoprixRenderer page={footer} /> : null}
    </>
  );
}

async function getLayoutPage(slug: string): Promise<ContoprixPage | null> {
  try {
    return await getContoprixPage({
      slug,
    });
  } catch (error) {
    // No page published at "__header"/"__footer" yet is the normal starting state for a
    // website -- an editor creates it via the CMS sidebar's "Add Header"/"Add Footer" action.
    // Only genuinely unexpected failures (auth, network, 5xx) are worth a loud warning.
    if (!isNotFoundError(error)) {
      console.warn(`Contoprix layout page "${slug}" could not be loaded.`, error);
    }

    return null;
  }
}
