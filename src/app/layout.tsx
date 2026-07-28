import type { Metadata } from "next";
import "./globals.css";

import { LayoutChrome } from "@/contoprix/LayoutChrome";

export const metadata: Metadata = {
  title: "Contoprix Demo",
  description: "A Next.js demo powered by Contoprix delivery APIs.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        <LayoutChrome>{children}</LayoutChrome>
      </body>
    </html>
  );
}
