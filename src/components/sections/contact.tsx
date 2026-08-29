import { BracketButton, SectionHead, SectionShell } from "@/components/primitives";
import type { SiteContent } from "@/content";

/** A label/value row in the details list. */
function DetailRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1 border-b border-rule py-4 last:border-b-0 sm:flex-row sm:items-baseline sm:gap-6">
      <dt className="label shrink-0 text-accent sm:w-40">{label}</dt>
      <dd className="text-ui text-ink">{children}</dd>
    </div>
  );
}

export function ContactSection({ content }: { content: SiteContent }) {
  const { contact } = content;

  return (
    <SectionShell
      index={5}
      eyebrow={contact.eyebrow}
      position={6}
      total={6}
      id="contact"
      caption={contact.caption}
      sigil={contact.sigil}
    >
      <div className="flex flex-col items-center gap-10">
        <SectionHead heading={contact.heading} lede={contact.lead} />

        <dl className="w-full max-w-xl">
          <DetailRow label="Email">
            <a
              href={`mailto:${contact.email}`}
              className="underline underline-offset-4 transition-colors duration-150 hover:text-accent"
            >
              {contact.email}
            </a>
          </DetailRow>

          {contact.links.map((link) => (
            <DetailRow key={link.label} label={link.label}>
              <a
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-4 transition-colors duration-150 hover:text-accent"
              >
                {link.display}
              </a>
            </DetailRow>
          ))}

          <DetailRow label={contact.locationLabel}>{contact.location}</DetailRow>
          <DetailRow label={contact.availabilityLabel}>{contact.availability}</DetailRow>

          <DetailRow label={contact.documentsLabel}>
            <div className="flex flex-col gap-3">
              {/* Empty until redacted copies exist — see docs/CONTENT-STAGE5.md §1.
                  The 履歴書 is never a file here; it is only ever this note. */}
              {contact.documents.length > 0 ? (
                <div className="flex flex-wrap gap-6">
                  {contact.documents.map((doc) => (
                    <BracketButton key={doc.href} href={doc.href} external download>
                      {doc.label}
                    </BracketButton>
                  ))}
                </div>
              ) : null}
              <p className="font-sans text-ui leading-6 text-prose">
                {contact.documentsNote}
              </p>
            </div>
          </DetailRow>
        </dl>

        {/*
          STAGE 6 SLOT — the contact form mounts here.
          Server action: validate -> rate limit -> honeypot -> insert -> send.
          Left as markup only on purpose; a form that silently drops messages is
          worse than no form on a page whose whole job is getting someone hired.
        */}
      </div>
    </SectionShell>
  );
}
