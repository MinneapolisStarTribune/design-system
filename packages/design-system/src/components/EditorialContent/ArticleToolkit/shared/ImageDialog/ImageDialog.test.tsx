import { renderWithProvider } from '@/test-utils/render';
import { ImageDialog, ImageDialogProps } from './ImageDialog';
import React from 'react';

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

    const el = getByTestId(testId);
    const captionElement = el.querySelector('[role="region"]');
    expect(captionElement).toBeInTheDocument();
    expect(captionElement).toHaveTextContent(caption);
  });

  it('should render both caption and credit', () => {
    const caption = 'Image caption';
    const credit = 'Image credit';
    const { getByTestId } = setup({ caption, credit });

    const el = getByTestId(testId);
    const captionElement = el.querySelector('[role="region"]');
    expect(captionElement).toBeInTheDocument();
    expect(captionElement).toHaveTextContent(caption);
    expect(captionElement).toHaveTextContent(credit);
  });

  it('should not render caption or credit when not provided', () => {
    const { getByTestId } = setup();

    const el = getByTestId(testId);
    const captionElement = el.querySelector('[role="region"]');
    expect(captionElement).not.toBeInTheDocument();
  });

  it('should call onClose when close button is clicked', () => {
    const { getByTestId, onClose } = setup();
    const closeButton = getByTestId('image-dialog-close-button');
    closeButton.click();
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
