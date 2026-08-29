import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    // AVIF first, WebP fallback. See docs/PLAN.md stage 5.
    formats: ["image/avif", "image/webp"],
  },
  experimental: {
    // Keeps the client bundle lean by tree-shaking barrel imports.
    optimizePackageImports: ["@/components/primitives"],
  },
};

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

export default withNextIntl(nextConfig);
