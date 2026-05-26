import React from 'react';
import { expectNoA11yViolations } from '@/test-utils/a11y';
import { ImageDialog } from './ImageDialog';

beforeEach(() => {
  HTMLDialogElement.prototype.showModal = vi.fn();
  HTMLDialogElement.prototype.close = vi.fn();
});

describe('ImageDialog Accessibility', () => {
  const dialogRef = React.createRef<HTMLDialogElement>();
  const onClose = vi.fn();
  const image = {
    src: 'https://picsum.photos/id/1018/1200/800',
    altText: 'Accessible dialog image',
  };

  it('has no accessibility violations', async () => {
    await expectNoA11yViolations(
      <ImageDialog image={image} dialogRef={dialogRef} onClose={onClose} isOpen />
    );
  });

  it('has no accessibility violations with additional props', async () => {
    await expectNoA11yViolations(
      <ImageDialog
        image={image}
        caption="Caption for the image"
        credit="Credit for the image"
        purchaseLink={{
          label: 'Buy Reprint',
          link: 'https://www.startribune.com/photos',
        }}
        currentIndex={2}
        totalItems={4}
        onPrevious={vi.fn()}
        onNext={vi.fn()}
        dialogRef={dialogRef}
        onClose={onClose}
        isOpen
      />
    );
  });

  it('has no accessibility violations with imgix parameters', async () => {
    await expectNoA11yViolations(
      <ImageDialog
        image={image}
        imgixParams="w=800&h=500&fit=crop&auto=format,compress&q=75"
        dialogRef={dialogRef}
        onClose={onClose}
        isOpen
      />
    );
  });
});
