import { validateComponentForBrand } from '../brand-validations';

describe('validateComponentForBrand', () => {
  it('should throw when EnterpriseHeading is used with varsity brand', () => {
    expect(() => validateComponentForBrand('EnterpriseHeading', 'varsity')).toThrow(
      `[Brand Validation] "EnterpriseHeading" is not supported for "varsity".`
    );
  });

  it('should not throw when EnterpriseHeading is used with startribune brand', () => {
    expect(() => validateComponentForBrand('EnterpriseHeading', 'startribune')).not.toThrow();
  });

  it('should throw when NonNewsHeading is used with varsity brand', () => {
    expect(() => validateComponentForBrand('NonNewsHeading', 'varsity')).toThrow(
      `[Brand Validation] "NonNewsHeading" is not supported for "varsity".`
    );
  });

  it('should not throw when NonNewsHeading is used with startribune brand', () => {
    expect(() => validateComponentForBrand('NonNewsHeading', 'startribune')).not.toThrow();
  });

  it('should throw when SponsoredHeading is used with varsity brand', () => {
    expect(() => validateComponentForBrand('SponsoredHeading', 'varsity')).toThrow(
      `[Brand Validation] "SponsoredHeading" is not supported for "varsity".`
    );
  });

  it('should not throw when SponsoredHeading is used with startribune brand', () => {
    expect(() => validateComponentForBrand('SponsoredHeading', 'startribune')).not.toThrow();
  });

  it('should not throw when NewsHeading is used with either brand', () => {
    expect(() => validateComponentForBrand('NewsHeading', 'startribune')).not.toThrow();
    expect(() => validateComponentForBrand('NewsHeading', 'varsity')).not.toThrow();
  });

  it('should not throw when OpinionHeading is used with either brand', () => {
    expect(() => validateComponentForBrand('OpinionHeading', 'startribune')).not.toThrow();
    expect(() => validateComponentForBrand('OpinionHeading', 'varsity')).not.toThrow();
  });
});
