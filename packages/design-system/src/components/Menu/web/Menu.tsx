// Namespace module. Consumers use `Menu.Root`, `Menu.Item` and the other parts through
// `export * as Menu`. Bundlers can remove unused namespace members, but not static properties.
export { MenuRoot as Root } from './MenuRoot';
export { MenuItem as Item } from './MenuItem';
export { MenuItemIcon as ItemIcon } from './MenuItemIcon';
export { MenuDivider as Divider } from './MenuDivider';
