import type { NextConfig } from "next";

const productionAdminOrigins = ["https://admin.contoprix.com"];

function getAllowedAdminOrigins() {
  const configured = process.env.CONTOPRIX_ADMIN_ORIGINS?.split(",") ?? [];
  const candidates = [
    ...productionAdminOrigins,
    ...(process.env.NODE_ENV === "development"
      ? ["http://localhost:3000", "https://localhost:3000"]
      : []),
    ...configured,
  ];

  return [...new Set(candidates.map(toHttpOrigin).filter((value): value is string => Boolean(value)))];
}

function toHttpOrigin(value: string) {
  try {
    const url = new URL(value.trim());
    return url.protocol === "http:" || url.protocol === "https:" ? url.origin : null;
  } catch {
    return null;
  }
}

const nextConfig: NextConfig = {
  async headers() {
    const frameAncestors = getAllowedAdminOrigins().join(" ");
    return [{
      source: "/preview/:path*",
      headers: [{ key: "Content-Security-Policy", value: `frame-ancestors ${frameAncestors}` }],
    }];
  },
  async rewrites() {
    const baseUrl = process.env.CONTOPRIX_BASE_URL;

    if (!baseUrl) {
      return [];
    }

    return [
      {
        source: "/uploads/:path*",
        destination: `${baseUrl.replace(/\/$/, "")}/uploads/:path*`,
      },
    ];
  },
};

export default nextConfig;
