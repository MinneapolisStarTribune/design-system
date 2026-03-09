import { expectNoA11yViolations } from '@/test-utils/a11y';
import { EnterpriseHeading } from './EnterpriseHeading';

describe('EnterpriseHeading Accessibility', () => {
  it('has no violations for default heading', async () => {
    await expectNoA11yViolations(
      <EnterpriseHeading importance={1}>Enterprise Article Title</EnterpriseHeading>
    );
  });
});
