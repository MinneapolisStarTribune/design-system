// Ensure IDEs and TypeScript pick up *.module.scss for all components
declare module '*.module.scss' {
  const classes: { readonly [key: string]: string };
  export default classes;
}
