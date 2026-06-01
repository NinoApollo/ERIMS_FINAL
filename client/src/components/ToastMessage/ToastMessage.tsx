import { useEffect, type FC } from "react";

interface ToastMessageProps {
  message: string;
  isFailed?: boolean;
  isVisible: boolean;
  onClose: () => void;
}

const ToastMessage: FC<ToastMessageProps> = ({
  message,
  isFailed,
  isVisible,
  onClose,
}) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  return (
    <>
      <div
        className={`fixed top-4 right-4 z-999999 flex items-center w-auto max-w-xs p-4 m-4
          ${
            isFailed
              ? "bg-[#1C2B5E] border border-[#6B1E3C] shadow-[#6B1E3C]/30"
              : "bg-[#1C2B5E] border border-[#c9a84c]/30 shadow-[#c9a84c]/10"
          }
          rounded-xl shadow-lg transition-opacity duration-300
          ${isVisible ? "opacity-100" : "opacity-0"}`}
        role="alert"
      >
        <div
          className={`inline-flex items-center justify-center shrink-0 w-8 h-8 rounded-lg transition-transform duration-300
            ${isVisible ? "translate-y-0" : "-translate-y-10"}
            ${
              isFailed
                ? "bg-[#6B1E3C]/40 text-[#c9a84c] border border-[#6B1E3C]"
                : "bg-[#c9a84c]/15 text-[#c9a84c] border border-[#c9a84c]/30"
            }`}
        >
          {isFailed ? (
            <>
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
              <span className="sr-only">Error icon</span>
            </>
          ) : (
            <>
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
                  d="M5 11.917 9.724 16.5 19 7.5"
                />
              </svg>
              <span className="sr-only">Check icon</span>
            </>
          )}
        </div>
        <div className="ml-3 text-sm font-normal text-slate-200">{message}</div>
      </div>
    </>
  );
};

export default ToastMessage;
