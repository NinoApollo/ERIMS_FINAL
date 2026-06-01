import type { FC } from "react";

interface RemoveButtonProps {
  label: string;
  className?: string;
  newClassName?: string;
  onRemove: () => void;
}

const RemoveButton: FC<RemoveButtonProps> = ({
  label,
  className,
  newClassName,
  onRemove,
}) => {
  return (
    <>
      <button
        type="button"
        className={
          newClassName
            ? newClassName
            : `px-4 py-3 bg-[#6B1E3C] hover:bg-[#7d2347] text-white text-sm font-medium cursor-pointer rounded-lg shadow-lg shadow-[#6B1E3C]/30 border border-[#c9a84c]/20 hover:border-[#c9a84c]/40 transition-all duration-200 ${className}`
        }
        onClick={onRemove}
      >
        {label}
      </button>
    </>
  );
};

export default RemoveButton;
