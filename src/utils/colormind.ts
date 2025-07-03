export async function fetchPaletteFromColormind(): Promise<string[]> {
  // Use http, not https, as per Colormind docs
  const response = await fetch("http://colormind.io/api/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ model: "default" }),
  });
  if (!response.ok) throw new Error("Colormind API error");
  const data = await response.json();
  if (!data.result || !Array.isArray(data.result) || data.result.length < 5) {
    throw new Error("Invalid Colormind response");
  }
  // Convert [r,g,b] to hex
  return data.result.slice(0, 5).map((rgb: number[]) => {
    return (
      "#" + rgb.map((v: number) => v.toString(16).padStart(2, "0")).join("")
    );
  });
}
