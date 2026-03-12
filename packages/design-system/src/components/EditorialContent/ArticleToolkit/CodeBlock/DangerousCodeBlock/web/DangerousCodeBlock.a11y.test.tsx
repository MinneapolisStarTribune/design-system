import { expectNoA11yViolations } from '@/test-utils/a11y';
import { DangerousCodeBlock } from './DangerousCodeBlock';

describe('DangerousCodeBlock Accessibility', () => {
  it('has no accessibility violations with empty markup', async () => {
    await expectNoA11yViolations(<DangerousCodeBlock markup="" />);
  });

  it('has no accessibility violations with standard markup', async () => {
    const markup = `
      <div>
        <h2>Embedded Content</h2>
        <p>This simulates a chart or map embed.</p>
      </div>
    `;

    await expectNoA11yViolations(<DangerousCodeBlock markup={markup} />);
  });

  it('has no accessibility violations in immersive variant', async () => {
    const markup = `
      <div>
        <h2>Immersive Embed</h2>
        <p>Example embed for immersive layout.</p>
      </div>
    `;

    await expectNoA11yViolations(<DangerousCodeBlock markup={markup} variant="immersive" />);
  });

  it('has no accessibility violations with interactive embed markup', async () => {
    const markup = `
      <div>
        <button aria-label="Open chart details">Open Chart</button>
      </div>
    `;

    await expectNoA11yViolations(<DangerousCodeBlock markup={markup} />);
  });
});
