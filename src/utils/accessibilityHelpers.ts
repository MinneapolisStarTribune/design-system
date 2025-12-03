/**
 * Converts an icon name (kebab-case) to a readable label for aria-label
 * Example: "camera-filled" -> "Camera"
 */
export const getIconLabel = (iconName: string): string => {
  // Remove common suffixes like "-filled", "-outline", etc.
  const baseName = iconName
    .replace(/-filled$/, '')
    .replace(/-outline$/, '')
    .replace(/-active$/, '')
    .replace(/-inactive$/, '')
    .replace(/-checked$/, '')
    .replace(/-unchecked$/, '');

  // Convert kebab-case to title case
  return baseName
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};
