import { cn } from "@/lib/utils"
import CurrencyFlags from "./CurrencyFlags"
import { Utilities } from "@/lib/Utilities"

export default function FormatNumberView({
  value,
  currency = "",
  withCountry,
  transactionType,
  className,
  subClass,
  flagSize,
}: {
  value?: number | string | null
  format?: string
  currency?: string | null
  withCountry?: boolean
  transactionType?: string | null
  className?: string
  subClass?: string
  flagSize?: number
}) {
  const num = Utilities.formatNumber(value, true)
  const formattedValue: Array<string | null | undefined> = num.includes(".")
    ? num.split(".")
    : [num, ""]

  return (
    <div className={cn(className, "inline-flex items-center gap-1")}>
      <div className="flex items-baseline">
        {formattedValue[0]}
        {(formattedValue?.[1] ?? "").length > 0 && (
          <>
            .
            <div className={subClass ? subClass : "text-sm"}>
              {formattedValue[1]}
            </div>
          </>
        )}
      </div>
      {withCountry && (
        <CurrencyFlags
          size={flagSize || 12}
          type={transactionType!}
          currency={currency!}
        />
      )}
      {currency && <span>{currency} </span>}
    </div>
  )
}
