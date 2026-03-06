import borderRadiusJson from '../../../../../tokens/primitives/border-radius.json';

export interface BorderRadiusData {
  name: string;
  value: number;
  tokenName: string;
}

interface RadiusToken {
  value: number;
}

interface BorderRadiusJson {
  radius?: Record<string, RadiusToken>;
}

// Validate JSON structure before processing
const typedBorderRadiusJson = borderRadiusJson as BorderRadiusJson;
if (!typedBorderRadiusJson?.radius) {
  console.error('borderRadiusJson structure is invalid:', typedBorderRadiusJson);
}

export const borderRadiusTokens: BorderRadiusData[] = typedBorderRadiusJson?.radius
  ? Object.keys(typedBorderRadiusJson.radius)
      .map((name): BorderRadiusData => {
        const token = typedBorderRadiusJson.radius![name];
        return {
          name: name === 'full' ? 'full' : `radius-${name}`,
          tokenName: `--radius-${name}`,
          value: token.value,
        };
      })
      .sort((a, b) => {
        // Sort by numeric value, with 'full' at the end
        if (a.name === 'full') return 1;
        if (b.name === 'full') return -1;
        return b.value - a.value; // Descending order (largest first)
      })
  : [];
