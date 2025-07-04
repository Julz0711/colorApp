import { ClipboardIcon, CheckIcon } from "@radix-ui/react-icons";
import { useState } from "react";

type Props = {
  onClick: () => void;
  title?: string;
  className?: string;
};

const CopyButton = ({ onClick, title, className }: Props) => {
  const [copied, setCopied] = useState(false);

  const handleClick = () => {
    onClick();
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      className={`absolute right-2 top-2 rounded-md flex items-center justify-center p-2 bg-white/10 w-10 h-10 cursor-pointer transition-colors hover:bg-black/20 ${
        className || ""
      }`}
      onClick={handleClick}
      title={title}
      type="button"
    >
      {copied ? (
        <CheckIcon className="inline text-green-400 w-5 h-6" />
      ) : (
        <ClipboardIcon className="inline text-gray-300 w-5 h-6" />
      )}
    </button>
  );
};

export default CopyButton;
