import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import {
  ExternalTriggerProvider,
  useExternalTriggerState,
  useTriggerExternal,
} from './ExternalTriggerProvider';

const TestConsumer = ({ id }: { id: string | undefined }) => {
  const { isTriggered, payload, dismiss } = useExternalTriggerState<string>(id);

  return (
    <div>
      <div data-testid={`${id}-triggered`}>{isTriggered ? 'true' : 'false'}</div>
      <div data-testid={`${id}-payload`}>{payload}</div>
      <button type="button" onClick={dismiss}>
        Dismiss {id}
      </button>
    </div>
  );
};

const TestTrigger = ({ id, payload }: { id: string; payload?: string }) => {
  const trigger = useTriggerExternal<string>();

  return (
    <button type="button" onClick={() => trigger(id, payload)}>
      Trigger {id}
    </button>
  );
};

describe('ExternalTriggerProvider', () => {
  it('sets state via trigger so a consumer with a matching id sees isTriggered and the payload', async () => {
    render(
      <ExternalTriggerProvider>
        <TestTrigger id="popover-a" payload="Payload A" />
        <TestConsumer id="popover-a" />
      </ExternalTriggerProvider>
    );

    expect(screen.getByTestId('popover-a-triggered')).toHaveTextContent('false');

    await userEvent.click(screen.getByText('Trigger popover-a'));

    expect(screen.getByTestId('popover-a-triggered')).toHaveTextContent('true');
    expect(screen.getByTestId('popover-a-payload')).toHaveTextContent('Payload A');
  });

  it('clears the triggered state via dismiss', async () => {
    render(
      <ExternalTriggerProvider>
        <TestTrigger id="popover-b" payload="Payload B" />
        <TestConsumer id="popover-b" />
      </ExternalTriggerProvider>
    );

    await userEvent.click(screen.getByText('Trigger popover-b'));
    expect(screen.getByTestId('popover-b-triggered')).toHaveTextContent('true');

    await userEvent.click(screen.getByText('Dismiss popover-b'));
    expect(screen.getByTestId('popover-b-triggered')).toHaveTextContent('false');
  });

  it('keeps two different ids isolated from each other', async () => {
    render(
      <ExternalTriggerProvider>
        <TestTrigger id="popover-x" payload="Payload X" />
        <TestConsumer id="popover-x" />
        <TestConsumer id="popover-y" />
      </ExternalTriggerProvider>
    );

    await userEvent.click(screen.getByText('Trigger popover-x'));

    expect(screen.getByTestId('popover-x-triggered')).toHaveTextContent('true');
    expect(screen.getByTestId('popover-y-triggered')).toHaveTextContent('false');
  });

  it('returns a safe default when used without an ExternalTriggerProvider ancestor', () => {
    expect(() => render(<TestConsumer id="no-provider" />)).not.toThrow();

    expect(screen.getByTestId('no-provider-triggered')).toHaveTextContent('false');

    expect(() =>
      act(() => {
        screen.getByText('Dismiss no-provider').click();
      })
    ).not.toThrow();
  });

  it('returns a safe no-op trigger when useTriggerExternal is used without a provider', () => {
    const NoProviderTrigger = () => {
      const trigger = useTriggerExternal<string>();

      return (
        <button type="button" onClick={() => trigger('some-id', 'payload')}>
          Trigger without provider
        </button>
      );
    };

    render(<NoProviderTrigger />);

    expect(() => screen.getByText('Trigger without provider').click()).not.toThrow();
  });
});
