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
