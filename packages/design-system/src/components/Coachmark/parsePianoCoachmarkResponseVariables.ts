import type { ReactNode } from 'react';
import { COACHMARK_POSITIONS, type CoachmarkPosition } from './Coachmark.types';
import type { PianoCoachmarkPayload } from './PianoCoachmark.types';

/**
 * The subset of Piano's raw `setResponseVariable` variables relevant to coachmarks. Deliberately
 * not tied to any app's own `ResponseVariables` type -- Piano sends everything as loosely-typed
 * strings/booleans, and this stays a plain structural shape any app can pass its own object into.
 */
export interface PianoCoachmarkResponseVariables {
  id?: string;
  title?: string;
  description?: string;
  icon?: string;
  badgeText?: string;
  position?: string;
  dismissOnOutsideClick?: boolean;
  showLogin?: boolean;
  ctaText?: string;
  ctaType?: string;
}

function isCoachmarkPosition(value: string | undefined): value is CoachmarkPosition {
  return COACHMARK_POSITIONS.includes(value as CoachmarkPosition);
}

export interface ParsePianoCoachmarkResponseVariablesOptions {
  /** Resolves Piano's icon *name* string to a renderable icon. Omit for coachmarks with no icon. */
  resolveIcon?: (name?: string) => ReactNode;
}

/**
 * Validates and normalizes Piano's raw response variables into a `{ id, payload }` pair ready to
 * pass to `useTriggerExternal()(id, payload)`. Returns `null` when the required fields
 * (`id`/`title`/`description`/`ctaText`/`ctaType`) aren't all present -- e.g. when Piano fires a
 * `setResponseVariable` event for an unrelated feature (the call-to-action banner, etc).
 *
 * Encapsulates the defaulting/coercion every consumer would otherwise have to reimplement
 * identically: `position` falls back to "bottom-center" for any value other than one of
 * `COACHMARK_POSITIONS`, and `dismissOnOutsideClick`/`showLogin` are each coerced to a strict
 * boolean (`showLogin` defaulting to `false`, i.e. no secondary content, when omitted).
 */
export function parsePianoCoachmarkResponseVariables(
  responseVariables: PianoCoachmarkResponseVariables,
  options: ParsePianoCoachmarkResponseVariablesOptions = {}
): { id: string; payload: PianoCoachmarkPayload } | null {
  const {
    id,
    title,
    description,
    icon,
    badgeText,
    position,
    dismissOnOutsideClick,
    showLogin,
    ctaText,
    ctaType,
  } = responseVariables;

  if (!id || !title || !description || !ctaText || !ctaType) {
    return null;
  }

  return {
    id,
    payload: {
      title,
      description,
      ctaText,
      ctaType,
      icon: options.resolveIcon?.(icon),
      badgeText: badgeText || undefined,
      position: isCoachmarkPosition(position) ? position : 'bottom-center',
      dismissOnOutsideClick: dismissOnOutsideClick === true,
      showLogin: showLogin === true,
    },
  };
}
