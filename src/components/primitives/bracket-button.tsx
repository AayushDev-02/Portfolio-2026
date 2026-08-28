import Link from "next/link";
import { cn } from "@/lib/utils";

type Props = {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  type?: "button" | "submit";
  /** The reference's section CTA is bare text. `boxed` is for form controls. */
  variant?: "bare" | "boxed";
  className?: string;
  disabled?: boolean;
};

const variants = {
  bare: "text-label font-bold tracking-label uppercase text-accent hover:text-ink",
  boxed:
    "border border-rule px-5 py-3 text-label font-bold tracking-label uppercase text-accent hover:bg-accent hover:text-bg",
} as const;

/**
 * Bracketed control: "[ GET NOTIFIED → ]".
 * No fill, no radius, no shadow.
 */
export function BracketButton({
  children,
  href,
  onClick,
  type = "button",
  variant = "bare",
  className,
  disabled,
}: Props) {
  const classes = cn(
    "inline-flex items-center gap-2 transition-colors duration-150",
    "disabled:pointer-events-none disabled:opacity-40",
    variants[variant],
    className,
  );

  const content = (
    <>
      <span aria-hidden="true">[</span>
      <span>{children}</span>
      <span aria-hidden="true">]</span>
    </>
  );

  if (href) {
    return (
      <Link href={href} className={classes}>
        {content}
      </Link>
    );
  }

  return (
    <button type={type} onClick={onClick} disabled={disabled} className={classes}>
      {content}
    </button>
  );
}
