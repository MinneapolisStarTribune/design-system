/**
 * Helper function to create a design system error message
 *
 * @param component - The component name (e.g., 'Button', 'Icon')
 * @param message - The error message
 * @returns Formatted error message with prefix
 *
 * @example
 * throw new Error(createDesignSystemError('Button', 'x-small size is only valid for icon-only buttons.'));
 */
export function createDesignSystemError(component: string, message: string): string {
  return `[SUS Design System] ${component}: ${message}`;
}
