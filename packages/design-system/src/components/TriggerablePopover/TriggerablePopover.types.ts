import type { UseExternalTriggerOptions } from '@/hooks/useExternalTrigger';
import type { PopoverProps } from '@/components/Popover/Popover.types';

export type TriggerablePopoverProps = PopoverProps & {
  /**
   * Unique id an outside script can use to open/close this popover (via
   * `window[openGlobalName]`/`window[closeGlobalName]`) and, when `enableInjectionSlot` is set,
   * inject content into. Omit entirely for a popover that only ever opens from `trigger`.
   * `children` are not rendered while the popover is open from this id.
   */
  triggerId?: string;
  /**
   * Reserves a DOM node (id: `${triggerId}-injection-slot`) that an external script can find and
   * inject content into (e.g. a vendor iframe), mounted ahead of the first external open so it's
   * ready by the time that script runs. Requires `triggerId`. Default: `false`.
   */
  enableInjectionSlot?: boolean;
  /** Overrides for the external-trigger mechanism's default global names/timings. */
  externalTriggerOptions?: UseExternalTriggerOptions;
};
