import type { FC } from "react";
import Spinner from "../Spinner/Spinner";

interface SubmitButtonProps {
  label: string;
  newClassName?: string;
  className?: string;
  loading?: boolean;
  loadingLabel?: string;
}

const SubmitButton: FC<SubmitButtonProps> = ({
  label,
  newClassName,
  className,
  loading,
  loadingLabel,
}) => {
  return (
    <>
      <button
        type="submit"
        className={`${newClassName ? newClassName : `px-4 py-3 bg-[#6B1E3C] hover:bg-[#7d2347] text-white text-sm font-medium cursor-pointer rounded-lg shadow-lg shadow-[#6B1E3C]/30 border border-[#c9a84c]/20 hover:border-[#c9a84c]/40 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}`}
        disabled={loading}
      >
        {loading ? (
          <>
            <div className="flex gap-1 items-center">
              <div>{<Spinner size="xs" />}</div>
              {loadingLabel}
            </div>
          </>
        ) : (
          label
        )}
      </button>
    </>
  );
};

export default SubmitButton;
