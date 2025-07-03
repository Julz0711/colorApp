import ModelClient, { isUnexpected } from "@azure-rest/ai-inference";
import { AzureKeyCredential } from "@azure/core-auth";

const endpoint = "https://models.github.ai/inference";
const model = "xai/grok-3-mini";
const token = import.meta.env.VITE_GITHUB_TOKEN;

if (!token) {
  throw new Error("GitHub token not set in .env (VITE_GITHUB_TOKEN)");
}

/**
 * Generate a color palette using xAI Grok-3-Mini model.
 * @param prompt User prompt for palette inspiration
 * @returns Promise<string[]> Array of 5 hex color codes
 */
export async function fetchPaletteFromGrokMini(
  prompt: string
): Promise<string[]> {
  const client = ModelClient(endpoint, new AzureKeyCredential(token));
  const response = await client.path("/chat/completions").post({
    body: {
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        {
          role: "user",
          content: `Return ONLY a JSON array of 5 valid hex color codes (e.g. [\"#FF0000\",...]) for a color palette inspired by: ${prompt}. No explanation, no extra text. If you cannot comply, just return [\"#000000\", \"#111111\", \"#222222\", \"#333333\", \"#444444\"]`,
        },
      ],
      temperature: 1.0,
      top_p: 1.0,
      max_tokens: 200,
      model,
    },
  });
  if (isUnexpected(response)) {
    throw new Error(response.body.error?.message || "Grok-3-Mini API error");
  }
  const text = response.body.choices?.[0]?.message?.content || "";
  let arr: string[] = [];
  try {
    arr = JSON.parse(text.replace(/'/g, '"'));
    if (
      Array.isArray(arr) &&
      arr.length >= 5 &&
      arr.every((c) => /^#([0-9a-fA-F]{6})$/.test(c))
    ) {
      return arr.slice(0, 5);
    }
  } catch {}
  // Fallback: extract hex codes
  const hexes = text.match(/#([0-9a-fA-F]{6})/g);
  if (hexes && hexes.length >= 5) {
    return hexes.slice(0, 5);
  }
  // Final fallback: return a default palette
  return ["#000000", "#111111", "#222222", "#333333", "#444444"];
}
