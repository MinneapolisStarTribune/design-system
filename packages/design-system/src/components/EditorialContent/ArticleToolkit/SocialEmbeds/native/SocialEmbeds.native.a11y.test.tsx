import { render, screen } from '@testing-library/react-native';
import { Text } from 'react-native';
import { SocialEmbeds } from './SocialEmbeds.native';

describe('SocialEmbeds Accessibility (native)', () => {
  it('exposes labelled container for assistive tech', () => {
    render(
      <SocialEmbeds accessibilityLabel="Instagram embed">
        <Text>Embedded post</Text>
      </SocialEmbeds>
    );

    expect(screen.getByLabelText('Instagram embed')).toBeOnTheScreen();
  });

  it('keeps child content readable by screen readers', () => {
    render(
      <SocialEmbeds accessibilityLabel="Social embed">
        <Text>Read this embedded post</Text>
      </SocialEmbeds>
    );

    expect(screen.getByText('Read this embedded post')).toBeOnTheScreen();
  });
});
