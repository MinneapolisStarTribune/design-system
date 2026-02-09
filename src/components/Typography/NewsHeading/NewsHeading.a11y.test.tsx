import { describe, it } from 'vitest';
import { expectNoA11yViolations } from '@/test-utils/a11y';
import { NewsHeading } from './NewsHeading';
import { OpinionHeading } from '../OpinionHeading/OpinionHeading';
import { NonNewsHeading } from '../NonNewsHeading/NonNewsHeading';

describe('NewsHeading Accessibility', () => {
  it('has no violations for each heading level (importance 1–6)', async () => {
    await expectNoA11yViolations(
      <main>
        <NewsHeading importance={1}>Heading 1</NewsHeading>
        <NewsHeading importance={2}>Heading 2</NewsHeading>
        <NewsHeading importance={3}>Heading 3</NewsHeading>
        <NewsHeading importance={4}>Heading 4</NewsHeading>
        <NewsHeading importance={5}>Heading 5</NewsHeading>
        <NewsHeading importance={6}>Heading 6</NewsHeading>
      </main>
    );
  });

  it('has no violations with id and aria-label', async () => {
    await expectNoA11yViolations(
      <NewsHeading importance={1} id="page-title" aria-label="Page title">
        News Article Title
      </NewsHeading>
    );
  });

  it('has no violations with custom className', async () => {
    await expectNoA11yViolations(
      <NewsHeading importance={2} className="custom-heading">
        Styled heading
      </NewsHeading>
    );
  });
});

describe('OpinionHeading Accessibility', () => {
  it('has no violations for heading levels (valid order)', async () => {
    await expectNoA11yViolations(
      <main>
        <OpinionHeading importance={1}>Opinion H1</OpinionHeading>
        <OpinionHeading importance={2}>Opinion H2</OpinionHeading>
        <OpinionHeading importance={3}>Opinion H3</OpinionHeading>
      </main>
    );
  });
});

describe('NonNewsHeading Accessibility', () => {
  it('has no violations for heading levels (startribune, valid order)', async () => {
    await expectNoA11yViolations(
      <main>
        <NonNewsHeading importance={1}>Non-news H1</NonNewsHeading>
        <NonNewsHeading importance={2}>Non-news H2</NonNewsHeading>
        <NonNewsHeading importance={3}>Non-news H3</NonNewsHeading>
        <NonNewsHeading importance={4}>Non-news H4</NonNewsHeading>
      </main>
    );
  });
});
