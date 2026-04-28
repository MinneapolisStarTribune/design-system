import { render, screen } from '@testing-library/react-native';
import { Text } from 'react-native';
import { TestWrapperInDesignSystemProvider } from '@/test-utils/wrappers';
import { InlineVideo } from './InlineVideo.native';

const wrapper = TestWrapperInDesignSystemProvider();

describe('InlineVideo (native)', () => {
  it('renders with the default test id', () => {
    render(<InlineVideo />);

    expect(screen.getByTestId('inline-video')).toBeOnTheScreen();
  });

  it('renders with a custom test id', () => {
    render(<InlineVideo dataTestId="custom-inline-video" />);

    expect(screen.getByTestId('custom-inline-video')).toBeOnTheScreen();
  });

  it('renders the video player slot', () => {
    render(
      <InlineVideo dataTestId="inline-video-test">
        <Text>Native video player</Text>
      </InlineVideo>
    );

    expect(screen.getByText('Native video player')).toBeOnTheScreen();
  });

  it('forwards native view styles to the root', () => {
    const style = { marginTop: 16 };

    render(<InlineVideo dataTestId="inline-video-test" style={style} />);

    expect(screen.getByTestId('inline-video-test').props.style).toEqual(style);
  });

  it('renders the caption', () => {
    render(<InlineVideo dataTestId="inline-video-test" caption="Video caption" />, { wrapper });

    expect(screen.getByTestId('inline-video-test-caption')).toBeOnTheScreen();
    expect(screen.getByText('Video caption')).toBeOnTheScreen();
  });

  it('renders the video credit', () => {
    render(<InlineVideo dataTestId="inline-video-test" videoCredit="Video credit" />, { wrapper });

    expect(screen.getByTestId('inline-video-test-caption')).toBeOnTheScreen();
    expect(screen.getByText('(Video credit)')).toBeOnTheScreen();
  });

  it('renders the caption and video credit', () => {
    render(
      <InlineVideo
        dataTestId="inline-video-test"
        caption="Video caption"
        videoCredit="Video credit"
      />,
      { wrapper }
    );

    expect(screen.getByText('Video caption (Video credit)')).toBeOnTheScreen();
  });

  it('does not render the caption when caption and video credit are empty', () => {
    render(<InlineVideo dataTestId="inline-video-test" caption="" videoCredit="" />, { wrapper });

    expect(screen.queryByTestId('inline-video-test-caption')).not.toBeOnTheScreen();
  });
});
