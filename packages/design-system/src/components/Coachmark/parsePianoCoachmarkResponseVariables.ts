import {
  COACHMARK_ALIGNMENTS,
  COACHMARK_POSITIONS,
  type CoachmarkAlignment,
  type CoachmarkPosition,
} from './Coachmark.types';
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
  alignment?: string;
  dismissOnOutsideClick?: boolean;
  showLogin?: boolean;
  ctaText?: string;
  ctaType?: string;
}

function isCoachmarkPosition(value: string | undefined): value is CoachmarkPosition {
  return COACHMARK_POSITIONS.includes(value as CoachmarkPosition);
}

function isCoachmarkAlignment(value: string | undefined): value is CoachmarkAlignment {
  return COACHMARK_ALIGNMENTS.includes(value as CoachmarkAlignment);
}

/**
 * Validates and normalizes Piano's raw response variables into a `{ id, payload }` pair ready to
 * pass to `useTriggerExternal()(id, payload)`. Returns `null` when the required fields
 * (`id`/`title`/`description`/`ctaText`/`ctaType`) aren't all present -- e.g. when Piano fires a
 * `setResponseVariable` event for an unrelated feature (the call-to-action banner, etc).
 *
 * Encapsulates the defaulting/coercion every consumer would otherwise have to reimplement
 * identically: `position` falls back to "bottom-center" and `alignment` falls back to "center"
 * for any value other than one of `COACHMARK_POSITIONS`/`COACHMARK_ALIGNMENTS`, and
 * `dismissOnOutsideClick`/`showLogin` are each coerced to a strict boolean (`showLogin`
 * defaulting to `false`, i.e. no secondary content, when omitted). `icon` is passed through as-is
 * -- Piano supplies a full image URL directly, so there's nothing to resolve.
 */
export function parsePianoCoachmarkResponseVariables(
  responseVariables: PianoCoachmarkResponseVariables
): { id: string; payload: PianoCoachmarkPayload } | null {
  const {
    id,
    title,
    description,
    icon,
    badgeText,
    position,
    alignment,
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
      icon: icon || undefined,
      badgeText: badgeText || undefined,
      position: isCoachmarkPosition(position) ? position : 'bottom-center',
      alignment: isCoachmarkAlignment(alignment) ? alignment : 'center',
      dismissOnOutsideClick: dismissOnOutsideClick === true,
      showLogin: showLogin === true,
    },
  };
}
