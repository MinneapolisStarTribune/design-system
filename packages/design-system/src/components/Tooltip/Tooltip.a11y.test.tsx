import { describe, it } from 'vitest';
import { expectNoA11yViolations, renderAndCheckA11y } from '@/test-utils/a11y';
import { Tooltip } from './Tooltip';
import { Button } from '@/components/Button/web/Button';

describe('Tooltip Accessibility', () => {
  it('has no violations for basic tooltip', async () => {
    await expectNoA11yViolations(
      <Tooltip label="Helper text">
        <Button>Help</Button>
      </Tooltip>
    );
  });

  it('has no violations with icon', async () => {
    await expectNoA11yViolations(
      <Tooltip label="Helper text" icon={<span>ℹ️</span>} iconPosition="start">
        <Button>Help</Button>
      </Tooltip>
    );
  });

  it('has no violations with different placements', async () => {
    const { checkA11y } = await renderAndCheckA11y(
      <Tooltip label="Helper text" pointer="top">
        <Button>Help</Button>
      </Tooltip>
    );

    await checkA11y();
  });

  it('has proper role and aria attributes', async () => {
    const { checkA11y } = await renderAndCheckA11y(
      <Tooltip label="Helper text">
        <Button>Help</Button>
      </Tooltip>
    );

    await checkA11y();
  });

  it('has no violations with custom rich content', async () => {
    await expectNoA11yViolations(
      <Tooltip
        open
        content={
          <div>
            <p>Heads up</p>
            <p>Some content</p>
            <button type="button">Got it</button>
          </div>
        }
      >
        <Button>Open</Button>
      </Tooltip>
    );
  });
});
