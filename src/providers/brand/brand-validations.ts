import { ComponentName } from '@/types/component-names';
import { Brand, BRANDS } from '../theme-helpers';

/**
 * Components that are not supported in Star Tribune.
 */
export const STAR_TRIBUNE_UNSUPPORTED_COMPONENTS: readonly ComponentName[] = [
  // Add component names that Star Tribune doesn't support
] as const;

/**
 * Components that are not supported in Varsity.
 */
export const VARSITY_UNSUPPORTED_COMPONENTS: readonly ComponentName[] = [
  // Add component names that Varsity doesn't support
  'EnterpriseHeading',
] as const;

/**
 * Map of brands to their unsupported components.
 */
const UNSUPPORTED_COMPONENTS_BY_BRAND: Partial<Record<Brand, readonly ComponentName[]>> = {
  startribune: STAR_TRIBUNE_UNSUPPORTED_COMPONENTS,
  varsity: VARSITY_UNSUPPORTED_COMPONENTS,
};

/**
 * Validates that a component is supported for the given brand.
 *
 * @param componentName Name of the component being rendered
 * @param brand Current brand
 * @returns void
 * @throws {Error} when the component is not supported for the brand
 */
export function validateComponentForBrand(componentName: ComponentName, brand: Brand): void {
  const unsupportedComponents = getUnsupportedComponentsForBrand(brand);

  if (unsupportedComponents.includes(componentName)) {
    const supportedBrands = getSupportedBrandsForComponent(componentName);

    throw new Error(
      `[Brand Validation] "${componentName}" is not supported for "${brand}". ` +
        `Supported brands: ${supportedBrands.join(', ')}.`
    );
  }
}

/**
 * Gets the list of unsupported components for a brand.
 *
 * @param brand Brand to check
 * @returns Array of unsupported component names
 */
function getUnsupportedComponentsForBrand(brand: Brand): readonly ComponentName[] {
  return UNSUPPORTED_COMPONENTS_BY_BRAND[brand] ?? [];
}

/**
 * Gets all brands that support a given component.
 *
 * @param componentName Name of the component
 * @returns Array of brands where the component is supported
 */
function getSupportedBrandsForComponent(componentName: ComponentName): Brand[] {
  return BRANDS.filter((brand) => {
    const unsupported = getUnsupportedComponentsForBrand(brand);
    return !unsupported.includes(componentName);
  });
}
