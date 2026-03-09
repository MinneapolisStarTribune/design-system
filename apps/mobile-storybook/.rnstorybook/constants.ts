import type { Brand } from '@minneapolisstartribune/design-system/native';

export const BRANDS: readonly Brand[] = ['startribune', 'varsity'] as const;

export const MODES = ['light', 'dark'] as const;
export type Mode = (typeof MODES)[number];
