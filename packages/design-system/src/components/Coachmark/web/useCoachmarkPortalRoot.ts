/**
 * Creates (or reuses) a dedicated DOM node to use as a `Coachmark`'s `portalRoot` prop.
 * `Coachmark`'s own floating-ui-portal wrapper carries no attribute tying it back to which
 * instance produced it, so a consuming app's CSS has no way to single one out -- e.g. to give one
 * particular coachmark a different z-index than the rest. Giving a coachmark its own portal root
 * lets a CSS selector target it by that root's id instead.
 *
 * Returns the node synchronously (not via useState/useEffect) so `Coachmark` sees the same stable
 * element on every render, including its first. floating-ui/react's own `FloatingPortal` only ever
 * creates its portal wrapper once per mount and ignores later changes to `root` -- handing it
 * `null` on an initial render and the real node only once an effect resolves leaves the coachmark
 * permanently portaled into the wrong container, which in turn breaks `autoUpdate`'s resize/scroll
 * tracking (and so the `flip` middleware) since it's observing a detached or mismatched node.
 *
 * Pinned to exactly the viewport (`position: fixed; inset: 0`) rather than left as a bare,
 * zero-height block at the end of `<body>`'s normal flow: `Coachmark` passes this element straight
 * through to floating-ui's `flip`/`shift` as their `boundary`, which calls `getBoundingClientRect`
 * on it directly. An empty block has zero height and sits wherever the end of the page's content
 * happens to be -- often far below the visible viewport -- which intersected against the viewport
 * produces an inverted, negative-height clipping rect. That broke vertical flip (bottom<->top)
 * while leaving horizontal flip (left<->right) unaffected, since the block's width still spanned
 * the viewport correctly. `pointer-events: none` keeps this invisible full-viewport node from
 * blocking clicks elsewhere on the page -- a consuming app's CSS should re-enable them
 * (`pointer-events: auto`) on the `div[data-floating-ui-portal]` rendered inside it.
 *
 * This root is itself `position: fixed`, which unconditionally establishes a new stacking context
 * regardless of its own z-index -- so a consuming app's CSS must set any custom z-index on this
 * root element directly (by its id), not on a descendant. Without an explicit z-index here, the
 * root defaults to acting like z-index 0 against its siblings, which traps whatever z-index a
 * descendant has: that's only compared against this root's own children, never against the rest
 * of the page, so a sibling with any explicit z-index (e.g. a sticky header) would always win
 * regardless of how high the descendant's own z-index is set.
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
