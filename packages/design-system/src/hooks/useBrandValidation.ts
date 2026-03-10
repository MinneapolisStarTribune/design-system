import { validateComponentForBrand } from '@/providers/brand/brand-validations';
import { BRAND_VALIDATION_ERROR_PREFIX } from '@/providers/BrandValidationErrorBoundary.constants';
import { DesignSystemContext } from '@/providers/DesignSystemContext';
import { ComponentName } from '@/types/component-names';
import { useContext } from 'react';

/**
 * Validates that a component is allowed for the current brand.
 *
 * @param componentName Name of the component being rendered
 * @returns void
 * @throws {Error} when used outside DesignSystemProvider or unsupported by brand
 * @example
 * function MyComponent() {
 *   useBrandValidation('MyComponent');
 *   // ... component logic
 *
 *   return <div>My Component</div>;
 * }
 */
export function useBrandValidation(componentName: ComponentName): void {
  const ctx = useContext(DesignSystemContext);

  if (!ctx) {
    throw new Error(
      `${BRAND_VALIDATION_ERROR_PREFIX} "${componentName}" must be used within DesignSystemProvider.`
    );
  }

  // Throws immediately if component usage is invalid
  validateComponentForBrand(componentName, ctx.brand);
}
