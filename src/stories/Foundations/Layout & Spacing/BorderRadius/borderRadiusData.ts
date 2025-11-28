import borderRadiusJson from '../../../../../tokens/border-radius.json';

export interface BorderRadiusData {
  name: string;
  value: string;
  tokenName: string;
}

interface RadiusToken {
  value: string;
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
        const aNum = parseInt(a.value);
        const bNum = parseInt(b.value);
        return bNum - aNum; // Descending order (largest first)
      })
  : [];
