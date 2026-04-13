/**
 * Versions toolbar: pinned deployments from `versions.json`, navigation, and Docs-mode channel handling.
 */
import { addons } from 'storybook/preview-api';
import { GLOBALS_UPDATED } from 'storybook/internal/core-events';
import versionsList from './versions.json';
import { shouldShowVersionsToolbar, VERSION_TOOLBAR_UI_TITLE } from './version-toolbar-hosts';

type VersionsEntry = { version: string; url: string };

const versions = versionsList as VersionsEntry[];

const VERSION_TOOLBAR_LIMIT = 5;

const recentVersions = versions.slice(0, VERSION_TOOLBAR_LIMIT);

const versionToolbarItems = [
  { value: 'current', title: 'Current' },
  ...recentVersions.map((v) => ({ value: v.version, title: v.version })),
];

/** Evaluated once per preview bundle load in the browser. */
export const showVersionsToolbar = shouldShowVersionsToolbar();

const LISTENER_GUARD_KEY = '__strib_ds_version_toolbar_globals_listener__';

function resolveVersionDeploymentUrl(versionsGlobal: string): string | null {
  if (versionsGlobal === 'current') return null;
  if (versionsGlobal.startsWith('http')) return versionsGlobal;
  const entry = versions.find((v) => v.version === versionsGlobal);
  return entry?.url ?? null;
}

function isViewingDeploymentUrl(deploymentUrl: string): boolean {
  if (typeof window === 'undefined') return false;
  try {
    return new URL(deploymentUrl).origin === (window.top ?? window).location.origin;
  } catch {
    return false;
  }
}

function redirectStorybookToVersionDeployment(url: string): void {
  const w = window.top || window;
  try {
    const target = new URL(url);
    const current = new URL(w.location.href);
    if (target.origin === current.origin) {
      target.search = current.search;
      target.hash = current.hash;
    } else {
      target.pathname = '/';
      target.search = '';
      target.hash = '';
    }
    w.location.href = target.toString();
  } catch {
    w.location.href = url;
  }
}

/** Storybook `GLOBALS_UPDATED` payload shapes vary; merge into one object with `versions`. */
function mergeGlobalsFromChannelPayload(raw: unknown): Record<string, unknown> | undefined {
  if (!raw || typeof raw !== 'object') return undefined;
  const o = raw as Record<string, unknown>;
  const merged: Record<string, unknown> = {};
  const assign = (src: unknown) => {
    if (src && typeof src === 'object' && !Array.isArray(src)) {
      Object.assign(merged, src as Record<string, unknown>);
    }
  };
  assign(o.globals);
  assign(o.userGlobals);
  assign(o.storyGlobals);
  if (typeof o.versions === 'string') merged.versions = o.versions;
  return Object.keys(merged).length > 0 ? merged : undefined;
}

function maybeRedirectFromMergedGlobals(globals: Record<string, unknown> | undefined): void {
  if (!globals) return;
  const raw = globals.versions;
  if (typeof raw !== 'string') return;
  const target = resolveVersionDeploymentUrl(raw);
  if (!target || isViewingDeploymentUrl(target)) return;
  redirectStorybookToVersionDeployment(target);
}

/**
 * Register once: Docs mode often skips re-running the root decorator on toolbar changes.
 */
export function registerVersionToolbarGlobalsListener(): void {
  if (typeof window === 'undefined' || !showVersionsToolbar) return;
  const g = globalThis as unknown as Record<string, unknown>;
  if (g[LISTENER_GUARD_KEY]) return;
  g[LISTENER_GUARD_KEY] = true;

  void addons.ready().then((channel) => {
    channel.on(GLOBALS_UPDATED, (payload: unknown) => {
      maybeRedirectFromMergedGlobals(mergeGlobalsFromChannelPayload(payload));
    });
  });
}

/** Fragment for `preview.globalTypes` when the toolbar is enabled. */
export function getVersionsGlobalTypeEntry() {
  return {
    versions: {
      description: 'Storybook deployment',
      defaultValue: 'current',
      toolbar: {
        title: VERSION_TOOLBAR_UI_TITLE,
        icon: 'branch' as const,
        dynamicTitle: true,
        items: versionToolbarItems,
      },
    },
  };
}

export function getVersionsInitialGlobal(): { versions: 'current' } | Record<string, never> {
  return showVersionsToolbar ? { versions: 'current' } : {};
}

/**
 * If the user picked a different pinned deployment, navigate. Call from the root decorator.
 * @returns whether navigation was started (caller should render the redirect placeholder).
 */
export function tryNavigateForVersionChoice(context: {
  globals: Record<string, unknown>;
}): boolean {
  if (!showVersionsToolbar || typeof window === 'undefined') return false;
  const raw = context.globals.versions;
  if (typeof raw !== 'string') return false;
  const url = resolveVersionDeploymentUrl(raw);
  if (!url || isViewingDeploymentUrl(url)) return false;
  redirectStorybookToVersionDeployment(url);
  return true;
}
