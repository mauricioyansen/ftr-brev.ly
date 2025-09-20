import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import React from "react";

interface InputWithPrefixProps extends React.ComponentProps<"input"> {
  prefix: string;
}

const InputWithPrefix = React.forwardRef<
  HTMLInputElement,
  InputWithPrefixProps
>(({ prefix, className, ...props }, ref) => {
  return (
    <div
      className={cn(
        "flex h-12 items-center rounded-md border-2 border-gray-300 bg-gray-100 pl-3",
        "focus-within:border-blue-dark focus-within:outline-none focus-within:ring-0",
        "text-sm",
        className
      )}
    >
      <span className="text-gray-500">{prefix}</span>

      <Input
        className="h-full flex-1 border-0 bg-transparent p-0 text-gray-500 focus-visible:ring-0 focus-visible:ring-offset-0"
        ref={ref}
        {...props}
      />
    </div>
  );
});

InputWithPrefix.displayName = "InputWithPrefix";

export { InputWithPrefix };
