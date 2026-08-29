import { createNavigation } from "next-intl/navigation";
import { routing } from "./routing";

/**
 * Locale-aware replacements for next/link and the navigation hooks. Importing
 * these instead of next/link keeps the active locale on every internal href
 * without each call site remembering to prefix it.
 */
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
