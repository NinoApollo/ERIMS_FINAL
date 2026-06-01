import { useEffect, useRef, type FC, type ReactNode } from "react";
import ModalCloseButton from "../Button/ModalCloseButton";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  className?: string;
  children: ReactNode;
  showCloseButton?: boolean;
  isFullScreen?: boolean;
}

const Modal: FC<ModalProps> = ({
  isOpen,
  onClose,
  className,
  children,
  showCloseButton,
  isFullScreen,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  const handleEscape = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      onClose();
    }
  };

  const contentClasses = isFullScreen
    ? "relative w-full h-full rounded-xl bg-[#1C2B5E] border border-[#c9a84c]/20 flex flex-col shadow-2xl"
    : "relative w-full sm:max-w-md md:max-w-lg lg:max-w-2xl rounded-xl bg-[#1C2B5E] border border-[#c9a84c]/20 max-h-[90vh] flex flex-col shadow-2xl shadow-black/50";

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
    }
    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 flex items-center justify-center overflow-y-auto modal z-99999 p-4">
        {!isFullScreen && (
          <div className="fixed inset-0 w-full h-full bg-[#0E1A3A]/80 backdrop-blur-sm" />
        )}
        <div
          ref={modalRef}
          className={`${contentClasses} ${className}`}
          onClick={(e) => e.stopPropagation()}
        >
          {showCloseButton && <ModalCloseButton onClose={onClose} />}
          <div className="flex-1 overflow-y-auto p-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {children}
          </div>
        </div>
      </div>
    </>
  );
};

export default Modal;
