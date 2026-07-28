import { getContoprixPage } from "@contoprix/next/server";
import type { ContoprixPage } from "@contoprix/types";

import { ContoprixRenderer } from "./ContoprixRenderer";

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
    console.warn(`Contoprix layout page "${slug}" could not be loaded.`, error);

    return null;
  }
}
