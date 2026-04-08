import { render, screen } from '@testing-library/react';
import { SocialEmbeds } from '../web/SocialEmbeds';

describe('SocialEmbeds', () => {
  it('renders children correctly', () => {
    render(
      <SocialEmbeds>
        <div data-testid="child">Mock Embed</div>
      </SocialEmbeds>
    );

    expect(screen.getByTestId('child')).toBeInTheDocument();
  });

  it('applies default variant (standard)', () => {
    render(
      <SocialEmbeds>
        <div>Content</div>
      </SocialEmbeds>
    );

    const container = screen.getByTestId('social-embeds');
    expect(container.className).toContain('variant-standard');
  });

  it('applies custom variant class', () => {
    render(
      <SocialEmbeds variant="inline">
        <div>Content</div>
      </SocialEmbeds>
    );

    const container = screen.getByTestId('social-embeds');
    expect(container.className).toContain('variant-inline');
  });

  it('adds platform data attribute', () => {
    render(
      <SocialEmbeds platform="instagram">
        <div>Content</div>
      </SocialEmbeds>
    );

    const container = screen.getByTestId('social-embeds');
    expect(container).toHaveAttribute('data-platform', 'instagram');
  });

  it('applies custom className', () => {
    render(
      <SocialEmbeds className="custom-class">
        <div>Content</div>
      </SocialEmbeds>
    );

    const container = screen.getByTestId('social-embeds');
    expect(container.className).toContain('custom-class');
  });
});
