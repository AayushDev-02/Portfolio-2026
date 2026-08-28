import Link from "next/link";
import { cn } from "@/lib/utils";

type Props = {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  type?: "button" | "submit";
  tone?: "default" | "accent";
  className?: string;
  disabled?: boolean;
};

const base =
  "inline-flex items-center gap-2 border border-rule-strong px-5 py-3 text-body " +
  "transition-colors duration-150 disabled:opacity-40 disabled:pointer-events-none " +
  "hover:bg-fg hover:text-bg";

const tones = {
  default: "text-fg",
  accent: "border-accent text-accent hover:bg-accent hover:text-bg",
} as const;

/**
 * Text-only bracketed control: "[ GET IN TOUCH → ]".
 * No fill, no radius, no shadow. Hover inverts ground and ink.
 */
export function BracketButton({
  children,
  href,
  onClick,
  type = "button",
  tone = "default",
  className,
  disabled,
}: Props) {
  const content = (
    <>
      <span aria-hidden="true">[</span>
      <span>{children}</span>
      <span aria-hidden="true">]</span>
    </>
  );

  if (href) {
    return (
      <Link href={href} className={cn(base, tones[tone], className)}>
        {content}
      </Link>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={cn(base, tones[tone], className)}
    >
      {content}
    </button>
  );
}
