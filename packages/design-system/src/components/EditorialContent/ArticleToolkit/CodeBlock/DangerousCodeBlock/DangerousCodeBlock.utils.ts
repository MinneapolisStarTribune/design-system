export const cleanMarkup = (html: string | undefined | null, cleanQuotes: boolean): string => {
  if (!html || !cleanQuotes) return html ?? '';

  let cleaned = html.replace(/[’‘]/g, "'");
  cleaned = cleaned.replace(/[“”″]/g, '"');

  return cleaned;
};

/**
 * A deliberately unrecognized script type. The browser won't run a script whose
 * type it doesn't understand, which is what keeps neutralized scripts dormant.
 */
export const DEFERRED_SCRIPT_TYPE = 'application/x-deferred-script';

/**
 * Rewrites each <script>'s type to the inert marker so the browser skips it while
 * parsing the page. Done during render so server and first client render emit
 * identical HTML (no hydration mismatch); the real type is saved on a data
 * attribute for activateScripts to restore.
 */
export const neutralizeScripts = (html: string): string =>
  html.replace(/<script\b([^>]*)>/gi, (_match, attrs: string) => {
    const originalType = attrs.match(/\btype\s*=\s*["']([^"']*)["']/i)?.[1] ?? 'text/javascript';
    const withoutType = attrs.replace(/\btype\s*=\s*["'][^"']*["']/i, '');
    return `<script type="${DEFERRED_SCRIPT_TYPE}" data-original-type="${originalType}"${withoutType}>`;
  });

/**
 * Runs the neutralized scripts once, on the client. A <script> already in the DOM
 * never executes again no matter what you change on it, so each one is swapped for
 * a freshly created copy — only a newly inserted script runs. Idempotent: the
 * marker is consumed by the swap, so a repeat pass finds nothing.
 */
export const activateScripts = (container: HTMLElement): void => {
  const inertScripts = container.querySelectorAll<HTMLScriptElement>(
    `script[type="${DEFERRED_SCRIPT_TYPE}"]`
  );

  inertScripts.forEach((inert) => {
    const script = document.createElement('script');

    // Copy attributes across, turning the saved type back into the real one.
    Array.from(inert.attributes).forEach(({ name, value }) => {
      if (name === 'type') return;
      if (name === 'data-original-type') {
        script.type = value;
        return;
      }
      script.setAttribute(name, value);
    });

    // Inline scripts hold their code in textContent; src scripts already have it.
    if (!inert.src) {
      script.textContent = inert.textContent;
    }

    inert.replaceWith(script);
  });
};
