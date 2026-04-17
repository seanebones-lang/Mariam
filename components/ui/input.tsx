import { forwardRef } from "react";
import { cn } from "@/lib/utils";

export const Input = forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, type, ...props }, ref) => (
  <input
    type={type}
    ref={ref}
    className={cn(
      "flex h-12 w-full border border-bone/20 bg-char px-3 py-2 text-base text-bone placeholder:text-muted focus-visible:border-blood focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blood sm:h-11 sm:text-sm",
      className
    )}
    {...props}
  />
));
Input.displayName = "Input";
