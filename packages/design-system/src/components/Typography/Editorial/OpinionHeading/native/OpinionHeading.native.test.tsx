import { render, screen } from '@testing-library/react-native';
import { nativeTokenFixtures } from '@/test-utils/nativeTokenFixtures';
import { TestWrapperInDesignSystemProvider } from '@/test-utils/wrappers';
import { OpinionHeading } from './OpinionHeading.native';
import { OPINION_HEADING_IMPORTANCE_LEVELS } from '../OpinionHeading.types';

describe('OpinionHeading (native)', () => {
  it('renders with importance 1', () => {
    const wrapper = TestWrapperInDesignSystemProvider({ brand: 'startribune' });
    render(<OpinionHeading importance={1}>Heading content</OpinionHeading>, { wrapper });
    expect(screen.getByText('Heading content')).toBeOnTheScreen();
  });

  it.each(OPINION_HEADING_IMPORTANCE_LEVELS)('renders importance %s', (importance) => {
    const wrapper = TestWrapperInDesignSystemProvider({ brand: 'startribune' });
    render(<OpinionHeading importance={importance}>Heading - {importance}</OpinionHeading>, {
      wrapper,
    });
    expect(screen.getByText(`Heading - ${importance}`)).toBeOnTheScreen();
  });

  it('uses opinion heading tokens', () => {
    const wrapper = TestWrapperInDesignSystemProvider({ brand: 'startribune' });
    render(<OpinionHeading importance={1}>Opinion</OpinionHeading>, { wrapper });

    const element = screen.getByText('Opinion');
    expect(element.props.style).toEqual(
      expect.objectContaining(
        nativeTokenFixtures.startribune.light.typography.typographyEditorialOpinionH1
      )
    );
  });
});
