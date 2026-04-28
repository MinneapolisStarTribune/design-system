import { render, screen } from '@testing-library/react-native';
import { Text } from 'react-native';
import { SocialEmbeds } from './SocialEmbeds.native';

describe('SocialEmbeds (native)', () => {
  it('renders children content', () => {
    render(
      <SocialEmbeds>
        <Text>Embedded content</Text>
      </SocialEmbeds>
    );

    expect(screen.getByText('Embedded content')).toBeOnTheScreen();
  });

  it('uses default testID when none is provided', () => {
    render(
      <SocialEmbeds>
        <Text>Embed</Text>
      </SocialEmbeds>
    );

    expect(screen.getByTestId('social-embeds')).toBeOnTheScreen();
  });

  it('uses custom testID when provided', () => {
    render(
      <SocialEmbeds dataTestId="social-embeds-custom">
        <Text>Embed</Text>
      </SocialEmbeds>
    );

    expect(screen.getByTestId('social-embeds-custom')).toBeOnTheScreen();
  });

  it('passes accessibility label to container', () => {
    render(
      <SocialEmbeds accessibilityLabel="Social embed container">
        <Text>Embed</Text>
      </SocialEmbeds>
    );

    expect(screen.getByLabelText('Social embed container')).toBeOnTheScreen();
  });
});
