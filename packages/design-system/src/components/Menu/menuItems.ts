/**
 * Whether list navigation should skip an item. Disabled items stay focusable, as APG menus require,
 * so only items hidden with CSS, such as per-breakpoint items, are skipped. jsdom has no
 * `checkVisibility`.
 */
export const isHiddenItem = (item: HTMLElement | null | undefined) =>
  !item || !(item.checkVisibility?.() ?? true);
