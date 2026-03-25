import React from 'react';
import { expectNoA11yViolations } from '@/test-utils/a11y';
import { ImageDialog } from './ImageDialog';

describe('ImageDialog Accessibility', () => {
  const dialogRef = React.createRef<HTMLDialogElement>();
  const onClose = vi.fn();
  it('has no accessibility violations', async () => {
    await expectNoA11yViolations(
      <ImageDialog image={{ src: '', altText: '' }} dialogRef={dialogRef} onClose={onClose} />
    );
  });

  it('has no accessibility violations with additional props', async () => {
    await expectNoA11yViolations(
      <ImageDialog
        image={{ src: '', altText: '' }}
        caption="Caption for the image"
        credit="Credit for the image"
        dialogRef={dialogRef}
        onClose={onClose}
      />
    );
  });

  it('has no accessibility violations with imgix parameters', async () => {
    await expectNoA11yViolations(
      <ImageDialog
        image={{ src: '', altText: '' }}
        imgixParams="w=800&h=500&fit=crop&auto=format,compress&q=75"
        dialogRef={dialogRef}
        onClose={onClose}
      />
    );
  });
});
