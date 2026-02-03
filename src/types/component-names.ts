/**
 * List of all component names in the design system.
 *
 * All component names must be reflected here.
 * @remarks Used for brand validation and enforcement.
 */
export const COMPONENT_NAMES = ['EnterpriseHeading'] as const;

export type ComponentName = (typeof COMPONENT_NAMES)[number];
