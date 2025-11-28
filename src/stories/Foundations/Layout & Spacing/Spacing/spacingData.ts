import spacingJson from '../../../../../tokens/spacing.json';

export interface SpacingData {
  name: string;
  value: string;
  tokenName: string;
}

// Validate JSON structure before processing
if (!spacingJson?.spacing) {
  console.error('spacingJson structure is invalid:', spacingJson);
}

export const spacingTokens: SpacingData[] = spacingJson?.spacing
  ? Object.entries(spacingJson.spacing)
      .map(([name, token]: [string, { value: string }]) => ({
        name: `space-${name}`,
        tokenName: `--spacing-${name}`,
        value: token.value,
      }))
      .sort((a, b) => {
        // Sort by numeric value (extract number from value like "96px")
        const aNum = parseInt(a.value);
        const bNum = parseInt(b.value);
        return bNum - aNum; // Descending order (largest first)
      })
  : [];
