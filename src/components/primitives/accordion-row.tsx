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
 * Real disclosure semantics: a <button> with aria-expanded and aria-controls.
 * The panel stays in the DOM so in-page search still finds it, and takes
 * `inert` when collapsed so its links leave the tab order.
 *
 * The reveal is the reference's own CSS technique — grid-rows 0fr -> 1fr, which
 * animates to the content's natural height without measuring it in JS. The
 * global prefers-reduced-motion block collapses the duration to 0.01ms.
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
          className="flex w-full items-baseline gap-4 px-6 py-9 text-left text-ui font-bold text-accent transition-colors duration-150 hover:text-ink sm:px-12 sm:py-11"
        >
          <span aria-hidden="true" className="shrink-0 select-none">
            [{open ? "-" : "+"}]
          </span>
          <span className="text-balance">{title}</span>
        </button>
      </h3>

      <div
        className={`grid transition-all duration-300 ease-in-out ${
          open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <section
          id={panelId}
          aria-labelledby={buttonId}
          inert={!open}
          className="overflow-hidden"
        >
          <div className="px-6 pb-10 pl-15 sm:px-12 sm:pl-15">{children}</div>
        </section>
      </div>
    </div>
  );
}

/** Groups accordion rows inside a hairline box. */
export function AccordionGroup({ children }: { children: React.ReactNode }) {
  return <div className="w-full border-y border-rule">{children}</div>;
}
