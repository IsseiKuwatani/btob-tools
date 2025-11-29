"use client";

import { ReactNode } from "react";

interface ResultCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: ReactNode;
  highlight?: boolean;
  size?: "sm" | "md" | "lg";
}

export function ResultCard({
  title,
  value,
  description,
  icon,
  highlight = false,
  size = "md",
}: ResultCardProps) {
  const sizes = {
    sm: { padding: "p-4", title: "text-xs", value: "text-xl" },
    md: { padding: "p-5", title: "text-sm", value: "text-2xl" },
    lg: { padding: "p-6", title: "text-sm", value: "text-3xl" },
  };

  return (
    <div
      className={`
        rounded-xl border animate-slide-up
        ${highlight ? "bg-primary-light border-primary/20" : "bg-white border-border"}
        ${sizes[size].padding}
      `}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className={`font-medium text-foreground-muted ${sizes[size].title}`}>
            {title}
          </p>
          <p className={`font-bold mt-1 ${highlight ? "text-primary" : "text-foreground"} ${sizes[size].value}`}>
            {typeof value === "number" ? value.toLocaleString() : value}
          </p>
          {description && (
            <p className="text-xs text-foreground-muted mt-1">
              {description}
            </p>
          )}
        </div>
        {icon && (
          <div className={highlight ? "text-primary" : "text-foreground-muted"}>
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}
