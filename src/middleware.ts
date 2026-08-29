import createMiddleware from "next-intl/middleware";
import { routing } from "@/i18n/routing";

export default createMiddleware(routing);

export const config = {
  // Everything except Next internals, the image optimizer and anything with a
  // file extension — otherwise /images/hero-bg.png would get locale-prefixed.
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
