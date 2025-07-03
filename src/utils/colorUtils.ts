export function generateRandomPalette(baseColor?: string): string[] {
  if (!baseColor) return Array.from({ length: 5 }, () => randomHexColor());
  return generateSimilarPalette(baseColor, 5);
}

function randomHexColor(): string {
  const hex = Math.floor(Math.random() * 0xffffff).toString(16);
  return "#" + hex.padStart(6, "0");
}

// Generate a palette of similar colors based on a base color (hex)
export function generateSimilarPalette(
  baseHex: string,
  count: number
): string[] {
  const base = hexToHSL(baseHex);
  return Array.from({ length: count }, (_, i) => {
    // Vary the hue and lightness for variety
    const hue = (base.h + (i - Math.floor(count / 2)) * 18 + 360) % 360;
    const light = Math.max(
      20,
      Math.min(85, base.l + (i - Math.floor(count / 2)) * 7)
    );
    return hslToHex(hue, base.s, light);
  });
}

// Helpers for color conversion
function hexToHSL(hex: string) {
  let c = hex.replace("#", "");
  if (c.length === 3)
    c = c
      .split("")
      .map((x) => x + x)
      .join("");
  const num = parseInt(c, 16);
  let r = (num >> 16) / 255,
    g = ((num >> 8) & 0xff) / 255,
    b = (num & 0xff) / 255;
  const max = Math.max(r, g, b),
    min = Math.min(r, g, b);
  let h = 0,
    s = 0,
    l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h *= 60;
  }
  return { h, s: s * 100, l: l * 100 };
}

function hslToHex(h: number, s: number, l: number) {
  s /= 100;
  l /= 100;
  let c = (1 - Math.abs(2 * l - 1)) * s;
  let x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  let m = l - c / 2;
  let r = 0,
    g = 0,
    b = 0;
  if (h < 60) [r, g, b] = [c, x, 0];
  else if (h < 120) [r, g, b] = [x, c, 0];
  else if (h < 180) [r, g, b] = [0, c, x];
  else if (h < 240) [r, g, b] = [0, x, c];
  else if (h < 300) [r, g, b] = [x, 0, c];
  else [r, g, b] = [c, 0, x];
  return (
    "#" +
    [r, g, b]
      .map((v) =>
        Math.round((v + m) * 255)
          .toString(16)
          .padStart(2, "0")
      )
      .join("")
  );
}

// Generate a css theme snippet for custom colors
export function generateTailwindThemeSnippet(
  colors: string[],
  prefix = "custom"
): string {
  const colorObj = colors.reduce((acc, color, idx) => {
    acc[`${prefix}-${idx + 1}`] = color;
    return acc;
  }, {} as Record<string, string>);
  // Return as a true multiline string (not escaped) for React rendering and clipboard
  return [
    "@theme {",
    ...Object.entries(colorObj).map(
      ([key, value]) => `  --${key}: '${value}';`
    ),
    "}",
  ].join("\n");
}
