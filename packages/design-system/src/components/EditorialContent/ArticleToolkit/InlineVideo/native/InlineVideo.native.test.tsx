import { render, screen } from '@testing-library/react-native';
import { Text } from 'react-native';
import { InlineVideo } from './InlineVideo.native';

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
});
