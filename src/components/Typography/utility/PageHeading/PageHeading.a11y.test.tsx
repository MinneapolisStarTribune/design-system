import { expectNoA11yViolations } from '@/test-utils/a11y';
import { PageHeading } from './PageHeading';

describe('PageHeading Accessibility', () => {
  describe('static rendering', () => {
    it('has no violations with page heading h1', async () => {
      await expectNoA11yViolations(<PageHeading importance={1}>Page Title</PageHeading>);
    });

    it('has no violations with page heading h2', async () => {
      await expectNoA11yViolations(<PageHeading importance={2}>Page Subtitle</PageHeading>);
    });

    it('has no violations with higher heading levels', async () => {
      await expectNoA11yViolations(<PageHeading importance={3}>H3 Heading</PageHeading>);
    });

    it('has no violations with custom className', async () => {
      await expectNoA11yViolations(
        <PageHeading importance={1} className="custom-class">
          Styled Page Title
        </PageHeading>
      );
    });

    it('has no violations with all props combined', async () => {
      await expectNoA11yViolations(
        <PageHeading importance={2} className="custom-class" dataTestId="heading">
          All Props Heading
        </PageHeading>
      );
    });
  });
});
