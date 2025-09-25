import React, { forwardRef } from "react";
import clsx from "clsx";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  success?: boolean;
  error?: boolean;
  hint?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      type = "text",
      id,
      name,
      placeholder,
      value,
      onChange,
      className,
      min,
      max,
      step,
      disabled = false,
      success = false,
      error = false,
      hint,
      ...rest
    },
    ref
  ) => {
    const inputClasses = clsx(
      "h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30",
      {
        // Trạng thái disabled
        "text-gray-500 border-gray-300 opacity-40 bg-gray-100 cursor-not-allowed dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700":
          disabled,
        // Trạng thái error
        "border-error-500 focus:border-error-300 focus:ring-error-500/20 dark:text-error-400 dark:border-error-500 dark:focus:border-error-800":
          !disabled && error,
        // Trạng thái success
        "border-success-500 focus:border-success-300 focus:ring-success-500/20 dark:text-success-400 dark:border-success-500 dark:focus:border-success-800":
          !disabled && success,
        // Mặc định
        "bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:border-gray-700 dark:text-white/90 dark:focus:border-brand-800":
          !disabled && !error && !success,
      },
      className
    );

    return (
      <div className="relative">
        <input
          ref={ref}
          type={type}
          id={id}
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          min={min}
          max={max}
          step={step}
          disabled={disabled}
          className={inputClasses}
          {...rest}
        />

        {hint && (
          <p
            className={clsx("mt-1.5 text-xs", {
              "text-error-500": error,
              "text-success-500": success,
              "text-gray-500": !error && !success,
            })}
          >
            {hint}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
