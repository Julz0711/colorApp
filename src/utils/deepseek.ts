import ModelClient, { isUnexpected } from "@azure-rest/ai-inference";
import { AzureKeyCredential } from "@azure/core-auth";

const endpoint = "https://models.github.ai/inference";
const model = "deepseek/DeepSeek-R1-0528";
const token = import.meta.env.VITE_GITHUB_TOKEN;

if (!token) {
  throw new Error("GitHub token not set in .env (VITE_GITHUB_TOKEN)");
}

/**
 * Generate a color palette using DeepSeek AI model.
 * @param prompt User prompt for palette inspiration (should be a theme description)
 * @returns Promise<string[]> Array of 5 hex color codes
 */
export async function fetchPaletteFromDeepSeek(
  prompt: string
): Promise<string[]> {
  const client = ModelClient(endpoint, new AzureKeyCredential(token));
  const response = await client.path("/chat/completions").post({
    body: {
      messages: [
        {
          role: "user",
          content: `You are a color palette generator. Given the following theme description, return ONLY a valid JSON array of 5 unique and visually distinct hex color codes (e.g. [\"#FF0000\", ...]) for a color palette. Do not repeat similar colors. Do not include any explanation, text, or formatting except the JSON array. If you cannot comply, return [\"#31d8da\", \"#bfd219\", \"#8da2c9\", \"#384171\", \"#0d63c1\"].\n\nTheme description: ${prompt}`,
        },
      ],
      max_tokens: 200,
      model,
    },
  });
  if (isUnexpected(response)) {
    throw new Error(response.body.error?.message || "DeepSeek API error");
  }
  const text = response.body.choices?.[0]?.message?.content || "";
  let arr: string[] = [];
  try {
    arr = JSON.parse(text.replace(/'/g, '"'));
    if (
      Array.isArray(arr) &&
      arr.length === 5 &&
      arr.every(
        (c, i, a) => /^#([0-9a-fA-F]{6})$/.test(c) && a.indexOf(c) === i
      )
    ) {
      return arr;
    }
  } catch {}
  // Fallback: extract unique hex codes
  const hexes = Array.from(new Set(text.match(/#([0-9a-fA-F]{6})/g) || []));
  if (hexes.length === 5) return hexes;
  // Final fallback: return a default palette
  return ["#31d8da", "#bfd219", "#8da2c9", "#384171", "#0d63c1"];
}
