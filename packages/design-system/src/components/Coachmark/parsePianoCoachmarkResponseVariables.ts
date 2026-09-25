import type { ReactNode } from 'react';
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
  align?: string;
  dismissOnOutsideClick?: boolean;
  showLogin?: boolean;
  ctaText?: string;
  ctaType?: string;
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
 * identically: `position` falls back to "bottom" for any value other than "top"/"center", `align`
 * falls back to "center" for any value other than "left"/"right", and `dismissOnOutsideClick`/
 * `showLogin` are each coerced to a strict boolean (`showLogin` defaulting to `false`, i.e. no
 * secondary content, when omitted).
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
    align,
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
      position: position === 'top' ? 'top' : position === 'center' ? 'center' : 'bottom',
      align: align === 'left' ? 'left' : align === 'right' ? 'right' : 'center',
      dismissOnOutsideClick: dismissOnOutsideClick === true,
      showLogin: showLogin === true,
    },
  };
}
