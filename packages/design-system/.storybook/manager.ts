/**
 * Hides the Versions control on disallowed hosts (e.g. hashed Vercel previews) when an old bundle
 * still shipped it. `preview` omits `versions` globalTypes when disallowed; this is a safety net.
 */
import { addons } from 'storybook/manager-api';
import { isVersionToolbarAllowedHostname, VERSION_TOOLBAR_UI_TITLE } from './version-toolbar-hosts';

const STYLE_ID = 'strib-hide-versions-toolbar';

function hideVersionsToolbarWithCss(): void {
  if (typeof window === 'undefined') return;
  if (isVersionToolbarAllowedHostname(window.location.hostname)) return;
  if (document.getElementById(STYLE_ID)) return;

  const title = VERSION_TOOLBAR_UI_TITLE;
  const style = document.createElement('style');
  style.id = STYLE_ID;
  style.textContent = `
    [role="toolbar"] [title="${title}"],
    [role="toolbar"] button[title="${title}"],
    #storybook-toolbar [title="${title}"] {
      display: none !important;
    }
  `;
  document.head.appendChild(style);
}

addons.register('strib-hide-versions-toolbar', hideVersionsToolbarWithCss);
