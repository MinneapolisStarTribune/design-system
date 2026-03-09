import { render, screen } from '@testing-library/react-native';
import { nativeTokenFixtures } from '@/test-utils/nativeTokenFixtures';
import { TestWrapperInDesignSystemProvider } from '@/test-utils/wrappers';
import { EnterpriseHeading } from './EnterpriseHeading.native';
import { ENTERPRISE_HEADING_IMPORTANCE_LEVELS } from '../EnterpriseHeading.types';

describe('EnterpriseHeading (native)', () => {
  it('renders with importance 1', () => {
    const wrapper = TestWrapperInDesignSystemProvider({ brand: 'startribune' });
    render(<EnterpriseHeading importance={1}>Heading content</EnterpriseHeading>, { wrapper });
    expect(screen.getByText('Heading content')).toBeOnTheScreen();
  });

  it.each(ENTERPRISE_HEADING_IMPORTANCE_LEVELS)('renders importance %s', (importance) => {
    const wrapper = TestWrapperInDesignSystemProvider({ brand: 'startribune' });
    render(<EnterpriseHeading importance={importance}>Heading - {importance}</EnterpriseHeading>, {
      wrapper,
    });
    expect(screen.getByText(`Heading - ${importance}`)).toBeOnTheScreen();
  });

  it('uses Star Tribune enterprise heading tokens', () => {
    const wrapper = TestWrapperInDesignSystemProvider({ brand: 'startribune' });
    render(<EnterpriseHeading importance={1}>Enterprise</EnterpriseHeading>, { wrapper });

    const element = screen.getByText('Enterprise');
    expect(element.props.style).toEqual(
      expect.objectContaining(
        nativeTokenFixtures.startribune.light.typography.typographyEditorialEnterpriseH1
      )
    );
  });

  it('throws when brand is varsity (EnterpriseHeading is Star Tribune only)', () => {
    const wrapper = TestWrapperInDesignSystemProvider({ brand: 'varsity' });
    expect(() =>
      render(<EnterpriseHeading importance={1}>Enterprise</EnterpriseHeading>, { wrapper })
    ).toThrow();
  });
});
