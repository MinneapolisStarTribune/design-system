import spacingJson from '../../../../../tokens/primitives/spacing.json';

export interface SpacingData {
  name: string;
  value: string;
  tokenName: string;
}

interface SpacingToken {
  value: string | number;
}

interface SpacingJson {
  spacing?: Record<string, SpacingToken>;
}

// Validate JSON structure before processing
const typedSpacingJson = spacingJson as SpacingJson;
if (!typedSpacingJson?.spacing) {
  console.error('spacingJson structure is invalid:', typedSpacingJson);
}

export const spacingTokens: SpacingData[] = typedSpacingJson?.spacing
  ? Object.keys(typedSpacingJson.spacing)
      .map((name): SpacingData => {
        const token = typedSpacingJson.spacing![name];
        // Convert numeric values to string with "px" for display
        // Token references like "{spacing.44}" will be kept as-is (handled by Style Dictionary)
        const rawValue = token.value;
        const displayValue =
          typeof rawValue === 'number'
            ? `${rawValue}px`
            : typeof rawValue === 'string' && !rawValue.startsWith('{')
              ? `${rawValue}px`
              : String(rawValue);

        return {
          name: `space-${name}`,
          tokenName: `--spacing-${name}`,
          value: displayValue,
        };
      })
      .sort((a, b) => {
        // Sort by numeric value (extract number from display value like "96px" or raw number)
        const aNum = typeof a.value === 'string' ? parseInt(a.value) : a.value;
        const bNum = typeof b.value === 'string' ? parseInt(b.value) : b.value;
        return (bNum || 0) - (aNum || 0); // Descending order (largest first)
      })
  : [];
