import type { FC } from "react";

interface ModalCloseButtonProps {
  onClose: () => void;
}

const ModalCloseButton: FC<ModalCloseButtonProps> = ({ onClose }) => {
  return (
    <>
      <button
        type="button"
        onClick={onClose}
        className="absolute right-4 top-4 z-999 flex h-9.5 w-9.5 items-center justify-center rounded-full bg-[#0E1A3A] text-[#c9a84c] border border-[#c9a84c]/30 transition-all duration-200 hover:bg-[#6B1E3C] hover:text-white hover:border-[#6B1E3C] sm:h-11 sm:w-11 cursor-pointer shadow-md"
      >
        <svg
          className="w-5 h-5"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          fill="none"
          viewBox="0 0 24 24"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M6 18 17.94 6M18 18 6.06 6"
          />
        </svg>
      </button>
    </>
  );
};

export default ModalCloseButton;
