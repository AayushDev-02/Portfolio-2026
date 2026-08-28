/** A short user quote, set off with an accent rule. */
export function PullQuote({ children }: { children: React.ReactNode }) {
  return (
    <blockquote className="border-l-2 border-accent pl-4 text-body text-fg">
      &ldquo;{children}&rdquo;
    </blockquote>
  );
}
