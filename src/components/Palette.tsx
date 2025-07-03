import { Glow } from "@codaworks/react-glow";
import React, { useState } from "react";
import { ClipboardIcon } from "@radix-ui/react-icons";
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
    setTimeout(() => setCopiedIndex(null), 1200);
  };

  const handleSnippetCopy = () => {
    const snippet = `@theme {\n  //add custom coulors here\n}`;
    navigator.clipboard.writeText(snippet);
    setSnippetCopied(true);
    setTimeout(() => setSnippetCopied(false), 1200);
  };

  const handleAllSnippetCopy = () => {
    const snippet = generateTailwindThemeSnippet(colors);
    navigator.clipboard.writeText(snippet);
    setAllSnippetCopied(true);
    setTimeout(() => setAllSnippetCopied(false), 2500);
  };

  return (
    <Box>
      <Card variant="surface" size="3" className="w-128">
        <div className="flex flex-col items-center justify-center w-full font-code">
          <div className="text-white text-md mb-4">
            Use this snippet in your main CSS file for declaring custom tailwind
            classes:
          </div>
          <Code
            variant="soft"
            className="w-full rounded-lg px-4 py-3 text-sm flex items-center gap-2 relative font-code"
            color="pink"
            size="5"
          >
            <div className="flex flex-col items-start gap-2">
              <span>@theme {"{"}</span>
              <span className="text-gray-400 ml-6">
                //add custom colours here
              </span>
              <span>{"}"}</span>
            </div>
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
            <Glow color="red">
              <div
                className={`glow:text-glow/50 glow:bg-red-500 h-64 rounded-xl flex flex-col items-center justify-center text-white font-semibold inset-shadow-xl transition-all duration-200 border-8 border-[#131313] ring-1 ring-gray-700 hover:ring-gray-100 hover:ring-3 hover:cursor-pointer relative group`}
                style={{
                  backgroundColor: color,
                  opacity: hoveredIndex === idx ? 0.5 : 1,
                  width: "9vw",
                  minWidth: "40px",
                  maxWidth: "200x",
                }}
                onClick={() => handleCopy(color, idx)}
                onMouseEnter={() => setHoveredIndex(idx)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <span className="w-full text-center text-shadow-md text-md py-1 rounded-b-lg text-white flex-1 flex items-center justify-center">
                  {color}
                </span>
                {(hoveredIndex === idx || copiedIndex === idx) && (
                  <span
                    className="absolute text-center bottom-6 left-1/2 -translate-x-1/2 text-white text-sm rounded z-20 flex items-center"
                    style={{ background: "none" }}
                  >
                    {copiedIndex === idx ? (
                      <>Copied!</>
                    ) : (
                      <>
                        Copy
                        <ClipboardIcon className="ml-1 w-4 h-4" />
                      </>
                    )}
                  </span>
                )}
              </div>
            </Glow>
            {/* Code snippet area below each color */}
            <div className="w-full flex justify-center mt-4 font-code">
              <Code
                variant="soft"
                className="rounded px-3 py-1 flex items-center gap-2 font-code"
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
          {allSnippetCopied && (
            <span className="absolute -bottom-7 left-1/2 -translate-x-1/2 bg-black bg-opacity-80 text-xs px-2 py-1 rounded text-white animate-fade-in">
              Copied!
            </span>
          )}
        </Code>
      </Card>
    </Box>
  );
};
