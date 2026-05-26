import { render, screen } from '@testing-library/react-native';
import { TestWrapperInDesignSystemProvider } from '@/test-utils/wrappers';
import { Caption } from './Caption.native';

describe('Caption Accessibility (native)', () => {
  const wrapper = TestWrapperInDesignSystemProvider({ brand: 'startribune' });

  it('exposes purchase link semantics when Buy Reprint is configured', () => {
    render(
      <Caption
        caption="A scenic view of mountains during sunrise."
        credit="Star Tribune staff"
        purchaseLink={{
          label: 'Buy Reprint',
          link: 'https://www.startribune.com/photos',
        }}
      />,
      { wrapper }
    );

    expect(screen.getByRole('link', { name: 'Buy Reprint' })).toBeOnTheScreen();
  });

  it('exposes gallery navigation button labels in lightbox variant', () => {
    render(
      <Caption
        caption="A scenic view of mountains during sunrise."
        credit="Star Tribune staff"
        variant="lightbox"
        purchaseLink={{
          label: 'Buy Reprint',
          link: 'https://www.startribune.com/photos',
        }}
        currentIndex={1}
        totalItems={17}
        onPrevious={() => {}}
        onNext={() => {}}
      />,
      { wrapper }
    );

    expect(screen.getByRole('button', { name: 'Previous image (1 of 17)' })).toBeOnTheScreen();
    expect(screen.getByRole('button', { name: 'Next image (2 of 17)' })).toBeOnTheScreen();
    expect(screen.getByLabelText('Image 1 of 17')).toBeOnTheScreen();
  });
});
