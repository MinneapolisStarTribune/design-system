/**
 * Creates (or reuses) a dedicated DOM node to use as a `Coachmark`'s `portalRoot` prop, so a
 * consuming app's CSS can target one particular coachmark instance by this root's id (e.g. to give
 * it a different z-index than the rest).
 *
 * Must return the same node synchronously on every render, including the first -- `FloatingPortal`
 * only creates its wrapper once per mount and ignores later changes to `root`, so starting at
 * `null` and resolving later (e.g. via useState/useEffect) permanently portals into the wrong
 * container.
 *
 * Must be `position: fixed; inset: 0`, not a bare div -- floating-ui passes this element straight
 * to `flip`/`shift` as their `boundary`. A bare, zero-height div sitting wherever the end of
 * `<body>` happens to be breaks vertical flip (its rect intersected with the viewport goes
 * negative-height). `pointer-events: none` here keeps it click-through; a consuming app's CSS
 * should re-enable `pointer-events: auto` on the `div[data-floating-ui-portal]` inside it.
 *
 * Any custom z-index must go on this root itself, not a descendant: `position: fixed`
 * unconditionally creates a new stacking context, so a z-index on a descendant is only compared
 * against this root's own children, never the rest of the page -- a sibling with any explicit
 * z-index (e.g. a sticky header) would win regardless of how high the descendant's z-index is set.
 */
export function useCoachmarkPortalRoot(id: string): HTMLElement | null {
  if (typeof document === 'undefined') return null;

  // Styles are (re-)applied unconditionally, even when reusing an existing node -- otherwise a
  // node created by an older version of this function (e.g. still sitting in the DOM across a dev
  // server's hot reload, since plain DOM nodes like this aren't part of React's tree and so aren't
  // touched by Fast Refresh) would keep whatever styling it was originally created with forever.
  const el = document.getElementById(id) ?? document.createElement('div');
  el.id = id;
  el.style.position = 'fixed';
  el.style.inset = '0';
  el.style.pointerEvents = 'none';
  if (!el.isConnected) document.body.appendChild(el);
  return el;
}
