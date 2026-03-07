/**
 * Shared vi.mock() calls for @mobile theme/typography modules that only
 * resolve at React Native build time.
 *
 * Usage: add `import '@/test-utils/mockNativeTokens';` at the top of any
 * test file that exercises code depending on useNativeTokens / useNativeStyles.
 * Vitest hoists vi.mock() calls automatically, so the import order is safe.
 */

vi.mock('@mobile/themes/startribune-light.js', () => ({
  default: { colorBackgroundBrand: '#strib-light' },
}));
vi.mock('@mobile/themes/startribune-dark.js', () => ({
  default: { colorBackgroundBrand: '#strib-dark' },
}));
vi.mock('@mobile/themes/varsity-light.js', () => ({
  default: { colorBackgroundBrand: '#varsity-light' },
}));
vi.mock('@mobile/themes/varsity-dark.js', () => ({
  default: { colorBackgroundBrand: '#varsity-dark' },
}));
vi.mock('@mobile/typography/startribune-typography.js', () => ({
  default: {
    typographyArticleQuoteLarge: { fontSize: 24 },
    typographyArticleQuoteSmall: { fontSize: 16 },
  },
}));
vi.mock('@mobile/typography/varsity-typography.js', () => ({
  default: {
    typographyArticleQuoteLarge: { fontSize: 22 },
    typographyArticleQuoteSmall: { fontSize: 14 },
  },
}));
