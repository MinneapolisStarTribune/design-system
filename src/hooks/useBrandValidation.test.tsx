import { render } from '@testing-library/react';
import { useBrandValidation } from '@/hooks/useBrandValidation';
import { DesignSystemContext } from '@/providers/DesignSystemContext';
import { ComponentName } from '@/types/component-names';

const TestComponent = ({ componentName }: { componentName: ComponentName }) => {
  useBrandValidation(componentName);
  return <div>Test Component</div>;
};

describe('useBrandValidation', () => {
  it('throws when used outside DesignSystemProvider', () => {
    expect(() => render(<TestComponent componentName="NewsHeading" />)).toThrow(
      `"NewsHeading" must be used within DesignSystemProvider.`
    );
  });

  it('does not throw when the component is supported for the brand', () => {
    expect(() =>
      render(
        <DesignSystemContext.Provider value={{ brand: 'startribune', colorScheme: 'light' }}>
          <TestComponent componentName="NewsHeading" />
        </DesignSystemContext.Provider>
      )
    ).not.toThrow();
  });

  it('does not throw when NewsHeading is used with varsity brand', () => {
    expect(() =>
      render(
        <DesignSystemContext.Provider value={{ brand: 'varsity', colorScheme: 'light' }}>
          <TestComponent componentName="NewsHeading" />
        </DesignSystemContext.Provider>
      )
    ).not.toThrow();
  });
});
