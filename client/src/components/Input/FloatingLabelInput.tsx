import type { ChangeEvent, FC } from "react";
import { useState } from "react";

interface FloatingLabelInputProps {
  label: string;
  type: "text" | "date" | "password";
  name: string;
  value?: string | any;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  newLabelClassName?: string;
  labelClassName?: string;
  newInputClassName?: string;
  inputClassName?: string;
  required?: boolean;
  autoFocus?: boolean;
  disabled?: boolean;
  readonly?: boolean;
  errors?: string[];
  showPasswordToggle?: boolean;
}

const FloatingLabelInput: FC<FloatingLabelInputProps> = ({
  label,
  type,
  name,
  value,
  onChange,
  newLabelClassName,
  labelClassName,
  newInputClassName,
  inputClassName,
  required,
  autoFocus,
  disabled,
  readonly,
  errors,
  showPasswordToggle = true,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const getInputType = () => {
    if (type === "password" && showPasswordToggle && showPassword) {
      return "text";
    }
    return type;
  };

  const togglePasswordVisibility = () => {
    if (showPasswordToggle) {
      setShowPassword(!showPassword);
    }
  };

  const shouldShowEyeIcon =
    type === "password" && showPasswordToggle && !disabled && !readonly;

  const hasError = errors && errors.length > 0;

  return (
    <>
      <div className="relative group">
        <input
          type={getInputType()}
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          className={`${
            newInputClassName
              ? newInputClassName
              : `peer block px-2.5 pb-2.5 pt-4 w-full text-sm text-white bg-[#0E1A3A] backdrop-blur-sm rounded-xl border-2 transition-all duration-200 appearance-none focus:outline-none focus:ring-2 
                ${
                  hasError
                    ? "border-[#c9a84c]/60 focus:ring-[#c9a84c]/30 focus:border-[#c9a84c]"
                    : "border-[#1C2B5E] focus:ring-[#c9a84c]/20 focus:border-[#c9a84c]/60 hover:border-[#c9a84c]/30"
                }
                ${disabled ? "opacity-50 cursor-not-allowed" : ""}
                ${shouldShowEyeIcon ? "pr-10" : ""}
                ${inputClassName}`
          }`}
          placeholder=" "
          autoFocus={autoFocus}
          disabled={disabled}
          readOnly={readonly}
        />

        <label
          htmlFor={name}
          className={`${
            newLabelClassName
              ? newLabelClassName
              : `absolute text-sm duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-left bg-[#0E1A3A] px-2 rounded-lg
                peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2
                peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1
                ${hasError ? "text-[#c9a84c] peer-focus:text-[#c9a84c]" : "text-[#c9a84c]/70 peer-focus:text-[#c9a84c]"}
                ${labelClassName}`
          }`}
        >
          {label}
          {required && <span className="text-[#c9a84c] ml-1 text-sm">*</span>}
        </label>

        {shouldShowEyeIcon && (
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute inset-y-0 right-0 flex items-center pr-3 text-[#c9a84c]/60 hover:text-[#c9a84c] focus:outline-none transition-colors duration-200"
            tabIndex={-1}
          >
            {showPassword ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            )}
          </button>
        )}
      </div>
      {errors && errors.length > 0 && (
        <span className="text-[#c9a84c] text-xs mt-1 block">{errors[0]}</span>
      )}
    </>
  );
};

export default FloatingLabelInput;
