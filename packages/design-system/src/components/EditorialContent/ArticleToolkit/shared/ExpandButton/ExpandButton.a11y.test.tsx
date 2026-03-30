import { expectNoA11yViolations } from '@/test-utils/a11y';
import { ExpandButton } from './ExpandButton';

describe('ExpandButton Accessibility', () => {
  const onClick = vi.fn();

  it('has no accessibility violations', async () => {
    await expectNoA11yViolations(<ExpandButton onClick={onClick} />);
  });

  it('has no accessibility violations with additional props', async () => {
    await expectNoA11yViolations(<ExpandButton onClick={onClick} ariaLabel="Expand image" />);
  });
});
