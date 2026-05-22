import { useEffect, type FC } from "react";

interface ToastMessageProps {
  message: string;
  //   isSuccess: boolean;
  isVisible: boolean;
  onClose: () => void;
}

const ToastMessage: FC<ToastMessageProps> = ({
  message,
  //   isSuccess,
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
        className={`fixed top-4 right-4 z-60 flex items-center w-auto max-w-xs p-4 m-4 text-emerald-900 bg-emerald-50 rounded-lg shadow-lg transition-opacity duration-300 ${isVisible ? "opacity-100" : "opacity-0"}`}
        role="alert"
      >
        <div
          className={`inline-flex items-center justify-center shrink-0 w-8 h-8 text-emerald-600 bg-emerald-100 rounded-lg transition-transform duration-300 ${isVisible ? "translate-y-0" : "-translate-y-10"}`}
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
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M5 11.917 9.724 16.5 19 7.5"
            />
          </svg>
          <span className="sr-only">Check icon</span>
        </div>
        <div className="ml-3 text-sm font-normal">{message}</div>
      </div>
    </>
  );
};

export default ToastMessage;
