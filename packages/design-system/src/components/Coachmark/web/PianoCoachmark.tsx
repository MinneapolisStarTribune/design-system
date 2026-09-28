'use client';

import React, { useCallback, useEffect } from 'react';
import { useExternalTriggerState } from '@minneapolisstartribune/external-trigger';
import { Coachmark } from './Coachmark';
import { COACHMARK_POSITIONS } from '../Coachmark.types';
import type { PianoCoachmarkPayload, PianoCoachmarkProps } from '../PianoCoachmark.types';

/**
 * Wraps `Coachmark` with Piano's triggered-content contract: it only ever shows content Piano
 * fired via `id`, mapping the payload's `ctaType` to a registered action for the action button.
 * `Coachmark` itself owns all the visual design (typography, spacing, icon badge, close button)
 * so this component only supplies data, never styling.
 */
export const PianoCoachmark: React.FC<PianoCoachmarkProps> = ({ id, children, ctaActions }) => {
  const { payload, isTriggered, dismiss } = useExternalTriggerState<PianoCoachmarkPayload>(id);

  const handleOpenChange = useCallback(
    (next: boolean) => {
      if (!next) dismiss();
    },
    [dismiss]
  );

  // Clears this id's piano-triggered state if this unmounts while still showing it, so it
  // doesn't reappear instantly if a component using the same id mounts again later.
  useEffect(() => {
    return () => dismiss();
  }, [dismiss]);

  const ctaAction = payload ? ctaActions[payload.ctaType] : undefined;

  if (payload && isTriggered && !ctaAction) {
    // eslint-disable-next-line no-console
    console.warn(
      `PianoCoachmark: no ctaAction registered for ctaType "${payload.ctaType}" (id "${id}"). Rendering without an action button.`
    );
  }

  if (!isTriggered || !payload) {
    return <span style={{ display: 'inline-flex' }}>{children}</span>;
  }

  return (
    <Coachmark
      open={isTriggered}
      onOpenChange={handleOpenChange}
      title={payload.title}
      description={payload.description}
      icon={payload.icon}
      badgeText={payload.badgeText}
      ctaText={ctaAction ? payload.ctaText : undefined}
      actionHref={ctaAction?.href}
      onAction={ctaAction?.onClick ? () => ctaAction.onClick?.({ dismiss }) : undefined}
      secondaryContent={payload.showLogin ? ctaAction?.renderSecondary?.({ dismiss }) : undefined}
      position={
        payload.position && COACHMARK_POSITIONS.includes(payload.position)
          ? payload.position
          : 'bottom-center'
      }
      dismissOnOutsideClick={payload.dismissOnOutsideClick ?? false}
    >
      <span style={{ display: 'inline-flex' }}>{children}</span>
    </Coachmark>
  );
};
