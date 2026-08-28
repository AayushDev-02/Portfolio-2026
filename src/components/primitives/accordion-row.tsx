"use client";

import { useId, useState } from "react";

type Props = {
  title: string;
  /** Open on first render. Use for the first row in a group. */
  defaultOpen?: boolean;
  children: React.ReactNode;
};

/**
 * The "[+] Question" row that expands to reveal a checklist.
 *
 * Real disclosure semantics: a <button> with aria-expanded and aria-controls,
 * and the panel stays in the DOM (hidden) so in-page search still finds it.
 */
export function AccordionRow({ title, defaultOpen = false, children }: Props) {
  const [open, setOpen] = useState(defaultOpen);
  const panelId = useId();
  const buttonId = useId();

  return (
    <div className="border-b border-rule last:border-b-0">
      <h3>
        <button
          type="button"
          id={buttonId}
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => setOpen((v) => !v)}
          className="flex w-full items-baseline gap-4 px-gutter py-9 text-left text-body transition-colors duration-150 hover:text-accent"
        >
          <span aria-hidden="true" className="shrink-0 select-none text-accent">
            [{open ? "-" : "+"}]
          </span>
          <span className="text-balance">{title}</span>
        </button>
      </h3>

      <section
        id={panelId}
        aria-labelledby={buttonId}
        hidden={!open}
        className="px-gutter pb-9 pl-14"
      >
        {children}
      </section>
    </div>
  );
}

/** Groups accordion rows inside a hairline box. */
export function AccordionGroup({ children }: { children: React.ReactNode }) {
  return <div className="border border-rule">{children}</div>;
}
