// Namespace module: consumers get `Drawer.Root`, `Drawer.Heading`, etc. via `export * as Drawer`.
// Unlike static properties on a component, namespace members are tree-shakeable.
export { DrawerBody as Body } from './DrawerBody';
export { DrawerFooter as Footer } from './DrawerFooter';
export { DrawerHeading as Heading } from './DrawerHeading';
export { DrawerRoot as Root } from './DrawerRoot';
