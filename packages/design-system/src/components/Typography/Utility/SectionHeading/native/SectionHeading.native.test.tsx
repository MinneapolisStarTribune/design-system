import { render, screen } from '@testing-library/react-native';
import { nativeTokenFixtures } from '@/test-utils/nativeTokenFixtures';
import { TestWrapperInDesignSystemProvider } from '@/test-utils/wrappers';
import { SectionHeading } from './SectionHeading.native';
import { SECTION_HEADING_IMPORTANCE_LEVELS } from '../SectionHeading.types';

describe('SectionHeading (native)', () => {
  it('renders with importance 1', () => {
    const wrapper = TestWrapperInDesignSystemProvider({ brand: 'startribune' });
    render(<SectionHeading importance={1}>Heading content</SectionHeading>, { wrapper });
    expect(screen.getByText('Heading content')).toBeOnTheScreen();
  });

  it.each(SECTION_HEADING_IMPORTANCE_LEVELS)('renders importance %s', (importance) => {
    const wrapper = TestWrapperInDesignSystemProvider({ brand: 'startribune' });
    render(<SectionHeading importance={importance}>Heading - {importance}</SectionHeading>, {
      wrapper,
    });
    expect(screen.getByText(`Heading - ${importance}`)).toBeOnTheScreen();
  });

  it('uses utility section heading tokens', () => {
    const wrapper = TestWrapperInDesignSystemProvider({ brand: 'startribune' });
    render(<SectionHeading importance={1}>Section heading</SectionHeading>, { wrapper });

    const element = screen.getByText('Section heading');
    expect(element.props.style).toEqual(
      expect.objectContaining(
        nativeTokenFixtures.startribune.light.typography.typographyUtilitySectionH1
      )
    );
  });
});
