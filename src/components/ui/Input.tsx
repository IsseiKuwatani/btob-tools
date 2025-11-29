"use client";

import { InputHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helper?: string;
  error?: string;
  prefix?: string;
  suffix?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, helper, error, prefix, suffix, className = "", ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-foreground mb-2">
            {label}
          </label>
        )}
        <div className="relative">
          {prefix && (
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground-muted text-sm">
              {prefix}
            </span>
          )}
          <input
            ref={ref}
            className={`
              w-full px-3 py-2.5 rounded-lg border border-border bg-white
              text-foreground placeholder:text-foreground-muted text-sm
              focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
              transition-all duration-200
              ${prefix ? "pl-8" : ""}
              ${suffix ? "pr-10" : ""}
              ${error ? "border-red-500 focus:ring-red-500" : ""}
              ${className}
            `}
            {...props}
          />
          {suffix && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground-muted text-sm">
              {suffix}
            </span>
          )}
        </div>
        {helper && !error && (
          <p className="mt-1.5 text-xs text-foreground-muted">{helper}</p>
        )}
        {error && (
          <p className="mt-1.5 text-xs text-red-500">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
