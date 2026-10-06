// Namespace module: consumers get `ToggleGroup.Root` and `ToggleGroup.Item` via `export * as ToggleGroup`.
// Unlike static properties on a component, namespace members are tree-shakeable.
export { ToggleGroupItem as Item } from './ToggleGroupItem';
export { ToggleGroupRoot as Root } from './ToggleGroupRoot';
