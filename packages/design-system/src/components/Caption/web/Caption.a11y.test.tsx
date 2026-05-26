import { expectNoA11yViolations } from '@/test-utils/a11y';
import { Caption } from './Caption';

describe('Caption Accessibility', () => {
  it('has no accessibility violations for inline caption', async () => {
    await expectNoA11yViolations(
      <Caption
        caption="A scenic view of mountains during sunrise."
        credit="Star Tribune staff/The Minnesota Star Tribune"
        variant="inline"
      />
    );
  });

  it('has no accessibility violations with Buy Reprint CTA', async () => {
    await expectNoA11yViolations(
      <Caption
        caption="A scenic view of mountains during sunrise."
        credit="Star Tribune staff"
        purchaseLink={{
          label: 'Buy Reprint',
          link: 'https://www.startribune.com/photos',
        }}
      />
    );
  });

  it('has no accessibility violations for inline gallery caption with pagination and navigation', async () => {
    await expectNoA11yViolations(
      <Caption
        caption="A scenic view of mountains during sunrise."
        credit="Star Tribune staff"
        variant="inline"
        purchaseLink={{
          label: 'Buy Reprint',
          link: 'https://www.startribune.com/photos',
        }}
        currentIndex={2}
        totalItems={17}
        onPrevious={() => {}}
        onNext={() => {}}
      />
    );
  });

  it('has no accessibility violations for lightbox caption with gallery controls', async () => {
    await expectNoA11yViolations(
      <div style={{ background: '#111', padding: 24 }}>
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
        />
      </div>
    );
  });
});
