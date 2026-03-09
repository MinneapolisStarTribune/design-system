import startribuneLightTheme from '@mobile/themes/startribune-light.js';
import startribuneDarkTheme from '@mobile/themes/startribune-dark.js';
import varsityLightTheme from '@mobile/themes/varsity-light.js';
import varsityDarkTheme from '@mobile/themes/varsity-dark.js';
import startribuneTypography from '@mobile/typography/startribune-typography.js';
import varsityTypography from '@mobile/typography/varsity-typography.js';

export const nativeTokenFixtures = {
  startribune: {
    light: {
      theme: startribuneLightTheme,
      typography: startribuneTypography,
    },
    dark: {
      theme: startribuneDarkTheme,
      typography: startribuneTypography,
    },
  },
  varsity: {
    light: {
      theme: varsityLightTheme,
      typography: varsityTypography,
    },
    dark: {
      theme: varsityDarkTheme,
      typography: varsityTypography,
    },
  },
} as const;
