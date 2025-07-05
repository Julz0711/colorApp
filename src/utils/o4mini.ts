import ModelClient, { isUnexpected } from "@azure-rest/ai-inference";
import { AzureKeyCredential } from "@azure/core-auth";

const endpoint = "https://models.github.ai/inference";
const model = "openai/o4-mini";
const token = import.meta.env.VITE_GITHUB_TOKEN;

if (!token) {
  throw new Error("GitHub token not set in .env (VITE_GITHUB_TOKEN)");
}

/**
 * Generate a color palette using OpenAI O4-Mini model via Azure REST SDK.
 * @param prompt User prompt for palette inspiration
 * @returns Promise<string[]> Array of 5 hex color codes
 */
export async function fetchPaletteFromO4Mini(
  prompt: string
): Promise<string[]> {
  const client = ModelClient(endpoint, new AzureKeyCredential(token));
  console.log("[O4-Mini] Sending request", { prompt, model, endpoint });
  const response = await client.path("/chat/completions").post({
    queryParameters: { "api-version": "2024-12-01-preview" },
    body: {
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        {
          role: "user",
          // More precise prompt for color palette
          content:
            `Return ONLY a JSON array of 5 visually distinct, aesthetically pleasing hex color codes (e.g. [\"#FF0000\",...]) for a color palette inspired by: ${prompt}. No explanation, no extra text, no trailing comma.`,
        },
      ],
      max_completion_tokens: 4000,
      model,
    } as any,
  });
  console.log("[O4-Mini] Full API response", response);
  console.log("[O4-Mini] API response.body", response.body);
  if (isUnexpected(response)) {
    console.error("[O4-Mini] API error", response.body);
    throw new Error(response.body.error?.message || "O4-Mini API error");
  }
  // Log the full choices array for debugging
  console.log("[O4-Mini] response.body.choices", response.body.choices);
  // Log the entire choices[0] object
  if (response.body.choices && response.body.choices[0]) {
    console.log("[O4-Mini] choices[0] object:", response.body.choices[0]);
    console.log(
      "[O4-Mini] finish_reason:",
      response.body.choices[0].finish_reason
    );
  }
  if (response.body.usage) {
    console.log("[O4-Mini] usage:", response.body.usage);
  }
  const text = response.body.choices?.[0]?.message?.content || "";
  if (!text) {
    console.warn(
      "[O4-Mini] Empty content in response.body.choices[0].message.content",
      response.body
    );
  }
  console.log("[O4-Mini API raw response]", text);
  let arr: string[] = [];
  try {
    arr = JSON.parse(text.replace(/'/g, '"'));
    console.log("[O4-Mini] Parsed JSON array", arr);
    if (
      Array.isArray(arr) &&
      arr.length >= 5 &&
      arr.every((c) => /^#([0-9a-fA-F]{6})$/.test(c))
    ) {
      return arr.slice(0, 5);
    }
  } catch (err) {
    console.warn("[O4-Mini] JSON parse error", err, text);
  }
  // Fallback: extract hex codes
  const hexes = text.match(/#([0-9a-fA-F]{6})/g);
  console.log("[O4-Mini] Extracted hex codes", hexes);
  if (hexes && hexes.length >= 5) {
    return hexes.slice(0, 5);
  }
  // Final fallback: return a default palette
  console.warn(
    "[O4-Mini] Returning default palette due to invalid or empty response. Full response.body:",
    response.body
  );
  return ["#000000", "#111111", "#222222", "#333333", "#444444"];
}
