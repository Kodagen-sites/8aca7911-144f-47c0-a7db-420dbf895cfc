"use client";
import * as React from "react";
import { cn } from "@/lib/cn";

type Variant = "default" | "outline" | "secondary" | "destructive" | "success" | "warning";

const variantClasses: Record<Variant, string> = {
  default: "bg-[#3B2418] text-[#F5EDE3]",
  outline: "border border-[#E5C9A8] text-[#3B2418]",
  secondary: "bg-[#E5C9A8] text-[#3B2418]",
  destructive: "bg-red-100 text-red-800",
  success: "bg-green-100 text-green-800",
  warning: "bg-yellow-100 text-yellow-800",
};

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: Variant;
}

export function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        variantClasses[variant],
        className,
      )}
      {...props}
    />
  );
}
