import { describe, it } from 'vitest';
import { expectNoA11yViolations } from '@/test-utils/a11y';
import { EnterpriseHeading } from './EnterpriseHeading';

describe('EnterpriseHeading Accessibility', () => {
  it('has no violations for each heading level (importance 1–6)', async () => {
    await expectNoA11yViolations(
      <main>
        <EnterpriseHeading importance={1}>Heading 1</EnterpriseHeading>
        <EnterpriseHeading importance={2}>Heading 2</EnterpriseHeading>
        <EnterpriseHeading importance={3}>Heading 3</EnterpriseHeading>
        <EnterpriseHeading importance={4}>Heading 4</EnterpriseHeading>
        <EnterpriseHeading importance={5}>Heading 5</EnterpriseHeading>
        <EnterpriseHeading importance={6}>Heading 6</EnterpriseHeading>
      </main>
    );
  });

  it('has no violations with id and aria-label', async () => {
    await expectNoA11yViolations(
      <EnterpriseHeading importance={1} id="page-title" aria-label="Page title">
        Enterprise Article Title
      </EnterpriseHeading>
    );
  });

  it('has no violations with custom className', async () => {
    await expectNoA11yViolations(
      <EnterpriseHeading importance={2} className="custom-heading">
        Styled heading
      </EnterpriseHeading>
    );
  });
});
