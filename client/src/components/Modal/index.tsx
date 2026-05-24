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
    ? "relative w-full h-full rounded-3xl bg-white/95 border border-emerald-100 shadow-2xl flex flex-col"
    : "relative w-full sm:max-w-md md:max-w-lg lg:max-w-2xl rounded-3xl bg-white/95 border border-emerald-100 shadow-2xl max-h-[90vh] flex flex-col overflow-hidden";

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
      <div className="fixed inset-0 z-9999 flex items-center justify-center overflow-y-auto bg-black/20 backdrop-blur-sm p-4">
        {isFullScreen && (
          <div className="fixed inset-0 w-full h-full bg-emerald-900/15 backdrop-blur-sm" />
        )}
        <div
          ref={modalRef}
          className={`${contentClasses} ${className ?? ""}`}
          onClick={(e) => e.stopPropagation()}
        >
          {showCloseButton && <ModalCloseButton onClose={onClose} />}
          <div className="flex-1 overflow-y-auto p-5 sm:p-6">{children}</div>
        </div>
      </div>
    </>
  );
};

export default Modal;
