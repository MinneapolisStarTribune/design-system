/**
 * Where the Storybook Versions toolbar is allowed (canonical hosts only).
 * Hashed Vercel previews (e.g. design-system-xxxx-…vercel.app) are excluded.
 */

/** Toolbar `toolbar.title` in globalTypes — manager CSS must match this string. */
export const VERSION_TOOLBAR_UI_TITLE = 'Versions' as const;

export const VERSION_TOOLBAR_ALLOWED_HOSTNAMES = [
  'localhost',
  'design-system-startribune-team-one.vercel.app',
  'stage-design-system.startribune.com',
  'design-system.startribune.com',
] as const;

export function isVersionToolbarAllowedHostname(hostname: string): boolean {
  return (VERSION_TOOLBAR_ALLOWED_HOSTNAMES as readonly string[]).includes(hostname);
}

/** Stage serves trunk through the git integration, so its "Current" is main, not a release. */
const TRUNK_HOSTNAME = 'stage-design-system.startribune.com';

/**
 * What the toolbar's Current item points at on this host:
 * trunk (stage = main), release (prod and its canonical alias), or plain (localhost, unknown).
 */
export function getCurrentViewKind(): 'trunk' | 'release' | 'plain' {
  if (typeof window === 'undefined') return 'plain';
  try {
    const hostname = (window.top ?? window).location.hostname;
    if (hostname === TRUNK_HOSTNAME) return 'trunk';
    if (hostname === 'localhost') return 'plain';
    return isVersionToolbarAllowedHostname(hostname) ? 'release' : 'plain';
  } catch {
    return 'plain';
  }
}

/**
 * True when the Versions control should exist in this session.
 * Always false without `window` so Node `build-storybook` never bakes the toolbar on for every host.
 */
export function shouldShowVersionsToolbar(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    return isVersionToolbarAllowedHostname((window.top ?? window).location.hostname);
  } catch {
    return false;
  }
}
