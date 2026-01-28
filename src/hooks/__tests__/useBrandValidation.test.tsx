import { render } from '@testing-library/react';
import { useBrandValidation } from '../useBrandValidation';
import { BrandContext } from '@/providers/brand/BrandContext';
import { ComponentName } from '@/types/component-names';

const TestComponent = ({ componentName }: { componentName: ComponentName }) => {
  useBrandValidation(componentName);
  return <div>Test Component</div>;
};

describe('useBrandValidation', () => {
  it('throws when used outside DesignSystemProvider', () => {
    expect(() => render(<TestComponent componentName="EnterpriseHeading" />)).toThrow(
      `"EnterpriseHeading" must be used within DesignSystemProvider.`
    );
  });

  it('does not throw when used the component is supported for the brand', () => {
    expect(() =>
      render(
        <BrandContext.Provider value="startribune">
          <TestComponent componentName="EnterpriseHeading" />
        </BrandContext.Provider>
      )
    ).not.toThrow();
  });

  it('throws when the component is not supported for the brand', () => {
    expect(() =>
      render(
        <BrandContext.Provider value="varsity">
          <TestComponent componentName="EnterpriseHeading" />
        </BrandContext.Provider>
      )
    ).toThrow(`"EnterpriseHeading" is not supported for "varsity".`);
  });
});
