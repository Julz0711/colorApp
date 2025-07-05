import { useState } from "react";
import { Palette } from "./components/Palette";
import { generateRandomPalette } from "./utils/colorUtils";
import { fetchPaletteFromDeepSeek } from "./utils/deepseek";
import { fetchPaletteFromGrokMini } from "./utils/grokmini";
import { fetchPaletteFromO4Mini } from "./utils/o4mini";
import "./App.css";
import { Box, Button, Card, Spinner } from "@radix-ui/themes";

export default function App() {
  const [colors, setColors] = useState<string[]>(generateRandomPalette());
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [aiUsed, setAiUsed] = useState<string | null>(null);

  const handleGenerate = () => {
    setColors(generateRandomPalette());
    setAiUsed(null);
  };

  const handleAIGenerate = async () => {
    setLoading(true);
    setError(null);
    setAiUsed(null);
    try {
      // Try O4 Mini first
      const aiColors = await fetchPaletteFromO4Mini(
        `Theme description: ${input.trim()}`
      );
      setColors(aiColors);
      setAiUsed("O4-Mini");
    } catch (e: any) {
      console.error("O4-Mini error:", e);
      // If O4 Mini fails, fallback to Grok Mini
      try {
        const aiColors = await fetchPaletteFromGrokMini(
          `Theme description: ${input.trim()}`
        );
        setColors(aiColors);
        setAiUsed("Grok-3-Mini");
        setError("O4-Mini failed. Used Grok-3-Mini as fallback.");
      } catch (e2: any) {
        console.error("Grok-3-Mini error:", e2);
        setError(e2.message || "AI error");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box width="100vw" height="100vh" className="bg-[#121212]">
      <div className="max-w-[1440px] mx-auto px-8 py-12">
        <h1 className="font-bold text-white text-[2rem] mb-6">
          🎨 Color Palette Generator
        </h1>
        <div className="flex flex-col md:flex-col gap-8 mb-6 w-full items-start justify-center">
          {/* AI Prompt Area */}
          <Card variant="surface" size="3" className="w-3xl">
            <p className="mb-2">
              Describe your color palette in a short sentence:
            </p>
            <div className="flex flex-row gap-4">
              <input
                className="w-full px-3 py-2 rounded-lg border border-gray-700 bg-[#232323] text-white focus:outline-none focus:ring-2 focus:ring-pink-500 font-grotesk mb-2"
                placeholder="Describe your palette (e.g. sunset, cyberpunk, soft pastels...)"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={loading}
              />
              <Button
                color="pink"
                variant="solid"
                size="3"
                onClick={handleAIGenerate}
                disabled={loading || !input.trim()}
                className="w-full"
              >
                {loading ? (
                  <div className="flex flex-row gap-2 items-center">
                    <Spinner />
                    <p>Generating...</p>
                  </div>
                ) : (
                  <div className="flex flex-row gap-2 items-center">
                    <p>AI Generate</p>
                  </div>
                )}
              </Button>
            </div>
            <hr className="text-gray-700 my-4"></hr>
            <p className="mb-2">Or generate a random palette:</p>
            <Button
              variant="solid"
              size="3"
              onClick={handleGenerate}
              disabled={loading}
              className="w-full"
              color="blue"
            >
              Random
            </Button>
          </Card>
        </div>
        {error && <div className="text-red-400 mb-4">{error}</div>}
        <Palette colors={colors} />
        {aiUsed && (
          <div className="text-xs text-gray-400 mb-2">AI used: {aiUsed}</div>
        )}
      </div>
    </Box>
  );
}
