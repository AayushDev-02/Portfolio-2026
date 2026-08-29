"use client";

import { useActionState, useEffect, useId, useRef } from "react";
import { submitContact } from "@/app/actions/contact";
import type { ContactFormCopy } from "@/content";
import type { Locale } from "@/i18n/routing";
import {
  CONTACT_LIMITS,
  type ContactState,
  HONEYPOT_FIELD,
  initialContactState,
  RENDERED_AT_FIELD,
} from "@/lib/contact-contract";
import { cn } from "@/lib/utils";

/**
 * The contact form. The only new client component since stage 2R, and it earns
 * the "use client": `useActionState` needs a hook, and a pending label needs a
 * re-render.
 *
 * Everything else stays off the client. Validation is server-side, so no Zod
 * reaches the bundle; the copy arrives as props from the server section; and
 * the form posts through a server action, so it still works with JavaScript
 * disabled — minus only the pending label and the timing stamp.
 */

const fieldBase =
  "w-full min-h-11 border-b border-rule bg-transparent py-3 font-sans text-ui text-ink " +
  "transition-colors duration-150 focus:border-accent";

function FieldError({ id, children }: { id: string; children?: string }) {
  if (!children) return null;
  return (
    <p id={id} className="mt-2 font-sans text-label leading-5 text-accent">
      {children}
    </p>
  );
}

export function ContactForm({ copy, locale }: { copy: ContactFormCopy; locale: Locale }) {
  const [state, formAction, isPending] = useActionState<ContactState, FormData>(
    submitContact,
    initialContactState,
  );

  const stampRef = useRef<HTMLInputElement>(null);
  const nameId = useId();
  const emailId = useId();
  const messageId = useId();
  const honeypotId = useId();

  // Stamped after mount rather than during render: Date.now() in the render
  // body differs between server and client and would be a hydration mismatch.
  // Left empty when JavaScript is off, which the action reads as "skip the
  // timing check" rather than as a failure.
  useEffect(() => {
    if (stampRef.current) stampRef.current.value = String(Date.now());
  }, []);

  if (state.status === "success") {
    return (
      <div className="w-full max-w-xl border border-rule px-6 py-10 text-center sm:px-10">
        <p className="label mb-4 font-bold text-accent">[ {copy.successTitle} ]</p>
        <p className="font-sans text-lede leading-7 text-prose">{copy.successBody}</p>
      </div>
    );
  }

  return (
    <form action={formAction} className="w-full max-w-xl" noValidate>
      <h3 className="label mb-3 font-bold text-accent">{copy.heading}</h3>
      <p className="mb-8 font-sans text-ui leading-6 text-prose">{copy.intro}</p>

      <input type="hidden" name="locale" value={locale} />
      <input type="hidden" name={RENDERED_AT_FIELD} ref={stampRef} defaultValue="" />

      {/*
        Honeypot. Moved off-screen rather than display:none — a fair number of
        bots now skip hidden fields, and none of them read this label.
        aria-hidden plus tabIndex -1 keeps it out of the keyboard and screen
        reader path; the label is there for anything that ignores both.
      */}
      <div
        aria-hidden="true"
        className="absolute -left-[9999px] h-px w-px overflow-hidden"
      >
        <label htmlFor={honeypotId}>{copy.honeypotLabel}</label>
        <input
          id={honeypotId}
          type="text"
          name={HONEYPOT_FIELD}
          tabIndex={-1}
          autoComplete="off"
          defaultValue=""
        />
      </div>

      <div className="flex flex-col gap-6">
        <div>
          <label htmlFor={nameId} className="label mb-1 block text-accent">
            {copy.nameLabel}
          </label>
          <input
            id={nameId}
            name="name"
            type="text"
            required
            maxLength={CONTACT_LIMITS.nameMax}
            autoComplete="name"
            defaultValue={state.values?.name ?? ""}
            aria-invalid={state.fieldErrors?.name ? true : undefined}
            aria-describedby={state.fieldErrors?.name ? `${nameId}-error` : undefined}
            className={cn(fieldBase, state.fieldErrors?.name && "border-accent")}
          />
          <FieldError id={`${nameId}-error`}>
            {state.fieldErrors?.name && copy.errors[state.fieldErrors.name]}
          </FieldError>
        </div>

        <div>
          <label htmlFor={emailId} className="label mb-1 block text-accent">
            {copy.emailLabel}
          </label>
          <input
            id={emailId}
            name="email"
            type="email"
            required
            maxLength={CONTACT_LIMITS.emailMax}
            autoComplete="email"
            inputMode="email"
            defaultValue={state.values?.email ?? ""}
            aria-invalid={state.fieldErrors?.email ? true : undefined}
            aria-describedby={state.fieldErrors?.email ? `${emailId}-error` : undefined}
            className={cn(fieldBase, state.fieldErrors?.email && "border-accent")}
          />
          <FieldError id={`${emailId}-error`}>
            {state.fieldErrors?.email && copy.errors[state.fieldErrors.email]}
          </FieldError>
        </div>

        <div>
          <label htmlFor={messageId} className="label mb-1 block text-accent">
            {copy.messageLabel}
          </label>
          <textarea
            id={messageId}
            name="message"
            required
            rows={6}
            minLength={CONTACT_LIMITS.messageMin}
            maxLength={CONTACT_LIMITS.messageMax}
            defaultValue={state.values?.message ?? ""}
            aria-invalid={state.fieldErrors?.message ? true : undefined}
            aria-describedby={
              state.fieldErrors?.message ? `${messageId}-error` : `${messageId}-hint`
            }
            className={cn(
              fieldBase,
              "resize-y",
              state.fieldErrors?.message && "border-accent",
            )}
          />
          {state.fieldErrors?.message ? (
            <FieldError id={`${messageId}-error`}>
              {copy.errors[state.fieldErrors.message]}
            </FieldError>
          ) : (
            <p id={`${messageId}-hint`} className="mt-2 font-sans text-label text-prose">
              {copy.messageHint}
            </p>
          )}
        </div>
      </div>

      {/* Rate limiting, timing and delivery failures are not about one field,
          so they get their own live region above the button. */}
      <div aria-live="polite">
        {state.formError ? (
          <p className="mt-6 border border-accent px-4 py-3 font-sans text-ui leading-6 text-accent">
            {copy.errors[state.formError]}
          </p>
        ) : null}
      </div>

      <div className="mt-8 flex flex-col gap-4">
        <button
          type="submit"
          disabled={isPending}
          className={cn(
            "inline-flex min-h-11 items-center gap-2 self-start border border-rule px-5 py-3",
            "text-label font-bold uppercase tracking-label text-accent",
            "transition-colors duration-150 hover:bg-accent hover:text-bg",
            "disabled:pointer-events-none disabled:opacity-40",
          )}
        >
          <span aria-hidden="true">[</span>
          <span>{isPending ? copy.submitting : copy.submit}</span>
          <span aria-hidden="true">]</span>
        </button>

        <p className="font-sans text-label leading-5 text-prose">{copy.privacyNote}</p>
      </div>
    </form>
  );
}
