import { jest } from '@jest/globals';
import { fireEvent, render, screen, within } from '@testing-library/react-native';
import { Linking } from 'react-native';
import { TestWrapperInDesignSystemProvider } from '@/test-utils/wrappers';
import { InlineImage } from './InlineImage.native';

jest.mock('react-native/Libraries/Modal/Modal', () => {
  const React = require('react');
  const { View } = require('react-native');
  const MockModal = ({ visible, children }: { visible?: boolean; children?: unknown }) =>
    visible ? <View>{children}</View> : null;
  return MockModal;
});

const image = {
  src: 'https://picsum.photos/id/1018/1200/800',
  altText: 'Alternative text for the image',
};

describe('InlineImage (native)', () => {
  const wrapper = TestWrapperInDesignSystemProvider({ brand: 'startribune' });
  const dataTestId = 'inline-image-test';

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('renders the image and applies alt text', () => {
    render(<InlineImage dataTestId={dataTestId} image={image} />, { wrapper });

    const imageElement = screen.getByTestId(`${dataTestId}-image`);
    expect(imageElement).toBeOnTheScreen();
    expect(imageElement.props.source.uri).toBe(image.src);
    expect(imageElement.props.accessibilityLabel).toBe(image.altText);
  });

  it('appends imgix params to the image URI', () => {
    const imgixParams = 'w=800&h=500&fit=crop&auto=format,compress&q=75';
    render(<InlineImage dataTestId={dataTestId} image={image} imgixParams={imgixParams} />, { wrapper });

    const imageElement = screen.getByTestId(`${dataTestId}-image`);
    expect(imageElement.props.source.uri).toBe(`${image.src}?${imgixParams}`);
  });

  it('renders caption and credit together', () => {
    render(
      <InlineImage
        dataTestId={dataTestId}
        image={image}
        caption="Image caption"
        credit="Image credit"
      />,
      { wrapper }
    );

    expect(screen.getByTestId(`${dataTestId}-caption`)).toBeOnTheScreen();
    expect(screen.getByText('Image caption (Image credit)')).toBeOnTheScreen();
  });

  it('does not render caption block when both caption and credit are empty', () => {
    render(<InlineImage dataTestId={dataTestId} image={image} caption="" credit="" />, { wrapper });

    expect(screen.queryByTestId(`${dataTestId}-caption`)).toBeNull();
  });

  it('renders purchase link and opens URL on press', async () => {
    const purchaseLink = 'https://www.startribune.com/photos';
    const openURLSpy = jest.spyOn(Linking, 'openURL').mockResolvedValueOnce(true);

    render(
      <InlineImage
        dataTestId={dataTestId}
        image={image}
        caption="Image caption"
        purchaseLink={purchaseLink}
      />,
      { wrapper }
    );

    fireEvent.press(screen.getByTestId(`${dataTestId}-purchase-link`));

    expect(openURLSpy).toHaveBeenCalledWith(purchaseLink);
  });

  it('opens and closes the expanded dialog when expandable', () => {
    render(
      <InlineImage dataTestId={dataTestId} image={image} caption="Caption in dialog" expandable />,
      { wrapper }
    );

    expect(screen.queryByTestId(`${dataTestId}-dialog`)).toBeNull();

    fireEvent.press(screen.getByTestId(`${dataTestId}-expand-button`));
    const dialog = screen.getByTestId(`${dataTestId}-dialog`);
    expect(dialog).toBeOnTheScreen();
    expect(within(dialog).getByText('Caption in dialog')).toBeOnTheScreen();

    fireEvent.press(screen.getByTestId(`${dataTestId}-dialog-close-button`));
    expect(screen.queryByTestId(`${dataTestId}-dialog`)).toBeNull();
  });

  it('uses the requested objectFit as image resizeMode', () => {
    render(<InlineImage dataTestId={dataTestId} image={image} objectFit="contain" />, { wrapper });

    expect(screen.getByTestId(`${dataTestId}-image`).props.resizeMode).toBe('contain');
  });
});
