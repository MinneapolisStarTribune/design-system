import { expectNoA11yViolations } from '@/test-utils/a11y';
import { NonNewsHeading } from './NonNewsHeading';

describe('NonNewsHeading Accessibility', () => {
  it('has no violations for default heading', async () => {
    await expectNoA11yViolations(
      <NonNewsHeading importance={1}>Non-news Article Title</NonNewsHeading>
    );
  });
});
