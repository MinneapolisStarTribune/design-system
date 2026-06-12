import { jest } from '@jest/globals';
import { fireEvent, render, screen, within, waitFor } from '@testing-library/react-native';
import { Linking, StyleSheet } from 'react-native';
import { TestWrapperInDesignSystemProvider } from '@/test-utils/wrappers';
import { InlineImage } from './InlineImage.native';

jest.mock('react-native/Libraries/Modal/Modal', () => {
  const _React = require('react');
  const { View } = require('react-native');
  const MockModal = ({ visible, children }: { visible?: boolean; children?: unknown }) =>
    visible ? _React.createElement(View, null, children) : null;
  return { __esModule: true, default: MockModal };
});

const image = {
  src: 'https://picsum.photos/id/1018/1200/800',
  altText: 'Alternative text for the image',
};

const purchaseLink = {
  link: 'https://www.startribune.com/photos',
  label: 'Buy Reprint',
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
    render(<InlineImage dataTestId={dataTestId} image={image} imgixParams={imgixParams} />, {
      wrapper,
    });

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
    expect(screen.getByTestId(`${dataTestId}-caption`)).toHaveTextContent(
      /Image caption\s*\(Image credit\)/
    );
  });

  it('renders purchase link when caption and credit are empty', () => {
    render(
      <InlineImage
        dataTestId={dataTestId}
        image={image}
        caption=""
        credit=""
        purchaseLink={purchaseLink}
      />,
      { wrapper }
    );

    expect(screen.getByTestId(`${dataTestId}-caption`)).toBeOnTheScreen();
    expect(screen.getByTestId(`${dataTestId}-caption-purchase-link`)).toBeOnTheScreen();
  });

  it('renders default Buy Reprint when purchaseLink.label is missing', () => {
    render(
      <InlineImage
        dataTestId={dataTestId}
        image={image}
        caption="Image caption"
        purchaseLink={{
          link: 'https://www.startribune.com/photos',
        }}
      />,
      { wrapper }
    );

    expect(screen.getByTestId(`${dataTestId}-caption-purchase-link`)).toBeOnTheScreen();
    expect(screen.getByText('Buy Reprint')).toBeOnTheScreen();
  });

  it('renders default Buy Reprint when purchaseLink.label is empty', () => {
    render(
      <InlineImage
        dataTestId={dataTestId}
        image={image}
        caption="Image caption"
        purchaseLink={{
          label: '   ',
          link: 'https://www.startribune.com/photos',
        }}
      />,
      { wrapper }
    );

    expect(screen.getByTestId(`${dataTestId}-caption-purchase-link`)).toBeOnTheScreen();
    expect(screen.getByText('Buy Reprint')).toBeOnTheScreen();
  });

  it('does not render Buy Reprint when purchaseLink.link is missing', () => {
    render(
      <InlineImage
        dataTestId={dataTestId}
        image={image}
        caption="Image caption"
        purchaseLink={{
          label: 'Buy Reprint',
        }}
      />,
      { wrapper }
    );

    expect(screen.queryByTestId(`${dataTestId}-caption-purchase-link`)).toBeNull();
  });

  it('renders purchase link and opens URL on press', async () => {
    jest.spyOn(Linking, 'canOpenURL').mockResolvedValueOnce(true);
    const openURLSpy = jest.spyOn(Linking, 'openURL').mockResolvedValueOnce(true);

    render(
      <InlineImage
        dataTestId={dataTestId}
        image={image}
        caption="Image caption"
        purchaseLink={purchaseLink}
      />,
      {
        wrapper,
      }
    );

    fireEvent.press(screen.getByTestId(`${dataTestId}-caption-purchase-link`));

    await waitFor(() => {
      expect(openURLSpy).toHaveBeenCalledWith(purchaseLink.link);
    });
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

  it('renders purchase link in the expanded dialog when expandable', () => {
    render(
      <InlineImage
        dataTestId={dataTestId}
        image={image}
        caption="Caption in dialog"
        purchaseLink={purchaseLink}
        expandable
      />,
      { wrapper }
    );

    fireEvent.press(screen.getByTestId(`${dataTestId}-expand-button`));

    const dialog = screen.getByTestId(`${dataTestId}-dialog`);
    expect(
      within(dialog).getByTestId(`${dataTestId}-dialog-caption-purchase-link`)
    ).toBeOnTheScreen();
  });

  it('uses a wider max width for immersive than standard', () => {
    const standardRender = render(
      <InlineImage dataTestId="standard" image={image} variant="standard" />,
      { wrapper }
    );
    const immersiveRender = render(
      <InlineImage dataTestId="immersive" image={image} variant="immersive" />,
      { wrapper }
    );

    const standardStyle = StyleSheet.flatten(standardRender.getByTestId('standard').props.style);
    const immersiveStyle = StyleSheet.flatten(immersiveRender.getByTestId('immersive').props.style);

    expect(immersiveStyle.maxWidth).toBeGreaterThan(standardStyle.maxWidth as number);
  });

  it('uses the requested objectFit as image resizeMode', () => {
    render(<InlineImage dataTestId={dataTestId} image={image} objectFit="contain" />, { wrapper });

    expect(screen.getByTestId(`${dataTestId}-image`).props.resizeMode).toBe('contain');
  });
});
