import type { FC } from "react";

interface CloseButtonProps {
  label: string;
  onClose: () => void;
  newClassName?: string;
  className?: string;
}

const CloseButton: FC<CloseButtonProps> = ({
  label,
  onClose,
  newClassName,
  className,
}) => {
  return (
    <>
      <button
        type="button"
        className={`${newClassName ? newClassName : `px-4 py-3 bg-[#1C2B5E] hover:bg-[#243470] text-[#c9a84c] hover:text-[#d4b563] text-sm font-medium cursor-pointer rounded-lg shadow-lg border border-[#c9a84c]/20 hover:border-[#c9a84c]/50 transition-all duration-200 ${className}`}`}
        onClick={onClose}
      >
        {label}
      </button>
    </>
  );
};

export default CloseButton;
