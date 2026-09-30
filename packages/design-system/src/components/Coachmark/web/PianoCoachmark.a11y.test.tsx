import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it } from 'vitest';
import {
  ExternalTriggerProvider,
  useTriggerExternal,
} from '@minneapolisstartribune/external-trigger';
import { PianoCoachmark } from './PianoCoachmark';
import type { PianoCoachmarkPayload } from '../PianoCoachmark.types';
import { expectNoA11yViolations, renderAndCheckA11y } from '@/test-utils/a11y';

const PianoTrigger = ({ triggerId }: { triggerId: string }) => {
  const trigger = useTriggerExternal<PianoCoachmarkPayload>();

  return (
    <button
      type="button"
      onClick={() =>
        trigger(triggerId, {
          title: 'Piano title',
          description: 'Piano description',
          ctaText: 'Create Free Account',
          ctaType: 'signup',
        })
      }
    >
      Fire piano event for {triggerId}
    </button>
  );
};

describe('PianoCoachmark Accessibility', () => {
  it('has no violations when not triggered', async () => {
    await expectNoA11yViolations(
      <ExternalTriggerProvider>
        <PianoCoachmark id="not-triggered" ctaActions={{}}>
          <button type="button">Trigger</button>
        </PianoCoachmark>
      </ExternalTriggerProvider>
    );
  });

  it('has no violations once Piano-triggered and open', async () => {
    const user = userEvent.setup();

    const { checkA11y } = await renderAndCheckA11y(
      <ExternalTriggerProvider>
        <PianoTrigger triggerId="a11y-open" />
        <PianoCoachmark id="a11y-open" ctaActions={{}}>
          <button type="button">Trigger</button>
        </PianoCoachmark>
      </ExternalTriggerProvider>
    );

    await user.click(screen.getByText('Fire piano event for a11y-open'));
    await screen.findByText('Piano title');

    await checkA11y();
  });
});
