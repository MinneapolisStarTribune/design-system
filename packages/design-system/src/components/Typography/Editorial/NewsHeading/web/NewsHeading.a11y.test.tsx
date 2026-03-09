import { expectNoA11yViolations } from '@/test-utils/a11y';
import { NewsHeading } from './NewsHeading';

describe('NewsHeading Accessibility', () => {
  it('has no violations for default heading', async () => {
    await expectNoA11yViolations(<NewsHeading importance={1}>News Article Title</NewsHeading>);
  });
});
