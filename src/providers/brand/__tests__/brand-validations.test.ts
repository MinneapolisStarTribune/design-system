import { validateComponentForBrand } from '../brand-validations';

describe('validateComponentForBrand', () => {
  it('should throw an error when the component is not supported for the brand', () => {
    const componentName = 'EnterpriseHeading';
    const brand = 'varsity';

    expect(() => {
      validateComponentForBrand(componentName, brand);
    }).toThrow(`[Brand Validation] "${componentName}" is not supported for "${brand}".`);
  });

  it('should not throw an error when the component is supported for the brand', () => {
    const componentName = 'EnterpriseHeading';
    const brand = 'startribune';

    expect(() => {
      validateComponentForBrand(componentName, brand);
    }).not.toThrow();
  });
});
