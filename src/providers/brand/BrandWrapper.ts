// Type-only re-export so TypeScript can resolve the import in TamaguiProvider.tsx.
// At runtime, the bundler (Vite for web, Metro for native) will resolve
// BrandWrapper.web.tsx or BrandWrapper.native.tsx respectively.
export { BrandWrapper } from './BrandWrapper.web';
export type { BrandWrapperProps } from './BrandWrapper.web';
