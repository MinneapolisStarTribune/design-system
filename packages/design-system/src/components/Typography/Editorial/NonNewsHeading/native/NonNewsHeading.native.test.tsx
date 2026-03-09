import { render, screen } from '@testing-library/react-native';
import { nativeTokenFixtures } from '@/test-utils/nativeTokenFixtures';
import { TestWrapperInDesignSystemProvider } from '@/test-utils/wrappers';
import { NonNewsHeading } from './NonNewsHeading.native';
import { NON_NEWS_HEADING_IMPORTANCE_LEVELS } from '../NonNewsHeading.types';

describe('NonNewsHeading (native)', () => {
  it('renders with importance 1', () => {
    const wrapper = TestWrapperInDesignSystemProvider({ brand: 'startribune' });
    render(<NonNewsHeading importance={1}>Heading content</NonNewsHeading>, { wrapper });
    expect(screen.getByText('Heading content')).toBeOnTheScreen();
  });

  it.each(NON_NEWS_HEADING_IMPORTANCE_LEVELS)('renders importance %s', (importance) => {
    const wrapper = TestWrapperInDesignSystemProvider({ brand: 'startribune' });
    render(<NonNewsHeading importance={importance}>Heading - {importance}</NonNewsHeading>, {
      wrapper,
    });
    expect(screen.getByText(`Heading - ${importance}`)).toBeOnTheScreen();
  });

  it('uses Star Tribune non-news heading tokens', () => {
    const wrapper = TestWrapperInDesignSystemProvider({ brand: 'startribune' });
    render(<NonNewsHeading importance={1}>Non-news</NonNewsHeading>, { wrapper });

    const element = screen.getByText('Non-news');
    expect(element.props.style).toEqual(
      expect.objectContaining(
        nativeTokenFixtures.startribune.light.typography.typographyEditorialNonNewsH1
      )
    );
  });

  it('throws on varsity (NonNewsHeading is Star Tribune only)', () => {
    const wrapper = TestWrapperInDesignSystemProvider({ brand: 'varsity' });
    expect(() =>
      render(<NonNewsHeading importance={1}>Non-news</NonNewsHeading>, { wrapper })
    ).toThrow();
  });
});
