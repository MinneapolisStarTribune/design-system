'use client';

import React, { useCallback, useEffect } from 'react';
import { useExternalTriggerState } from '@minneapolisstartribune/external-trigger';
import { Coachmark } from './Coachmark';
import type { PianoCoachmarkPayload, PianoCoachmarkProps } from '../PianoCoachmark.types';
import styles from './PianoCoachmark.module.scss';

/**
 * Wraps `Coachmark` with Piano's triggered-content contract: it only ever shows content Piano
 * fired via `id`, mapping the payload's `ctaType` to a registered action for the action button.
 * `Coachmark` itself owns all the visual design (typography, spacing, icon badge, close button)
 * so this component only supplies data, never styling.
 */
export const PianoCoachmark: React.FC<PianoCoachmarkProps> = ({
  id,
  children,
  ctaActions,
  onTriggeredChange,
}) => {
  const { payload, isTriggered, dismiss } = useExternalTriggerState<PianoCoachmarkPayload>(id);

  useEffect(() => {
    onTriggeredChange?.(isTriggered);
  }, [isTriggered, onTriggeredChange]);

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
      icon={
        payload.icon ? (
          <img src={payload.icon} alt="" aria-hidden="true" className={styles.icon} />
        ) : undefined
      }
      badgeText={payload.badgeText}
      ctaText={ctaAction ? payload.ctaText : undefined}
      actionHref={ctaAction?.href}
      // `onClick` is documented as ignored when `href` is set -- suppress it here so an action
      // defining both doesn't navigate and invoke the callback.
      onAction={
        !ctaAction?.href && ctaAction?.onClick ? () => ctaAction.onClick?.({ dismiss }) : undefined
      }
      secondaryContent={payload.showLogin ? ctaAction?.renderSecondary?.({ dismiss }) : undefined}
      position={payload.position}
      alignment={payload.alignment}
      dismissOnOutsideClick={payload.dismissOnOutsideClick ?? false}
    >
      <span style={{ display: 'inline-flex' }}>{children}</span>
    </Coachmark>
  );
};
