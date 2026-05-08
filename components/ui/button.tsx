import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium tracking-[-0.01em] transition-all duration-200 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-indigo-500/15 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "border border-indigo-500 bg-indigo-500 text-white shadow-none hover:-translate-y-px hover:bg-indigo-600 hover:shadow-[0_4px_12px_rgba(99,102,241,0.35)]",
        destructive:
          "border border-red-500 bg-white text-red-500 shadow-none hover:-translate-y-px hover:bg-red-50",
        outline:
          "border border-[#E8E8EC] bg-white text-[#0A0A0A] shadow-none hover:-translate-y-px hover:bg-[#F5F5F7]",
        secondary:
          "border border-transparent bg-[#F1F1F4] text-[#0A0A0A] shadow-none hover:-translate-y-px hover:bg-[#EDEDF2]",
        ghost:
          "border border-transparent text-[#6B6B6B] shadow-none hover:bg-[#F1F1F4] hover:text-[#0A0A0A]",
        link: "text-indigo-500 underline-offset-4 hover:text-indigo-600 hover:underline",
      },
      size: {
        default: "h-[38px] px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-11 rounded-md px-8",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
