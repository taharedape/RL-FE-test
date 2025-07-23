import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import { transferTypeItem } from "@/interfaces/Iwallet"

export const badgeVariants = cva(
  "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80",
        secondary: "border-transparent bg-secondary text-secondary-foreground ",
        success:
          "border-transparent bg-[#00876714] text-[#008767] hover:bg-[#00876714]/80",
        filterBadge:
          "cursor-pointer py-2 flex gap-1 rounded-full captionL border-transparent bg-secondary text-secondary-foreground hover:bg-[#FFB82E33] hover:text-[#755A00]",
        activeFilterBadge:
          "cursor-pointer py-2 flex gap-1 rounded-full captionL border-transparent bg-[#FFB82E33] text-[#755A00] hover:bg-[#FFB82E33] hover:text-[#755A00]",
        subItem:
          "border-transparent bg-[#2228310F] text-secondary-foreground hover:bg-[#22283155]",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground shadow hover:bg-destructive/80",
        outline: "text-foreground",
        active: "border-transparent bg-[#FFB82E33] text-[#755A00]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  subItems?: Array<{
    id: transferTypeItem[]
    name: string
    icon?: React.ReactNode
  }>
  activeSubItem?: transferTypeItem[]
  onChangeSubItem?: (id: transferTypeItem[]) => void
}

export default function Badge({
  className,
  variant,
  children,
  subItems,
  activeSubItem,
  onChangeSubItem,
  ...props
}: BadgeProps) {
  const [selectedSubItem, setSelectedSubItem] = React.useState<
    transferTypeItem[] | undefined
  >(undefined)

  React.useEffect(() => {
    setSelectedSubItem(activeSubItem)
  }, [activeSubItem])

  return (
    <div
      className={cn(
        "flex items-center",
        variant?.includes("active") && subItems?.length
          ? "relative gap-1 bg-[#EDEDEE] rounded-full"
          : ""
      )}
    >
      <div
        className={cn(badgeVariants({ variant }), className, "relative z-10")}
        {...props}
      >
        {children}
      </div>
      {variant?.includes("active") && subItems?.length && (
        <div className="-ml-8 pl-9 p-1.5 flex items-center gap-1 relative z-0">
          {subItems.map((item) => (
            <Badge
              key={item.name}
              variant={selectedSubItem === item.id ? "active" : "subItem"}
              className="captionS cursor-pointer rounded-full hover:bg-[#FFB82E33] hover:text-[#755A00] flex gap-1"
              onClick={() => {
                setSelectedSubItem(item.id)
                onChangeSubItem?.(item.id)
              }}
            >
              {item.icon}
              {item.name}
            </Badge>
          ))}
        </div>
      )}
    </div>
  )
}
