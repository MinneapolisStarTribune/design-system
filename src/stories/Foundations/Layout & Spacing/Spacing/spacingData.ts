import spacingJson from '../../../../../tokens/spacing.json';

export interface SpacingData {
  name: string;
  value: string;
  tokenName: string;
}

interface SpacingToken {
  value: string;
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
        return {
          name: `space-${name}`,
          tokenName: `--spacing-${name}`,
          value: token.value,
        };
      })
      .sort((a, b) => {
        // Sort by numeric value (extract number from value like "96px")
        const aNum = parseInt(a.value);
        const bNum = parseInt(b.value);
        return bNum - aNum; // Descending order (largest first)
      })
  : [];
