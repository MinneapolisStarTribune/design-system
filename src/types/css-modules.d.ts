/**
 * Type declarations for CSS Modules
 * 
 * This allows TypeScript to recognize SCSS module imports and provide
 * type safety for the exported class names.
 */

declare module '*.module.scss' {
  const classes: { readonly [key: string]: string };
  export default classes;
}

