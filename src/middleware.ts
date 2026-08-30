import createMiddleware from "next-intl/middleware";
import { routing } from "@/i18n/routing";

export default createMiddleware(routing);

export const config = {
  // Everything except Next internals, the image optimizer, the root-level
  // metadata routes, and anything with a file extension — otherwise
  // /images/hero-bg.png would get locale-prefixed.
  //
  // `icon` has to be named explicitly: it has no file extension, so the
  // extension rule does not catch it, and the middleware was rewriting
  // /icon -> /en/icon, which does not exist. The favicon 404'd on every page
  // and surfaced as a console error in Lighthouse's best-practices audit.
  // `sitemap.xml` and `robots.txt` already fall under the extension rule.
  matcher: ["/((?!api|_next|_vercel|icon|apple-icon|.*\\..*).*)"],
};
