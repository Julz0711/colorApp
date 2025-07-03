export async function fetchPaletteFromGemini(
  prompt: string
): Promise<string[]> {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey) throw new Error("Google Gemini API key not set in .env");
  // Use gemini-1.5-pro model for free tier
  const url = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-pro:generateContent?key=${apiKey}`;
  const body = {
    contents: [
      {
        parts: [
          {
            text: `Return ONLY a JSON array of 5 valid hex color codes (e.g. [\"#FF0000\",...]) for a color palette inspired by: ${prompt}. No explanation, no extra text.`,
          },
        ],
      },
    ],
  };
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Gemini API error: ${response.status} ${errText}`);
  }
  const data = await response.json();
  // Try to extract the JSON array from the response
  let arr: string[] = [];
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
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
  if (!hexes || hexes.length < 5)
    throw new Error("Could not parse 5 hex codes from Gemini response");
  return hexes.slice(0, 5);
}
