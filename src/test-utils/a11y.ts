import { render } from '@testing-library/react';
import { axe } from 'vitest-axe';
import type { RenderResult } from '@testing-library/react';
import type { RunOptions } from 'axe-core';

/**
 * Test a component for accessibility violations
 * @param ui React element to test
 * @returns Promise that resolves when test completes
 */
export async function expectNoA11yViolations(ui: React.ReactElement) {
  const { container } = render(ui);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
}

/**
 * Test a component for accessibility violations with custom axe options
 * @param ui React element to test
 * @param options Axe run options
 * @returns Promise that resolves when test completes
 */
export async function expectNoA11yViolationsWithOptions(
  ui: React.ReactElement,
  options: RunOptions
) {
  const { container } = render(ui);
  const results = await axe(container, options);
  expect(results).toHaveNoViolations();
}

/**
 * Render component and return both the render result and a function to check a11y
 * Useful when you need to interact with the component before checking
 */
export async function renderAndCheckA11y(ui: React.ReactElement): Promise<{
  renderResult: RenderResult;
  checkA11y: () => Promise<void>;
}> {
  const renderResult = render(ui);

  const checkA11y = async () => {
    const results = await axe(renderResult.container);
    expect(results).toHaveNoViolations();
  };

  return { renderResult, checkA11y };
}
