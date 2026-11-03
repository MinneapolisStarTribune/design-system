const SCOPED_ROOT_SELECTOR = 'dialog, [role="dialog"], [role="alertdialog"], [data-theme]';

/**
 * Returns the nearest dialog or `data-theme` region around `element`, so a portaled floating
 * element stays inside focus traps and scoped themes. Returns `undefined` for `<html data-theme>`,
 * which portals to `body`.
 */
export const getScopedPortalRoot = (element: Element | null | undefined) => {
  const root = element?.closest<HTMLElement>(SCOPED_ROOT_SELECTOR);
  return root && root.tagName !== 'HTML' ? root : undefined;
};
