import { TerminalPrompt } from "./terminal-prompt";

type Props = {
  /** The wordmark, rendered in the pixel display face over the photo. */
  title: string;
  /** Micro status line inside the terminal panel, e.g. "SYSTEM READY". */
  status?: string;
  /** Lines typed one after another at the ">" prompt. */
  lines: string[];
};

/**
 * The hero: a red pixel wordmark over the backdrop photograph, and below it
 * the single dark terminal panel — the only dark box on the site.
 *
 * Server component. Only the typewriter itself is a client leaf.
 */
export function TerminalHero({ title, status, lines }: Props) {
  return (
    <div className="relative flex flex-col items-center gap-8">
      <h1 className="font-display text-hero sm:text-hero-lg font-bold uppercase leading-none tracking-tight text-accent text-balance text-center">
        {title}
      </h1>

      <div className="w-full max-w-xl bg-terminal-bg px-6 py-5 text-terminal-fg">
        {status ? (
          <p className="text-micro tracking-label text-accent/80">{status}</p>
        ) : null}
        <TerminalPrompt lines={lines} />
      </div>
    </div>
  );
}
