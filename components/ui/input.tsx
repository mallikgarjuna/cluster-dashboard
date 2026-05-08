import * as React from "react";

import { cn } from "@/lib/utils";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-[42px] w-full rounded-md border border-[#E8E8EC] bg-white px-[14px] py-[10px] text-sm text-[#0A0A0A] shadow-none transition-colors duration-200 file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-[#9C9C9C] focus-visible:border-indigo-500 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-indigo-500/15 disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";

export { Input };
