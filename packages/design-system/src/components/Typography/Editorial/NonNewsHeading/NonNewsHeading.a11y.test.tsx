import { describe, it } from 'vitest';
import { expectNoA11yViolations } from '@/test-utils/a11y';
import { NonNewsHeading } from './NonNewsHeading';

describe('NonNewsHeading Accessibility', () => {
  it('has no violations for each heading level (importance 1–6)', async () => {
    await expectNoA11yViolations(
      <main>
        <NonNewsHeading importance={1}>Heading 1</NonNewsHeading>
        <NonNewsHeading importance={2}>Heading 2</NonNewsHeading>
        <NonNewsHeading importance={3}>Heading 3</NonNewsHeading>
        <NonNewsHeading importance={4}>Heading 4</NonNewsHeading>
        <NonNewsHeading importance={5}>Heading 5</NonNewsHeading>
        <NonNewsHeading importance={6}>Heading 6</NonNewsHeading>
      </main>
    );
  });

  it('has no violations with id and aria-label', async () => {
    await expectNoA11yViolations(
      <NonNewsHeading importance={1} id="page-title" aria-label="Page title">
        Non-news Article Title
      </NonNewsHeading>
    );
  });

  it('has no violations with custom className', async () => {
    await expectNoA11yViolations(
      <NonNewsHeading importance={2} className="custom-heading">
        Styled heading
      </NonNewsHeading>
    );
  });
});
