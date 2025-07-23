import { TypeLabel } from "@/types/enums"
import { isPossibleNumber, parsePhoneNumber } from "libphonenumber-js"

export class Utilities {
  static formatNumber(
    value: string | number | null | undefined,
    withFloat?: boolean,
    withoutDecimal?: boolean
  ): string {
    const raw = value?.toString?.()?.replace(/,/g, "") || ""
    const numeric = Number(raw)
    if (isNaN(numeric) || raw === null || raw?.length < 1) return ""
    // If the input has decimals, preserve them (max 2 places)
    if (!withoutDecimal && raw.includes(".")) {
      const [whole, decimal] = raw.split(".")
      const limitedDecimal = decimal.slice(0, 2)
      const num = BigInt(whole.replace(/\D/g, ""))
      return Intl.NumberFormat("en-US").format(num) + "." + limitedDecimal
    }

    // Otherwise add .00 if withFloat is true
    const floatPart = withFloat ? ".00" : ""
    const num = BigInt(raw.replace(/\D/g, ""))
    return Intl.NumberFormat("en-US").format(num) + floatPart
  }

  // Remove commas from formatted value
  static unFormatNumber(value: string = ""): string {
    return value.replace(/,/g, "")
  }

  static getTypeLabel(type: keyof typeof TypeLabel): string {
    return TypeLabel[type] || type
  }

  static getRoundBalance(num?: string | number) {
    return Number(num)?.toFixed(2) || 0
  }

  static getRoundBalanceCurrency(currency?: string) {
    const val = currency?.split(" ")
    return val?.[0]?.length
      ? (Number(val[0])?.toFixed(2) || 0) + ` ${val?.[1]}`
      : currency
  }

  static separateCurrency(amount: string | number) {
    return amount ? amount.toLocaleString("en-US") : 0
  }

  static convertDateFormat(data?: string, short?: boolean) {
    if (!data) return ""
    const date = new Date(data)

    const options = short
      ? {
          weekday: "long" as const,
          hour: "numeric" as const,
          minute: "numeric" as const,
          hour12: true,
        }
      : {
          weekday: "long" as const,
          month: "long" as const,
          day: "numeric" as const,
          year: "numeric" as const,
          hour: "numeric" as const,
          minute: "numeric" as const,
          hour12: true,
        }

    // Format the date
    const formattedDate = new Intl.DateTimeFormat("en-US", options).format(date)

    // Add suffix to the day (st, nd, rd, th)
    const day = date.getDate()
    const suffix =
      day % 10 === 1 && day !== 11
        ? "st"
        : day % 10 === 2 && day !== 12
        ? "nd"
        : day % 10 === 3 && day !== 13
        ? "rd"
        : "th"

    const finalFormattedDate = formattedDate.replace(/\d+/, `${day}${suffix}`)

    return finalFormattedDate
  }

  static formatDateTime(input: string): string {
    // Replace space with 'T' to make it ISO 8601 compliant
    const isoString = input.replace(" ", "T")
    const date = new Date(isoString)

    // Define month abbreviations
    const monthAbbr = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ]

    // Extract components
    const month = monthAbbr[date.getMonth()]
    const day = date.getDate()
    const year = date.getFullYear()
    const hours = String(date.getHours()).padStart(2, "0")
    const minutes = String(date.getMinutes()).padStart(2, "0")

    // Construct formatted string
    return `${month} ${day} ${year} | ${hours}:${minutes}`
  }

  static fileSizeRate(fileSize: string | number): string {
    if (typeof fileSize === "string") fileSize = parseInt(fileSize, 10)
    if (isNaN(fileSize) || fileSize < 0) return "0 KB"

    const rates = { KB: 1024, MB: 1024 * 1024 }

    return fileSize < rates.MB
      ? `${(fileSize / rates.KB).toFixed(0)} KB`
      : `${(fileSize / rates.MB).toFixed(0)} MB`
  }

  static getFileNameFromFileUrl(url: string) {
    if (!url?.length) return "Not Found"
    return url.split("/").reverse()[0].split("-").splice(2).join("-")
  }

  static getFormatPhoneNumber(val?: string) {
    if (!val) return ""
    const tel = val?.[0] === "+" ? val : `+${val}`
    if (!tel || !isPossibleNumber(tel)) return
    return parsePhoneNumber(tel)
  }

  static Truncate(text: string | undefined, max: number, withoutDot?: boolean) {
    return !text
      ? ""
      : text.length > max
      ? text.slice(0, max) + (withoutDot ? "" : "...")
      : text
  }

  static getCurrencyName(iso: string) {
    const currencyNames = new Intl.DisplayNames(["en"], { type: "currency" })
    return iso.includes("USDT")
      ? "United States Dollar Tether"
      : iso.includes("USDC")
      ? "United States Dollar Coin"
      : currencyNames?.of(iso)
  }
}
