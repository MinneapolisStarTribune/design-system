import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import { expectNoA11yViolations, renderAndCheckA11y } from '@/test-utils/a11y';
import { UtilityButton } from './UtilityButton';
import { Share02Icon } from '@/icons';

describe('UtilityButton Accessibility', () => {
  describe('static rendering', () => {
    it('has no violations with label and icon', async () => {
      await expectNoA11yViolations(
        <UtilityButton label="Share" icon={<Share02Icon />} onClick={() => {}} />
      );
    });

    it('has no violations with label only', async () => {
      await expectNoA11yViolations(<UtilityButton label="Share" onClick={() => {}} />);
    });

    it('has no violations with icon only and aria-label', async () => {
      await expectNoA11yViolations(
        <UtilityButton icon={<Share02Icon />} aria-label="Share" onClick={() => {}} />
      );
    });

    it('has no violations when disabled', async () => {
      await expectNoA11yViolations(
        <UtilityButton label="Share" icon={<Share02Icon />} isDisabled onClick={() => {}} />
      );
    });

    it('has no violations with different sizes', async () => {
      await expectNoA11yViolations(
        <UtilityButton label="Share" icon={<Share02Icon />} size="small" onClick={() => {}} />
      );

      await expectNoA11yViolations(
        <UtilityButton label="Share" icon={<Share02Icon />} size="large" onClick={() => {}} />
      );
    });

    it('has no violations with icon at end', async () => {
      await expectNoA11yViolations(
        <UtilityButton label="Share" icon={<Share02Icon />} iconPosition="end" onClick={() => {}} />
      );
    });

    describe('toggle variant', () => {
      it('has no violations when inactive', async () => {
        await expectNoA11yViolations(
          <UtilityButton
            label="Save"
            icon={<Share02Icon />}
            variant="toggle"
            active={false}
            onClick={() => {}}
          />
        );
      });

      it('has no violations when active', async () => {
        await expectNoA11yViolations(
          <UtilityButton
            label="Saved"
            icon={<Share02Icon />}
            variant="toggle"
            active
            onClick={() => {}}
          />
        );
      });

      it('has no violations with label only', async () => {
        await expectNoA11yViolations(
          <UtilityButton label="Follow" variant="toggle" active={false} onClick={() => {}} />
        );
      });

      it('has no violations with icon only and aria-label', async () => {
        await expectNoA11yViolations(
          <UtilityButton
            icon={<Share02Icon />}
            aria-label="Bookmark"
            variant="toggle"
            active={false}
            onClick={() => {}}
          />
        );
      });

      it('has no violations when disabled', async () => {
        await expectNoA11yViolations(
          <UtilityButton
            label="Save"
            icon={<Share02Icon />}
            variant="toggle"
            active={false}
            isDisabled
            onClick={() => {}}
          />
        );
      });
    });
  });

  describe('interactive states', () => {
    it('has no violations when focused', async () => {
      const { renderResult, checkA11y } = await renderAndCheckA11y(
        <UtilityButton
          label="Share"
          icon={<Share02Icon />}
          data-testid="utility-button"
          onClick={() => {}}
        />
      );

      const button = renderResult.getByTestId('utility-button');
      await userEvent.tab();
      expect(button).toHaveFocus();

      await checkA11y();
    });

    it('has no violations when clicked', async () => {
      const handleClick = vi.fn();
      const { renderResult, checkA11y } = await renderAndCheckA11y(
        <UtilityButton
          label="Share"
          icon={<Share02Icon />}
          data-testid="utility-button"
          onClick={handleClick}
        />
      );

      const button = renderResult.getByTestId('utility-button');
      await userEvent.click(button);

      await checkA11y();
      expect(handleClick).toHaveBeenCalled();
    });

    describe('toggle variant', () => {
      it('has no violations when focused (inactive)', async () => {
        const { renderResult, checkA11y } = await renderAndCheckA11y(
          <UtilityButton
            label="Save"
            icon={<Share02Icon />}
            variant="toggle"
            active={false}
            data-testid="utility-toggle"
            onClick={() => {}}
          />
        );

        const button = renderResult.getByTestId('utility-toggle');
        await userEvent.tab();
        expect(button).toHaveFocus();

        await checkA11y();
      });

      it('has no violations when focused (active)', async () => {
        const { renderResult, checkA11y } = await renderAndCheckA11y(
          <UtilityButton
            label="Saved"
            icon={<Share02Icon />}
            variant="toggle"
            active
            data-testid="utility-toggle"
            onClick={() => {}}
          />
        );

        const button = renderResult.getByTestId('utility-toggle');
        await userEvent.tab();
        expect(button).toHaveFocus();

        await checkA11y();
      });

      it('has no violations when clicked', async () => {
        const handleClick = vi.fn();
        const { renderResult, checkA11y } = await renderAndCheckA11y(
          <UtilityButton
            label="Save"
            icon={<Share02Icon />}
            variant="toggle"
            active={false}
            data-testid="utility-toggle"
            onClick={handleClick}
          />
        );

        const button = renderResult.getByTestId('utility-toggle');
        await userEvent.click(button);

        await checkA11y();
        expect(handleClick).toHaveBeenCalled();
      });
    });
  });
});
