export async function fetchPaletteFromHuggingFace(
  prompt: string
): Promise<string[]> {
  const HF_API_URL =
    "https://api-inference.huggingface.co/models/mradermacher/mistral7b_text_to_json_v3.1-GGUF";
  const HF_TOKEN = import.meta.env.VITE_HF_TOKEN;
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(HF_TOKEN ? { Authorization: `Bearer ${HF_TOKEN}` } : {}),
  };
  const body = JSON.stringify({
    inputs: `Generate a JSON array of 5 hex color codes for a color palette inspired by: ${prompt}`,
  });
  const response = await fetch(HF_API_URL, {
    method: "POST",
    headers,
    body,
  });
  if (!response.ok) throw new Error("Hugging Face API error");
  const data = await response.json();
  // Try to parse the output as a JSON array
  let arr: string[] = [];
  if (Array.isArray(data)) {
    arr = data;
  } else if (typeof data === "object" && data.hasOwnProperty("[0]")) {
    arr = Object.values(data);
  } else if (
    typeof data === "object" &&
    data.hasOwnProperty("generated_text")
  ) {
    try {
      arr = JSON.parse(data.generated_text);
    } catch {}
  } else if (typeof data === "string") {
    try {
      arr = JSON.parse(data);
    } catch {}
  }
  if (
    !arr ||
    arr.length < 5 ||
    !arr.every((c) => /^#([0-9a-fA-F]{6})$/.test(c))
  ) {
    throw new Error("Could not parse 5 hex codes from Hugging Face response");
  }
  return arr.slice(0, 5);
}
