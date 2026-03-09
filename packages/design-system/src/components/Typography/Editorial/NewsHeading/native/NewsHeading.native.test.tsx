import { render, screen } from '@testing-library/react-native';
import { nativeTokenFixtures } from '@/test-utils/nativeTokenFixtures';
import { TestWrapperInDesignSystemProvider } from '@/test-utils/wrappers';
import { NewsHeading } from './NewsHeading.native';
import { NEWS_HEADING_IMPORTANCE_LEVELS } from '../NewsHeading.types';

describe('NewsHeading (native)', () => {
  it('renders with importance 1', () => {
    const wrapper = TestWrapperInDesignSystemProvider({ brand: 'startribune' });
    render(<NewsHeading importance={1}>Heading content</NewsHeading>, { wrapper });
    expect(screen.getByText('Heading content')).toBeOnTheScreen();
  });

  it.each(NEWS_HEADING_IMPORTANCE_LEVELS)('renders importance %s', (importance) => {
    const wrapper = TestWrapperInDesignSystemProvider({ brand: 'startribune' });
    render(<NewsHeading importance={importance}>Heading - {importance}</NewsHeading>, { wrapper });
    expect(screen.getByText(`Heading - ${importance}`)).toBeOnTheScreen();
  });

  it('uses Star Tribune news heading tokens', () => {
    const wrapper = TestWrapperInDesignSystemProvider({ brand: 'startribune' });
    render(<NewsHeading importance={1}>News</NewsHeading>, { wrapper });

    const element = screen.getByText('News');
    expect(element.props.style).toEqual(
      expect.objectContaining(
        nativeTokenFixtures.startribune.light.typography.typographyEditorialNewsH1
      )
    );
  });

  it('renders without throwing on varsity (News supported for both)', () => {
    const wrapper = TestWrapperInDesignSystemProvider({ brand: 'varsity' });
    expect(() => render(<NewsHeading importance={1}>News</NewsHeading>, { wrapper })).not.toThrow();
  });
});
