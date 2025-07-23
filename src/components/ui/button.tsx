import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import { PiSpinner } from "react-icons/pi"

const buttonVariants = cva(
  "rounded-[100px] justify-center items-center text-center inline-flex disabled:text-muted-foreground disabled:pointer-events-none",
  {
    variants: {
      variant: {
        default: "border outline outline-1 outline-[#e23a4a]/20",
        primary:
          "bg-[#00261D] text-white hover:bg-[#00382B] active:bg-[#004C3A] disabled:bg-opacity-20 disabled:text-white",
        secondary: "bg-yellow-400 shadow",
        destructive:
          "bg-red-500 text-slate-50 shadow-sm hover:bg-red-500/90 disabled:text-white disabled:opacity-50",
        outline:
          "border border-slate-200 bg-transparent shadow-sm hover:bg-slate-100 hover:text-slate-900",
        danger:
          "border border-red-500 text-red-500 bg-transparent hover:bg-red-500/10",
        ghost: "hover:bg-slate-100 hover:text-slate-900",
        link: "text-blue-600 underline-offset-2 hover:underline",
      },
      size: {
        default: "button px-7 py-3",
        lg: "buttonL px-6 py-3",
        md: "button px-5 py-2",
        sm: "buttonS px-4 py-2",
        icon: "h-12 w-12",
        full: "button px-7 py-3.5 w-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  loading?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant, size, asChild = false, loading, children, ...props },
    ref
  ) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      >
        {loading ? <PiSpinner className="mr-2 h-4 w-4 animate-spin" /> : ""}
        {children}
      </Comp>
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
