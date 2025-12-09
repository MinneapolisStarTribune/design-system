import * as startribuneLight from '../generated/themes/startribune.light';
import * as startribuneDark from '../generated/themes/startribune.dark';
import * as varsityLight from '../generated/themes/varsity.light';
import * as varsityDark from '../generated/themes/varsity.dark';

export type Brand = 'startribune' | 'varsity';
export type ColorScheme = 'light' | 'dark';

/**
 * Get the color tokens for a specific brand and color scheme
 */
export function getBrandColors(brand: Brand, colorScheme: ColorScheme) {
  switch (brand) {
    case 'startribune':
      return colorScheme === 'light' ? startribuneLight.colors : startribuneDark.colors;
    case 'varsity':
      return colorScheme === 'light' ? varsityLight.colors : varsityDark.colors;
    default:
      return startribuneLight.colors;
  }
}

