export async function fetchPaletteFromOpenAI(
  prompt: string
): Promise<string[]> {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
  if (!apiKey) throw new Error("OpenAI API key not set in .env");

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "You are a helpful assistant that generates color palettes. Only return a comma-separated list of 5 hex color codes, no extra text.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      max_tokens: 100,
      temperature: 0.7,
    }),
  });

  if (!response.ok) throw new Error("OpenAI API error");
  const data = await response.json();
  const text = data.choices?.[0]?.message?.content || "";
  // Extract hex codes from the response
  const hexes = text.match(/#([0-9a-fA-F]{6})/g);
  if (!hexes || hexes.length < 5)
    throw new Error("Could not parse 5 hex codes from AI response");
  return hexes.slice(0, 5);
}
