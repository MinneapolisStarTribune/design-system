import { render, screen } from '@testing-library/react-native';
import { Text } from 'react-native';
import { TestWrapperInDesignSystemProvider } from '@/test-utils/wrappers';
import { InlineVideo } from './InlineVideo.native';

const wrapper = TestWrapperInDesignSystemProvider();

describe('InlineVideo Accessibility (native)', () => {
  it('renders the video player slot for assistive tech', () => {
    render(
      <InlineVideo dataTestId="inline-video-a11y">
        <Text>Accessible video player</Text>
      </InlineVideo>
    );

    expect(screen.getByTestId('inline-video-a11y')).toBeOnTheScreen();
    expect(screen.getByText('Accessible video player')).toBeOnTheScreen();
  });

  it('exposes caption and credit text for assistive tech', () => {
    render(
      <InlineVideo
        dataTestId="inline-video-a11y"
        caption="General Manager interview"
        videoCredit="Rebecca McApline/Star Tribune"
      />,
      { wrapper }
    );

    expect(
      screen.getByText('General Manager interview (Rebecca McApline/Star Tribune)')
    ).toBeOnTheScreen();
  });

  it('maps aria-label to accessibilityLabel on the root', () => {
    render(
      <InlineVideo dataTestId="inline-video-a11y" aria-label="Video: General Manager interview" />
    );

    const root = screen.getByTestId('inline-video-a11y');
    expect(root.props.accessibilityLabel).toBe('Video: General Manager interview');
  });

  it('maps aria-hidden to hide the subtree from the accessibility tree', () => {
    render(<InlineVideo dataTestId="inline-video-a11y" aria-hidden />);

    const root = screen.getByTestId('inline-video-a11y', { includeHiddenElements: true });
    expect(root.props.accessibilityElementsHidden).toBe(true);
    expect(root.props.importantForAccessibility).toBe('no-hide-descendants');
  });

  it('uses auto importantForAccessibility when not aria-hidden', () => {
    render(<InlineVideo dataTestId="inline-video-a11y" />);

    const root = screen.getByTestId('inline-video-a11y');
    expect(root.props.importantForAccessibility).toBe('auto');
  });
});
