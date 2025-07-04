import { Glow } from "@codaworks/react-glow";
import React, { useState } from "react";
import { ClipboardIcon, CheckIcon } from "@radix-ui/react-icons";
import { Box, Card, Code } from "@radix-ui/themes";
import { generateTailwindThemeSnippet } from "../utils/colorUtils";
import CopyButton from "./CopyButton";
import "../index.css";

interface PaletteProps {
  colors: string[];
}

export const Palette: React.FC<PaletteProps> = ({ colors }) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [snippetCopied, setSnippetCopied] = useState(false);
  const [allSnippetCopied, setAllSnippetCopied] = useState(false);

  const handleCopy = (color: string, idx: number) => {
    navigator.clipboard.writeText(color);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 1500);
  };

  const handleSnippetCopy = () => {
    const snippet = `@theme {\n  //add custom coulors here\n}`;
    navigator.clipboard.writeText(snippet);
    setSnippetCopied(true);
    setTimeout(() => setSnippetCopied(false), 2000);
  };

  const handleAllSnippetCopy = () => {
    const snippet = generateTailwindThemeSnippet(colors);
    navigator.clipboard.writeText(snippet);
    setAllSnippetCopied(true);
    setTimeout(() => setAllSnippetCopied(false), 2000);
  };

  return (
    <Box>
      <Card variant="surface" size="3" className="w-128">
        <div className="flex flex-col items-center justify-center w-full">
          <div className="text-white text-md mb-4">
            Use this snippet in your main CSS file for declaring custom tailwind
            classes:
          </div>
          <Code
            variant="soft"
            className="w-full rounded-lg px-4 py-3 text-sm flex flex-col gap-0 items-start relative"
            color="pink"
            size="5"
          >
            <span>@theme {"{"}</span>
            <span className="text-gray-400 ml-6">//add custom colors here</span>
            <span>{"}"}</span>
            <CopyButton
              onClick={handleSnippetCopy}
              title="Copy snippet"
              className="ml-3"
            />
            {snippetCopied && <span className="copied-tooltip">Copied!</span>}
          </Code>
        </div>
      </Card>
      <div className="flex flex-row gap-8 w-full items-center justify-left my-8">
        {colors.map((color, idx) => (
          <div key={idx} className="flex flex-col items-center">
            <Card
              variant="surface"
              className={`glow:text-glow/50 glow:bg-red-500 h-64 z-90 rounded-xl flex flex-col items-center justify-center text-white font-semibold hover:cursor-pointer relative group`}
              style={{
                width: "9vw",
                minWidth: "40px",
                maxWidth: "200x",
              }}
              onClick={() => handleCopy(color, idx)}
              onMouseEnter={() => setHoveredIndex(idx)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <div
                className="w-full h-full flex items-center justify-center transition-all duration-200 relative rounded-sm"
                style={{
                  backgroundColor: color,
                  opacity: hoveredIndex === idx ? 0.5 : 1,
                }}
              >
                <span className="text-center absolute z-90 text-md rounded-b-lg text-white flex-1 flex items-center justify-center">
                  {color}
                </span>
                {(hoveredIndex === idx || copiedIndex === idx) && (
                  <span
                    className="absolute text-center bottom-6 left-1/2 -translate-x-1/2 text-white text-sm rounded z-20 flex items-center"
                    style={{ background: "none" }}
                  >
                    {copiedIndex === idx ? (
                      <CheckIcon className="inline w-7 h-8" />
                    ) : (
                      <>
                        Copy
                        <ClipboardIcon className="ml-1 w-4 h-4" />
                      </>
                    )}
                  </span>
                )}
              </div>
            </Card>
            {/* Code snippet area below each color */}
            <div className="w-full flex justify-center mt-4">
              <Code
                variant="soft"
                className="rounded px-3 py-1 flex items-center gap-2"
                color="pink"
                size="3"
              >
                <span>{`--color-${idx + 1}: ${color};`}</span>
                <button
                  className="ml-2 text-gray-400 hover:text-white transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigator.clipboard.writeText(
                      `--color-${idx + 1}: ${color};`
                    );
                    setCopiedIndex(idx);
                    setTimeout(() => setCopiedIndex(null), 1200);
                  }}
                  title="Copy code"
                  style={{
                    background: "none",
                    border: "none",
                    padding: 0,
                    cursor: "pointer",
                  }}
                ></button>
              </Code>
            </div>
          </div>
        ))}
      </div>
      {/* Full palette code snippet below the palette */}
      <Card variant="surface" size="3" className="w-128">
        <p className="text-white text-md mb-4">Copy the entire snippet here:</p>
        <Code
          variant="soft"
          className="w-full rounded-lg px-4 py-3 text-sm flex items-center gap-2 relative font-code"
          color="pink"
          size="5"
        >
          <span style={{ whiteSpace: "pre" }}>
            {generateTailwindThemeSnippet(colors)}
          </span>
          <CopyButton
            onClick={handleAllSnippetCopy}
            title="Copy full palette snippet"
          />
          {allSnippetCopied && <span className="copied-tooltip">Copied!</span>}
        </Code>
      </Card>
    </Box>
  );
};
