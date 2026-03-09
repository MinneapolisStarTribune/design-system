import { expectNoA11yViolations } from '@/test-utils/a11y';
import { EditorialText } from './EditorialText';

describe('EditorialText Accessibility', () => {
  it('has no violations with default props', async () => {
    await expectNoA11yViolations(<EditorialText size="medium">Editorial text</EditorialText>);
  });
});
