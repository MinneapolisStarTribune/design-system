import { renderWithProvider } from '@/test-utils/render';
import { ImageDialog, ImageDialogProps } from './ImageDialog';
import React from 'react';
import { fireEvent } from '@testing-library/react';

beforeEach(() => {
  HTMLDialogElement.prototype.showModal = vi.fn();
  HTMLDialogElement.prototype.close = vi.fn();
});

describe('ImageDialog', () => {
  const image = {
    src: 'https://picsum.photos/id/1018/1200/800',
    altText: 'Alternative text for the image',
  };

  const testId = 'image-dialog';

  const setup = (props: Partial<ImageDialogProps> = {}) => {
    const dialogRef = React.createRef<HTMLDialogElement>();
    const onClose = vi.fn();

    const utils = renderWithProvider(
      <ImageDialog
        image={image}
        dialogRef={dialogRef}
        onClose={onClose}
        dataTestId={testId}
        isOpen
        {...props}
      />
    );

    return { ...utils, dialogRef, onClose };
  };

  it('should render dialog with image', () => {
    const { getByTestId } = setup();

    const el = getByTestId(testId);
    const img = el.querySelector('img');
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', image.src);
    expect(img).toHaveAttribute('alt', image.altText);
  });

  it('should render caption when provided', () => {
    const caption = 'Image caption';
    const { getByTestId } = setup({ caption });

    const captionElement = getByTestId(`${testId}-caption`);
    expect(captionElement).toBeInTheDocument();
    expect(captionElement).toHaveTextContent(caption);
  });

  it('should render both caption and credit', () => {
    const caption = 'Image caption';
    const credit = 'Image credit';
    const { getByTestId } = setup({ caption, credit });

    const captionElement = getByTestId(`${testId}-caption`);
    expect(captionElement).toBeInTheDocument();
    expect(captionElement).toHaveTextContent(caption);
    expect(captionElement).toHaveTextContent(credit);
  });

  it('should render pagination and navigation when provided', () => {
    const onPrevious = vi.fn();
    const onNext = vi.fn();
    const { getByTestId } = setup({
      currentIndex: 2,
      totalItems: 4,
      onPrevious,
      onNext,
    });

    const dialogElement = getByTestId(testId);
    const buttons = dialogElement.querySelectorAll('button');

    expect(getByTestId(`${testId}-caption-pagination`)).toHaveTextContent('2/4');

    fireEvent.click(buttons[1]);
    fireEvent.click(buttons[2]);

    expect(onPrevious).toHaveBeenCalledTimes(1);
    expect(onNext).toHaveBeenCalledTimes(1);
  });

  it('should not render caption content when not provided', () => {
    const { queryByTestId } = setup();

    expect(queryByTestId(`${testId}-caption`)).not.toBeInTheDocument();
  });

  it('should call onClose when close button is clicked', () => {
    const { getByTestId, onClose } = setup();
    const closeButton = getByTestId('image-dialog-close-button');
    closeButton.click();
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
