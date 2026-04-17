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
      "flex h-11 w-full border border-bone/20 bg-char px-3 py-2 text-sm text-bone placeholder:text-muted focus-visible:border-blood focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blood",
      className
    )}
    {...props}
  />
));
Input.displayName = "Input";
