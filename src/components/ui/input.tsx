import * as React from "react"

import { cn } from "@/lib/utils"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  pre?: React.ReactNode
  postfix?: React.ReactNode
  label?: string | null
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, pre, postfix, label, ...props }, ref) => {
    return (
      <div
        className={cn(
          "relative text-primary h-12 px-3 py-2.5 rounded-full border border-neutral-200 hover:border-neutral-300 active:border-[#FFB82E] justify-start items-center gap-2 flex",
          className
        )}
      >
        <label
          className={
            (props.value !== null
              ? "absolute -top-1.5 left-6 z-[1]"
              : "absolute top-1 left-6 text-transparent") +
            " transition-all duration-500 text-muted-foreground bg-[#FAFAFA] px-2 captionS"
          }
        >
          {label}
        </label>
        <div className="shrink w-max">{pre}</div>
        <input
          className="basis-auto w-full outline-none border-none bg-transparent disabled:opacity-50"
          type={type}
          ref={ref}
          {...props}
        />
        <div className="shrink w-max">{postfix}</div>
      </div>
    )
  }
)
Input.displayName = "Input"
export { Input }
