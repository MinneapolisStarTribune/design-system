/**
 * Type declarations for CSS Modules
 * 
 * This allows TypeScript to recognize CSS module imports and provide
 * type safety for the exported class names.
 */

declare module '*.module.css' {
  const classes: { readonly [key: string]: string };
  export default classes;
}

