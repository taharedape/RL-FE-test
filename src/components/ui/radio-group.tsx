import * as React from "react"
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group"

import { cn } from "@/lib/utils"

const RadioGroup = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>
>(({ className, ...props }, ref) => {
  return (
    <RadioGroupPrimitive.Root
      className={cn("grid gap-2", className)}
      {...props}
      ref={ref}
    />
  )
})
RadioGroup.displayName = RadioGroupPrimitive.Root.displayName

interface RadioGroupItemProps
  extends React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item> {
  label: string
}

const RadioGroupItem = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  RadioGroupItemProps
>(({ className, label, ...props }, ref) => {
  return (
    <RadioGroupPrimitive.Item ref={ref} className={className} {...props}>
      <div className="flex items-center gap-3 cursor-pointer">
        <div className="aspect-square h-4 w-4 rounded-full border border-slate-900 text-slate-900 shadow focus:outline-none focus-visible:ring-1 focus-visible:ring-slate-950 disabled:cursor-not-allowed disabled:opacity-50">
          <RadioGroupPrimitive.Indicator className="flex items-center justify-center h-full w-full">
            <div className="h-2.5 w-2.5 bg-slate-900 fill-primary rounded-full" />
          </RadioGroupPrimitive.Indicator>
        </div>
        <label htmlFor={props.value} className="cursor-pointer">
          {label}
        </label>
      </div>
    </RadioGroupPrimitive.Item>
  )
})
RadioGroupItem.displayName = RadioGroupPrimitive.Item.displayName

export { RadioGroup, RadioGroupItem }
