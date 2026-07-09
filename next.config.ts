import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
