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
    ? "border-rose-400 focus:border-rose-500"
    : "border-emerald-200 focus:border-emerald-500";
  const labelColor = hasError ? "text-rose-500" : "text-emerald-600";
  const bgColor = "bg-white";

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
          text-sm text-emerald-900 
          ${bgColor} rounded-xl 
          border-2 transition-all duration-200 
          appearance-none cursor-pointer
          peer
          ${borderColor}
          ${disabled && "bg-emerald-50 opacity-60 cursor-not-allowed"}
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
          ${bgColor} rounded
          transition-all
          peer-placeholder-shown:scale-100 
          peer-placeholder-shown:-translate-y-1/2 
          peer-placeholder-shown:top-1/2
          peer-focus:top-2 
          peer-focus:scale-75 
          peer-focus:-translate-y-3
          ${labelColor}
          ${disabled && "text-emerald-300"}
          ${newLabelClassName || labelClassName || ""}
        `}
        >
          {label}
          {required && <span className="text-rose-400 ml-0.5">*</span>}
        </label>

        {/* Dropdown arrow icon */}
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <svg
            className={`w-4 h-4 transition-transform ${hasError ? "text-rose-400" : "text-emerald-400"}`}
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
        <span className="text-rose-500 text-xs mt-1 ml-1"> {errors[0]} </span>
      )}
    </>
  );
};

export default FloatingLabelSelect;
