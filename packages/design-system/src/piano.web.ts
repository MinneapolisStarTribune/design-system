// Piano-triggered coachmark integration for web. Import from
// '@minneapolisstartribune/design-system/web/piano', not the main '/web' entrypoint -- this
// depends on the optional peer @minneapolisstartribune/external-trigger, which the main
// entrypoint deliberately does not resolve (see components/index.web.ts).
export type { PianoCoachmarkResponseVariables } from './components/Coachmark/parsePianoCoachmarkResponseVariables';
export { parsePianoCoachmarkResponseVariables } from './components/Coachmark/parsePianoCoachmarkResponseVariables';
export type {
  PianoCoachmarkPayload,
  PianoCoachmarkProps,
  PianoCtaAction,
  PianoCtaActionContext,
  PianoCtaActionRegistry,
} from './components/Coachmark/PianoCoachmark.types';
export { PianoCoachmark } from './components/Coachmark/web/PianoCoachmark';
