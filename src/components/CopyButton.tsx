import { ClipboardIcon } from "@radix-ui/react-icons";

type Props = {
  onClick: () => void;
  title?: string;
  className?: string;
};

const CopyButton = ({ onClick, title, className }: Props) => {
  return (
    <button
      className={`absolute right-2 top-2 rounded-md flex items-center justify-center p-2 bg-white/10 w-10 h-10 cursor-pointer transition-colors hover:bg-black/20 ${
        className || ""
      }`}
      onClick={onClick}
      title={title}
      type="button"
    >
      <ClipboardIcon className="inline text-gray-300 w-5 h-6" />
    </button>
  );
};

export default CopyButton;
