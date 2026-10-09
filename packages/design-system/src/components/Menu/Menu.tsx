// Namespace module: consumers get `Menu.Root`, `Menu.Item`, etc. via `export * as Menu`.
// Unlike static properties on a component, namespace members are tree-shakeable.
export { MenuDivider as Divider } from './MenuDivider';
export { MenuItem as Item } from './MenuItem';
export { MenuItemIcon as ItemIcon } from './MenuItemIcon';
export { MenuRoot as Root } from './MenuRoot';
