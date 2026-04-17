import { cva, type VariantProps } from "class-variance-authority";
import { forwardRef } from "react";
import { cn } from "@/lib/utils";

export const buttonVariants = cva(
  "inline-flex select-none items-center justify-center gap-2 whitespace-nowrap rounded-sm text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blood focus-visible:ring-offset-2 focus-visible:ring-offset-ink disabled:pointer-events-none disabled:opacity-40 active:scale-[0.98]",
  {
    variants: {
      variant: {
        blood: "bg-blood text-bandage hover:bg-blood/90 border border-blood",
        ghost:
          "border border-bone/25 bg-transparent text-bone hover:border-blood/60 hover:text-bandage",
        outline:
          "border border-blood text-blood hover:bg-blood hover:text-bandage",
        bone: "bg-bone text-ink hover:bg-bandage",
      },
      size: {
        default: "h-12 px-6 py-2 sm:h-11",
        sm: "h-10 px-4 text-xs sm:h-9",
        lg: "h-13 px-8 text-base sm:h-12",
        icon: "h-11 w-11 sm:h-10 sm:w-10",
      },
    },
    defaultVariants: {
      variant: "blood",
      size: "default",
    },
  }
);

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants>;

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
);
Button.displayName = "Button";
