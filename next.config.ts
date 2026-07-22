import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    const configured = process.env.CONTOPRIX_ADMIN_ORIGINS
      ?.split(",")
      .map((value) => value.trim())
      .filter(Boolean) ?? [];
    const frameAncestors = configured.length > 0 ? configured.join(" ") : "'none'";
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
