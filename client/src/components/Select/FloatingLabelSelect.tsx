import type { ChangeEvent, FC, ReactNode } from "react";

interface FloatingLabelSelectProps {
  label: string;
  newSelectClassName?: string;
  selectClassName?: string;
  newLabelClassName?: string;
  labelClassName?: string;
  name?: string;
  value?: string | any;
  onChange?: (e: ChangeEvent<HTMLSelectElement>) => void;
  required?: boolean;
  autoFocus?: boolean;
  disabled?: boolean;
  errors?: string[];
  children: ReactNode;
}

const FloatingLabelSelect: FC<FloatingLabelSelectProps> = ({
  label,
  newSelectClassName,
  selectClassName,
  newLabelClassName,
  labelClassName,
  name,
  value,
  onChange,
  required,
  autoFocus,
  disabled,
  errors,
  children,
}) => {
  const hasError = errors && errors.length > 0;
  const borderColor = hasError
    ? "border-[#c9a84c]/60 focus:border-[#c9a84c]"
    : "border-[#1C2B5E] focus:border-[#c9a84c]/60 hover:border-[#c9a84c]/30";
  const labelColor = hasError ? "text-[#c9a84c]" : "text-[#c9a84c]/70";

  return (
    <>
      <div className="relative w-full">
        <select
          name={name}
          id={name}
          value={value}
          onChange={onChange}
          autoFocus={autoFocus}
          disabled={disabled}
          className={`
            w-full px-4 pb-2.5 pt-5
            text-sm text-white
            bg-[#0E1A3A] rounded-xl
            border-2 transition-all duration-200
            appearance-none cursor-pointer
            focus:outline-none focus:ring-2 focus:ring-[#c9a84c]/20
            peer
            ${borderColor}
            ${disabled ? "opacity-50 cursor-not-allowed" : ""}
            ${newSelectClassName || selectClassName || ""}
          `}
        >
          {children}
        </select>

        <label
          htmlFor={name}
          className={`
            absolute text-sm duration-300 transform
            -translate-y-3 scale-75 top-2 z-10
            origin-left left-3 px-1
            bg-[#0E1A3A] rounded
            transition-all
            peer-placeholder-shown:scale-100
            peer-placeholder-shown:-translate-y-1/2
            peer-placeholder-shown:top-1/2
            peer-focus:top-2
            peer-focus:scale-75
            peer-focus:-translate-y-3
            ${labelColor}
            ${disabled ? "text-[#c9a84c]/30" : ""}
            ${newLabelClassName || labelClassName || ""}
          `}
        >
          {label}
          {required && <span className="text-[#c9a84c] ml-0.5">*</span>}
        </label>

        {/* Dropdown arrow icon */}
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <svg
            className={`w-4 h-4 transition-transform ${hasError ? "text-[#c9a84c]" : "text-[#c9a84c]/50"}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </div>
      {errors && errors.length > 0 && (
        <span className="text-[#c9a84c] text-xs mt-1 ml-1">{errors[0]}</span>
      )}
    </>
  );
};

export default FloatingLabelSelect;
