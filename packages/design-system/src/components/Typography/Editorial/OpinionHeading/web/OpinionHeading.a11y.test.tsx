import { expectNoA11yViolations } from '@/test-utils/a11y';
import { OpinionHeading } from './OpinionHeading';

describe('OpinionHeading Accessibility', () => {
  it('has no violations for default heading', async () => {
    await expectNoA11yViolations(
      <OpinionHeading importance={1}>Opinion Article Title</OpinionHeading>
    );
  });
});
