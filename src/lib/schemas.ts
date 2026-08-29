import { z } from "zod";
import { locales } from "@/i18n/routing";
import { CONTACT_LIMITS } from "./contact-contract";

/**
 * The one source of truth for contact validation. Server-side only.
 *
 * PLAN.md §1 called for react-hook-form + Zod shared across the boundary, but
 * React 19's `useActionState` gives the form its pending and result state for
 * free, and the client keeps native `required` / `type="email"` for instant
 * feedback — so neither library needs to ship to the browser. This file is
 * imported by the server action and by nothing else. See docs/DECISIONS.md.
 *
 * Issues carry *codes*, never sentences: the action returns the code and the
 * section renders the localised string from `content/*.ts`. That is what keeps
 * validation bilingual without a second copy of the schema per locale.
 */
export const contactSchema = z.object({
  name: z
    .string()
    .min(1, { error: "name_required" })
    .max(CONTACT_LIMITS.nameMax, { error: "name_too_long" }),
  email: z
    .email({ error: "email_invalid" })
    .max(CONTACT_LIMITS.emailMax, { error: "email_too_long" }),
  message: z
    .string()
    .min(CONTACT_LIMITS.messageMin, { error: "message_too_short" })
    .max(CONTACT_LIMITS.messageMax, { error: "message_too_long" }),
  locale: z.enum(locales, { error: "locale_invalid" }),
});

export type ContactInput = z.infer<typeof contactSchema>;
