"use client";

import { InputHTMLAttributes, forwardRef } from "react";

interface SliderProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: string;
  showValue?: boolean;
  valueFormatter?: (value: number) => string;
}

export const Slider = forwardRef<HTMLInputElement, SliderProps>(
  ({ label, showValue = true, valueFormatter, className = "", value, ...props }, ref) => {
    const displayValue = valueFormatter 
      ? valueFormatter(Number(value)) 
      : String(value);

    return (
      <div className="w-full">
        {(label || showValue) && (
          <div className="flex justify-between items-center mb-2">
            {label && (
              <label className="block text-sm font-medium text-foreground">
                {label}
              </label>
            )}
            {showValue && (
              <span className="text-sm font-medium text-primary">
                {displayValue}
              </span>
            )}
          </div>
        )}
        <input
          ref={ref}
          type="range"
          value={value}
          className={`
            w-full h-2 bg-border rounded-lg appearance-none cursor-pointer
            [&::-webkit-slider-thumb]:appearance-none
            [&::-webkit-slider-thumb]:w-4
            [&::-webkit-slider-thumb]:h-4
            [&::-webkit-slider-thumb]:bg-primary
            [&::-webkit-slider-thumb]:rounded-full
            [&::-webkit-slider-thumb]:cursor-pointer
            [&::-webkit-slider-thumb]:transition-transform
            [&::-webkit-slider-thumb]:hover:scale-110
            [&::-moz-range-thumb]:w-4
            [&::-moz-range-thumb]:h-4
            [&::-moz-range-thumb]:bg-primary
            [&::-moz-range-thumb]:rounded-full
            [&::-moz-range-thumb]:cursor-pointer
            [&::-moz-range-thumb]:border-0
            ${className}
          `}
          {...props}
        />
      </div>
    );
  }
);

Slider.displayName = "Slider";
