import type { ChangeEvent, FC } from "react";

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
}) => {
  return (
    <>
      <div className="relative group ml-4">
        <input
          type={type}
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          className={`${newInputClassName ? newInputClassName : `block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-800 bg-linear-to-br from-emerald-700 via-emerald-600 to-teal-700backdrop-blur-sm rounded-xl border-2 transition-all duration-200 appearance-none focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 hover:border-emerald-300 peer ${inputClassName}`}`}
          placeholder=" "
          required={required}
          autoFocus={autoFocus}
          disabled={disabled}
          readOnly={readonly}
        />
        <label
          htmlFor={name}
          className={`${newLabelClassName ? newLabelClassName : `absolute text-sm text-emerald-100 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-left bg-linear-to-br from-emerald-700 via-emerald-600 to-teal-700 backdrop-blur-sm px-2 rounded-lg peer-focus:px-2 peer-focus:text-white peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto inset-s-1 ${labelClassName}`}`}
        >
          {label}
          {required && <span className="text-rose-300 ml-1 text-sm">*</span>}
        </label>
        {errors && errors.length > 0 && (
          <span className="text-rose-300 text-xs mt-1 block animate-pulse">
            {errors[0]}
          </span>
        )}
      </div>
    </>
  );
};

export default FloatingLabelInput;
