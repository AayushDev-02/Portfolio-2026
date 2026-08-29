/**
 * The contact form's shared contract: field names, limits, error codes and the
 * shape the server action returns.
 *
 * Deliberately free of any import that costs bytes — no Zod, no clients. Both
 * the client form and the server action import this, so anything added here
 * ships to the browser. The Zod schema that enforces these limits lives in
 * `schemas.ts`, which the client never touches.
 */

export const CONTACT_LIMITS = {
  nameMax: 80,
  emailMax: 160,
  messageMin: 20,
  messageMax: 2000,
} as const;

/**
 * A real person cannot read the form, type a name, an address and twenty
 * characters of message in under two seconds. Deliberately generous — the cost
 * of a false positive here is a rejected job enquiry.
 */
export const MIN_FILL_MS = 2000;

/** The hidden field bots fill in and humans never see. */
export const HONEYPOT_FIELD = "company_website";
/** Hidden field holding the client-stamped render time, in epoch ms. */
export const RENDERED_AT_FIELD = "rendered_at";

/** The fields a validation error can attach to. */
export const CONTACT_FIELDS = ["name", "email", "message"] as const;
export type ContactField = (typeof CONTACT_FIELDS)[number];

/**
 * Every string the form can display for a failure.
 *
 * The union is exhaustive on purpose: `content/types.ts` types the copy as
 * `Record<ContactErrorCode, string>`, so adding a code here without writing
 * both translations is a compile error.
 */
export type ContactErrorCode =
  // field-level, raised by the schema
  | "name_required"
  | "name_too_long"
  | "email_invalid"
  | "email_too_long"
  | "message_too_short"
  | "message_too_long"
  | "locale_invalid"
  // form-level, raised by the action
  | "rate_limited"
  | "too_fast"
  | "unavailable"
  | "failed";

const CODES = new Set<string>([
  "name_required",
  "name_too_long",
  "email_invalid",
  "email_too_long",
  "message_too_short",
  "message_too_long",
  "locale_invalid",
  "rate_limited",
  "too_fast",
  "unavailable",
  "failed",
]);

/** Narrows a Zod issue message back to a known code, defaulting to `failed`. */
export function asErrorCode(message: string): ContactErrorCode {
  return CODES.has(message) ? (message as ContactErrorCode) : "failed";
}

export type ContactState = {
  status: "idle" | "success" | "error";
  fieldErrors?: Partial<Record<ContactField, ContactErrorCode>>;
  formError?: ContactErrorCode;
  /**
   * Echoed back on failure so a rejected submit does not wipe what was typed.
   * Without this the no-JS path loses the whole message on one typo'd address.
   */
  values?: { name: string; email: string; message: string };
};

export const initialContactState: ContactState = { status: "idle" };
