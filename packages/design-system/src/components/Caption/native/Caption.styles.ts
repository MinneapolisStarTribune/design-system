import { StyleSheet, type TextStyle } from 'react-native';
import type { NativeTheme } from '@/hooks/useNativeStyles';
import type { CaptionVariant } from '../Caption.types';

export const createCaptionStyles = (theme: NativeTheme, variant: CaptionVariant) => {
  const isLightbox = variant === 'lightbox';

  return StyleSheet.create({
    root: {
      width: '100%',
      flexDirection: 'column',
    },
    topRow: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: theme.spacing20,
    },
    captionRow: {
      flexShrink: 1,
      flexGrow: 0,
      flexBasis: 'auto',
      minWidth: 0,
    },
    bottomRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    bottomRowMobile: {
      alignItems: 'flex-start',
    },
    captionText: {
      color: isLightbox ? theme.colorTextOnDarkPrimary : theme.colorTextOnLightSecondary,
    },
    purchaseLinkSeparator: {
      marginHorizontal: theme.spacing4,
      color: isLightbox ? theme.colorTextOnDarkPrimary : theme.colorTextOnLightSecondary,
    },
    purchaseLinkText: {
      color: isLightbox ? theme.colorTextOnDarkPrimary : theme.colorTextOnLightSecondary,
      textDecorationLine: 'underline',
      textDecorationSkipInk: 'auto',
      textDecorationColor: isLightbox
        ? theme.colorCaptionPurchaseLinkAccentOnDarkSurface
        : theme.colorCaptionPurchaseLinkAccentOnLightSurface,
    } as TextStyle & { textDecorationSkipInk?: 'auto' },
    creditRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing4,
      marginTop: theme.spacing12,
      marginBottom: theme.spacing20,
    },
    creditText: {
      color: theme.colorTextOnDarkTertiary,
      flexShrink: 1,
    },
    pagination: {
      flexShrink: 0,
      color: theme.colorTextOnDarkPrimary,
    },
    paginationSpacer: {
      flex: 1,
    },
    navigation: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing8,
      flexShrink: 0,
      marginLeft: 'auto',
    },
    navButton: {
      borderWidth: 1,
      borderColor: theme.colorBorderOnDarkSubtle01,
    },
  });
};
