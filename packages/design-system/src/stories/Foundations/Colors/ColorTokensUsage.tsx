import React from 'react';

const preStyle: React.CSSProperties = {
  margin: '0.5rem 0 1rem',
  padding: '0.75rem 1rem',
  fontSize: '0.8125rem',
  fontFamily: 'monospace',
  borderRadius: '4px',
  backgroundColor: 'rgba(0, 0, 0, 0.06)',
  border: '1px solid rgba(0, 0, 0, 0.08)',
  overflowX: 'auto',
};

/**
 * Shared “how to use var(--color-…)” docs for Foundations color pages (Storybook only).
 */
export function ColorTokensUsage() {
  return (
    <div
      id="using-these-tokens-in-code"
      style={{
        marginTop: '2.5rem',
        marginBottom: '1rem',
        borderTop: '1px solid rgba(0, 0, 0, 0.08)',
        paddingTop: '1.5rem',
      }}
    >
      <h3 style={{ marginTop: 0, marginBottom: '0.5rem' }}>Using these tokens in code</h3>
      <p style={{ marginBottom: '0.75rem' }}>
        Each swatch shows a token as a <strong>CSS variable</strong>. Use it in{' '}
        <code style={{ fontSize: '0.9em' }}>var(--color-…)</code> form on any color-related property
        (<code style={{ fontSize: '0.9em' }}>background-color</code>,{' '}
        <code style={{ fontSize: '0.9em' }}>color</code>,{' '}
        <code style={{ fontSize: '0.9em' }}>border-color</code>,{' '}
        <code style={{ fontSize: '0.9em' }}>fill</code>, etc.).
      </p>

      <p style={{ marginBottom: '0.25rem', fontWeight: 600 }}>CSS or SCSS</p>
      <pre style={preStyle}>
        <code>{`.my-component {
  background-color: var(--color-background-brand);
}`}</code>
      </pre>

      <p style={{ marginBottom: '0.25rem', fontWeight: 600 }}>Optional fallback</p>
      <p style={{ fontSize: '0.875rem', marginBottom: '0.35rem' }}>
        Use a second value if the variable might be missing:
      </p>
      <pre style={preStyle}>
        <code>{`background-color: var(--color-background-brand, #00854b);`}</code>
      </pre>

      <p style={{ marginBottom: '0.25rem', fontWeight: 600 }}>React (inline styles)</p>
      <pre style={preStyle}>
        <code>{`<div style={{ backgroundColor: 'var(--color-background-brand)' }} />`}</code>
      </pre>

      <p style={{ marginBottom: '0.25rem', fontWeight: 600 }}>Theme</p>
      <p style={{ fontSize: '0.875rem', marginBottom: 0 }}>
        Load the design system <strong>theme CSS</strong> so variables are defined on{' '}
        <code style={{ fontSize: '0.9em' }}>:root</code> (or your theme root). Use the same{' '}
        <strong>brand</strong> and <strong>light/dark</strong> mode as in Storybook when you copy a
        token from a swatch.
      </p>
    </div>
  );
}
