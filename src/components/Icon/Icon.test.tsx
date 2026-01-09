import { render } from '@testing-library/react';
import { Icon } from './Icon';

describe('Icon', () => {
  it('renders a valid icon', () => {
    const { container } = render(<Icon name="camera-filled" />);
    expect(container.querySelector('svg')).toBeInTheDocument();
  });

  it('applies color when provided', () => {
    const { container } = render(<Icon name="camera-filled" color="on-light-primary" />);
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
    // Check that the color is applied (CSS variable format)
    expect(svg?.getAttribute('fill')).toBe('var(--color-icon-on-light-primary)');
  });

  it('applies size when provided', () => {
    const { container } = render(<Icon name="camera-filled" size="large" />);
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
    // Check that the size is applied
    expect(svg?.getAttribute('width')).toBe('24px');
    expect(svg?.getAttribute('height')).toBe('24px');
  });

  it('applies correct sizes for small, medium, and large', () => {
    const { container: smallContainer } = render(<Icon name="camera-filled" size="small" />);
    const smallSvg = smallContainer.querySelector('svg');
    expect(smallSvg?.getAttribute('width')).toBe('14px');
    expect(smallSvg?.getAttribute('height')).toBe('14px');

    const { container: mediumContainer } = render(<Icon name="camera-filled" size="medium" />);
    const mediumSvg = mediumContainer.querySelector('svg');
    expect(mediumSvg?.getAttribute('width')).toBe('16px');
    expect(mediumSvg?.getAttribute('height')).toBe('16px');

    const { container: largeContainer } = render(<Icon name="camera-filled" size="large" />);
    const largeSvg = largeContainer.querySelector('svg');
    expect(largeSvg?.getAttribute('width')).toBe('24px');
    expect(largeSvg?.getAttribute('height')).toBe('24px');
  });

  it('returns null for invalid icon name', () => {
    // @ts-expect-error - Testing invalid icon name
    const { container } = render(<Icon name="invalid-icon-name" />);
    expect(container.firstChild).toBeNull();
  });
});
