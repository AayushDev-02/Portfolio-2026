type ClassValue = string | number | null | undefined | false;

/**
 * Minimal class joiner. Deliberately not clsx/tailwind-merge: this project has
 * no conflicting-utility problem yet, and every dependency is a byte on the
 * critical path. Upgrade to tailwind-merge only when a real conflict appears.
 */
export function cn(...classes: ClassValue[]): string {
  return classes.filter(Boolean).join(" ");
}

/** Zero-pads a section index: 1 -> "01". */
export function pad(n: number, width = 2): string {
  return String(n).padStart(width, "0");
}
