import {
  activateScripts,
  cleanMarkup,
  DEFERRED_SCRIPT_TYPE,
  neutralizeScripts,
} from './DangerousCodeBlock.utils';

describe('cleanMarkup', () => {
  it('converts smart quotes when cleanQuotes is true', () => {
    const input = `‘single’ “double” ″test″`;
    const result = cleanMarkup(input, true);

    expect(result).toBe(`'single' "double" "test"`);
  });

  it('does not modify quotes when cleanQuotes is false', () => {
    const input = `‘single’ “double”`;
    const result = cleanMarkup(input, false);

    expect(result).toBe(input);
  });

  it('returns empty string for null/undefined input', () => {
    expect(cleanMarkup(null, true)).toBe('');
    expect(cleanMarkup(undefined, true)).toBe('');
  });

  it('returns original string if cleanQuotes is false even with nullish handling', () => {
    expect(cleanMarkup('', false)).toBe('');
  });
});

describe('neutralizeScripts', () => {
  it('rewrites a plain script to the inert type and records the default original type', () => {
    const result = neutralizeScripts('<script>doThing()</script>');

    expect(result).toContain(
      `<script type="${DEFERRED_SCRIPT_TYPE}" data-original-type="text/javascript"`
    );
    expect(result).toContain('doThing()');
  });

  it('stashes an explicit original type', () => {
    const result = neutralizeScripts('<script type="module">import "x";</script>');

    expect(result).toContain(`<script type="${DEFERRED_SCRIPT_TYPE}" data-original-type="module"`);
  });

  it('preserves other attributes such as src, id, and async', () => {
    const result = neutralizeScripts('<script src="https://x.test/a.js" id="foo" async></script>');

    expect(result).toContain('src="https://x.test/a.js"');
    expect(result).toContain('id="foo"');
    expect(result).toContain('async');
    expect(result).toContain(`type="${DEFERRED_SCRIPT_TYPE}"`);
    expect(result).toContain('data-original-type="text/javascript"');
  });

  it('neutralizes every script in the markup and leaves other tags alone', () => {
    const result = neutralizeScripts('<script>a()</script><p>keep me</p><script>b()</script>');

    const markerCount = result.match(new RegExp(`type="${DEFERRED_SCRIPT_TYPE}"`, 'g'))?.length;
    expect(markerCount).toBe(2);
    expect(result).toContain('<p>keep me</p>');
  });

  it('is case-insensitive', () => {
    const result = neutralizeScripts('<SCRIPT>a()</SCRIPT>');

    expect(result).toContain(`type="${DEFERRED_SCRIPT_TYPE}"`);
  });

  it('leaves markup without scripts untouched', () => {
    const markup = '<div class="chart">hello</div>';

    expect(neutralizeScripts(markup)).toBe(markup);
  });
});

describe('activateScripts', () => {
  const mount = (html: string): HTMLDivElement => {
    const container = document.createElement('div');
    container.innerHTML = html;
    return container;
  };

  it('swaps an inert script for a real one and restores its type', () => {
    const container = mount(neutralizeScripts('<script>window.__ran = true;</script>'));

    activateScripts(container);

    expect(container.querySelector(`script[type="${DEFERRED_SCRIPT_TYPE}"]`)).toBeNull();

    const script = container.querySelector('script');
    expect(script).not.toBeNull();
    expect(script?.type).toBe('text/javascript');
    expect(script?.textContent).toContain('window.__ran = true;');
    expect(script?.getAttribute('data-original-type')).toBeNull();
  });

  it('restores an explicit original type', () => {
    const container = mount(neutralizeScripts('<script type="module">import "x";</script>'));

    activateScripts(container);

    expect(container.querySelector('script')?.type).toBe('module');
  });

  it('copies src for external scripts and does not set inline body', () => {
    const container = mount(neutralizeScripts('<script src="https://x.test/a.js"></script>'));

    activateScripts(container);

    const script = container.querySelector('script');
    expect(script?.getAttribute('src')).toBe('https://x.test/a.js');
    expect(script?.textContent).toBe('');
  });

  it('is idempotent — a repeat pass adds no new script', () => {
    const container = mount(neutralizeScripts('<script>noop()</script>'));

    activateScripts(container);
    activateScripts(container);

    expect(container.querySelectorAll('script')).toHaveLength(1);
  });

  it('leaves non-deferred scripts untouched', () => {
    const container = mount('<script type="text/javascript">already()</script>');

    activateScripts(container);

    expect(container.querySelectorAll('script')).toHaveLength(1);
    expect(container.querySelector('script')?.textContent).toBe('already()');
  });
});
