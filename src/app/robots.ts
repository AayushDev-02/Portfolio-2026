import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/site-url";

/**
 * `/dev/` is disallowed as well as `noindex`-tagged. The two do different jobs:
 * the meta tag keeps the kitchen sink out of the index for crawlers that fetch
 * it, this keeps most of them from fetching it at all.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/dev/"] }],
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
