import type { Metadata } from "next";
import Link from "next/link";

import { ExamplesNav } from "./ExamplesNav";

export const metadata: Metadata = {
  title: {
    template: "%s | Contoprix Demo",
    default: "SDK examples | Contoprix Demo",
  },
};

export default function ExamplesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="bg-slate-50">
      <div className="mx-auto max-w-4xl px-5 py-14 sm:px-8 lg:py-20">
        <Link
          href="/"
          className="text-sm font-medium text-slate-500 hover:text-slate-900"
        >
          ← Back home
        </Link>

        <ExamplesNav />

        <div className="mt-10">{children}</div>
      </div>
    </section>
  );
}
