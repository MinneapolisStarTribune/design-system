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

const tableStyle: React.CSSProperties = {
  width: '100%',
  borderCollapse: 'collapse',
  fontSize: '0.875rem',
  marginBottom: '1rem',
};

const thTdStyle: React.CSSProperties = {
  border: '1px solid rgba(0, 0, 0, 0.12)',
  padding: '0.5rem 0.65rem',
  textAlign: 'left',
  verticalAlign: 'top',
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

      <h4 style={{ marginTop: '1.25rem', marginBottom: '0.5rem' }}>
        Naming CSS variables and <code style={{ fontSize: '0.9em' }}>color</code> props
      </h4>
      <p style={{ marginBottom: '0.5rem', fontSize: '0.875rem' }}>
        The <strong>token portion</strong> of the CSS variable (e.g.{' '}
        <code style={{ fontSize: '0.9em' }}>brand-01</code> in{' '}
        <code style={{ fontSize: '0.9em' }}>--color-text-brand-01</code>) matches the value you pass
        to a component’s <code style={{ fontSize: '0.9em' }}>color</code> prop.
      </p>
      <p style={{ marginBottom: '0.5rem', fontSize: '0.875rem' }}>
        For components that render text (headings, body copy, labels, etc.), you can use any text
        color token based on context—brand, on-light/on-dark, or state (TypeScript:{' '}
        <code style={{ fontSize: '0.9em' }}>TextColor</code>; see{' '}
        <a href="?path=/docs/foundations-colors-text-colors--docs">
          Foundations → Colors → Text Colors
        </a>{' '}
        for all options).
      </p>
      <p style={{ marginBottom: '0.65rem', fontSize: '0.875rem' }}>
        <strong>Button</strong> is an exception: it only accepts a limited set of values (
        <code style={{ fontSize: '0.9em' }}>brand</code>,{' '}
        <code style={{ fontSize: '0.9em' }}>neutral</code>,{' '}
        <code style={{ fontSize: '0.9em' }}>brand-accent</code>).
      </p>
      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={thTdStyle}>Category</th>
            <th style={thTdStyle}>
              Typical <code style={{ fontSize: '0.85em' }}>color</code> prop
            </th>
            <th style={thTdStyle}>CSS variable pattern</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={thTdStyle}>Text colors</td>
            <td style={thTdStyle}>
              Any text token key (examples: <code style={{ fontSize: '0.85em' }}>brand-01</code>,{' '}
              <code style={{ fontSize: '0.85em' }}>on-light-primary</code>,{' '}
              <code style={{ fontSize: '0.85em' }}>state-attention-on-dark</code>, …)
            </td>
            <td style={thTdStyle}>
              <code style={{ fontSize: '0.85em' }}>{'--color-text-{token}'}</code>
              <br />
              <span style={{ fontSize: '0.8em', opacity: 0.9 }}>e.g. </span>
              <code style={{ fontSize: '0.8em' }}>--color-text-brand-01</code>
            </td>
          </tr>
          <tr>
            <td style={thTdStyle}>Icon</td>
            <td style={thTdStyle}>Same keys as text</td>
            <td style={thTdStyle}>
              <code style={{ fontSize: '0.85em' }}>{'--color-icon-{token}'}</code>
              <br />
              <span style={{ fontSize: '0.8em', opacity: 0.9 }}>e.g. </span>
              <code style={{ fontSize: '0.8em' }}>--color-icon-on-light-primary</code>
            </td>
          </tr>
          <tr>
            <td style={thTdStyle}>Button</td>
            <td style={thTdStyle}>
              <code style={{ fontSize: '0.85em' }}>neutral</code>,{' '}
              <code style={{ fontSize: '0.85em' }}>brand</code>,{' '}
              <code style={{ fontSize: '0.85em' }}>brand-accent</code>
            </td>
            <td style={thTdStyle}>
              <code style={{ fontSize: '0.85em' }}>--color-button-…</code> (filled / outlined /
              ghost; see swatches)
            </td>
          </tr>
        </tbody>
      </table>
      <p style={{ marginBottom: '0.75rem', fontSize: '0.875rem' }}>
        <span style={{ opacity: 0.88 }}>Text colors, end-to-end: </span>
        <code style={{ fontSize: '0.85em' }}>brand-01</code>
        {' → '}
        <code style={{ fontSize: '0.85em' }}>color=&quot;brand-01&quot;</code>
        {' → '}
        <code style={{ fontSize: '0.85em' }}>--color-text-brand-01</code>
      </p>
      <p style={{ marginBottom: '0.75rem', fontSize: '0.875rem' }}>
        In raw CSS, use the variable from the swatch. In React, prefer the component{' '}
        <code style={{ fontSize: '0.9em' }}>color</code> prop when the component supports it—those
        props map to the same variables under the hood.
      </p>

      <h4 style={{ marginTop: '1.25rem', marginBottom: '0.5rem' }}>Classes vs. token keys</h4>
      <p style={{ marginBottom: '0.5rem', fontSize: '0.875rem' }}>
        <code style={{ fontSize: '0.9em' }}>brand-01</code> is a <strong>token key</strong>, not a
        global utility class. There is no <code style={{ fontSize: '0.9em' }}>.brand-01</code>{' '}
        class—this value is used with the <code style={{ fontSize: '0.9em' }}>color</code> prop or
        maps to CSS variables like <code style={{ fontSize: '0.9em' }}>--color-text-brand-01</code>.
      </p>
      <p style={{ marginBottom: '0.35rem', fontSize: '0.875rem', fontWeight: 600 }}>
        For text and icon colors:
      </p>
      <ul
        style={{
          marginTop: 0,
          marginBottom: '0.75rem',
          paddingLeft: '1.25rem',
          fontSize: '0.875rem',
        }}
      >
        <li style={{ marginBottom: '0.35rem' }}>
          Use the <code style={{ fontSize: '0.9em' }}>color</code> prop (e.g.{' '}
          <code style={{ fontSize: '0.9em' }}>brand-01</code>)
        </li>
        <li style={{ marginBottom: 0 }}>
          Or use CSS variables (<code style={{ fontSize: '0.9em' }}>var(--color-text-*)</code> /{' '}
          <code style={{ fontSize: '0.9em' }}>var(--color-icon-*)</code>)
        </li>
      </ul>
      <p style={{ marginBottom: '0.75rem', fontSize: '0.875rem' }}>
        Typography classes (e.g. <code style={{ fontSize: '0.9em' }}>typography-*</code>) only
        control font styles. They apply a default text color (
        <code style={{ fontSize: '0.9em' }}>--color-text-on-light-primary</code>), which can be
        overridden via the <code style={{ fontSize: '0.9em' }}>color</code> prop.
      </p>
      <p style={{ marginBottom: '0.75rem', fontSize: '0.875rem' }}>
        Some components (e.g. <strong>Button</strong>) use module classes for variants like{' '}
        <code style={{ fontSize: '0.9em' }}>brand</code>,{' '}
        <code style={{ fontSize: '0.9em' }}>neutral</code>, or{' '}
        <code style={{ fontSize: '0.9em' }}>brand-accent</code>. These are not the same as semantic
        color tokens like <code style={{ fontSize: '0.9em' }}>brand-01</code>.
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
