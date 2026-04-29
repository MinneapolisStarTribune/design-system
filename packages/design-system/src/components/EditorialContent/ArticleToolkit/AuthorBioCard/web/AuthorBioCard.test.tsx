import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { AuthorBioCard } from './AuthorBioCard';

describe('AuthorBioCard', () => {
  it('renders required description', () => {
    render(<AuthorBioCard description="Test description" />);

    expect(screen.getByText('Test description')).toBeInTheDocument();
  });

  it('renders label with correct heading level', () => {
    render(<AuthorBioCard label="Author" description="Test" headingLevel="h3" />);

    const heading = screen.getByRole('heading', { name: 'Author' });
    expect(heading.tagName.toLowerCase()).toBe('h3');
  });

  it('renders name and position when provided', () => {
    render(<AuthorBioCard name="John Doe" position="Staff Writer" description="Test" />);

    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Staff Writer')).toBeInTheDocument();
  });

  it('renders image when thumbnailIcon is provided', () => {
    render(
      <AuthorBioCard
        thumbnailIcon="https://example.com/image.jpg"
        thumbnailIconAlt="author image"
        description="Test"
      />
    );

    const img = screen.getByRole('img');
    expect(img).toHaveAttribute('src', 'https://example.com/image.jpg');
    expect(img).toHaveAttribute('alt', 'author image');
  });

  it('renders default alt text when alt is not provided', () => {
    render(<AuthorBioCard thumbnailIcon="https://example.com/image.jpg" description="Test" />);

    const img = screen.getByTestId('image');
    expect(img).toHaveAttribute('alt', '');
  });

  it('does not render image when thumbnailIcon is not provided', () => {
    render(<AuthorBioCard description="Test" />);

    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });

  it('renders CTA link when valid ctaLink is provided', () => {
    render(<AuthorBioCard description="Test" ctaLink={{ label: 'Read more', link: '/profile' }} />);

    const link = screen.getByRole('link', { name: 'Read more' });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/profile');
  });

  it('calls onClick when CTA is clicked', () => {
    const onClick = vi.fn();

    render(<AuthorBioCard description="Test" ctaLink={{ label: 'Click me', onClick }} />);

    screen.getByRole('link', { name: 'Click me' }).click();

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('renders CTA with default label "See More" when label is empty', () => {
    render(<AuthorBioCard description="Test" ctaLink={{ label: '', link: '/profile' }} />);

    const link = screen.getByRole('link', { name: 'See More' });

    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/profile');
  });

  it('applies custom dataTestId', () => {
    render(<AuthorBioCard description="Test" dataTestId="custom-id" />);

    expect(screen.getByTestId('custom-id')).toBeInTheDocument();
  });

  it('applies aria attributes correctly', () => {
    render(
      <AuthorBioCard
        description="Test"
        aria-label="author card"
        aria-describedby="desc-id"
        aria-hidden
      />
    );

    const root = screen.getByTestId('author-bio-card');

    expect(root).toHaveAttribute('aria-label', 'author card');
    expect(root).toHaveAttribute('aria-describedby', 'desc-id');
    expect(root).toHaveAttribute('aria-hidden', 'true');
  });

  it('renders with top and bottom borders', () => {
    const { container } = render(<AuthorBioCard description="Test" hasTopBorder hasBottomBorder />);

    const root = container.firstChild as HTMLElement;

    expect(root.className).toContain('borderTop');
    expect(root.className).toContain('borderBottom');
  });

  it('renders without optional fields', () => {
    render(<AuthorBioCard description="Only description" />);

    expect(screen.getByText('Only description')).toBeInTheDocument();
  });

  it('renders default label when label is not provided', () => {
    render(<AuthorBioCard description="Test" headingLevel="h3" />);

    const heading = screen.getByRole('heading', { name: 'ABOUT THE AUTHOR' });
    expect(heading).toBeInTheDocument();
    expect(heading.tagName.toLowerCase()).toBe('h3');
  });

  it('does not render heading when label is empty', () => {
    render(<AuthorBioCard label="" description="Test" />);

    expect(screen.queryByRole('heading')).not.toBeInTheDocument();
  });
});
