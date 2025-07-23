import { useEffect, useState } from "react"
import { SendMoneyInfoField } from "@/types/sendmoney"
import { DynamicFieldTypes } from "@/types/dynamicFields"
import { Input } from "../ui/input"
import ReactCountryFlag from "react-country-flag"
import Select, { OptionItem } from "../ui/select"
import {
  getCountries,
  getCountryCallingCode,
  CountryCallingCode,
  CountryCode,
  AsYouType,
} from "libphonenumber-js"
import { PiWarningCircle } from "react-icons/pi"

const countries = getCountries()
export function CountryCodeLabel(
  label?: CountryCallingCode,
  value?: CountryCode
) {
  return !label && !value ? (
    "-"
  ) : (
    <div className="flex items-center gap-2">
      <ReactCountryFlag
        countryCode={value as unknown as string}
        className="rounded-full !w-4 !h-4"
        cdnUrl="https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.4.3/flags/1x1/"
        cdnSuffix="svg"
        svg
      />
      {" +"}
      {label}
    </div>
  )
}

export default function DynamicPhoneNumber({
  options,
  defaultValue,
  disabled,
  hasError,
  selectedCountry,
  onChange,
}: {
  options: SendMoneyInfoField
  defaultValue?: string
  disabled?: boolean
  hasError?: boolean
  selectedCountry: string
  onChange: (val: string | undefined, isValid: boolean) => void
}) {
  const regionNames = new Intl.DisplayNames(["en"], { type: "region" })
  const asYouType = new AsYouType()
  const star = options.IsRequired ? " *" : ""
  const [value, setValue] = useState<string>("")
  const [country, setCountry] = useState<OptionItem<{ iso?: string }>>()
  const [error, setError] = useState<string>()

  useEffect(() => {
    if (hasError) checkValidation()
  }, [])

  useEffect(() => {
    const inputValue = defaultValue
      ? defaultValue
      : (options.DefaultValue as string)

    const asInputType = new AsYouType()
    asInputType.input(defaultValue || "")

    if (!inputValue)
      return setCountry({
        label: CountryCodeLabel(
          getCountryCallingCode(selectedCountry as CountryCode),
          selectedCountry as CountryCode
        ),
        value: (regionNames.of(selectedCountry! || "") +
          " " +
          selectedCountry!) as string,
        original: { iso: selectedCountry! },
      })
    if (asInputType?.getNumber()?.country) {
      setValue(asInputType?.getNumber()?.nationalNumber as string)
      setCountry({
        label: CountryCodeLabel(
          asInputType?.getNumber()?.countryCallingCode,
          asInputType?.getNumber()?.country
        ),
        value: (regionNames.of(asInputType?.getNumber()?.country || "") +
          " " +
          asInputType?.getNumber()?.country) as string,
        original: { iso: asInputType?.getNumber()?.country },
      })
    }
  }, [])

  function checkValidation() {
    setError(undefined)
    if (options.IsRequired && (!country?.original?.iso || !value?.length))
      return setError("Phone Number is required!")
    const asInputType = new AsYouType(country?.original?.iso as CountryCode)
    asInputType.input(value)
    if (!asInputType?.isValid()) setError("Phone Number is not valid!")
  }

  useEffect(() => {
    if (error) checkValidation()
    const asInputType = new AsYouType(country?.original?.iso as CountryCode)
    asInputType.input(value)
    onChange(
      asInputType?.getNumber()?.number,
      options.IsRequired ? !!error : true
    )
  }, [value, country?.value, error])

  return (
    <div className="flex flex-col">
      <Input
        value={value}
        type={DynamicFieldTypes.TEXT}
        label={options.FieldLabel + star}
        placeholder={options.FieldLabel + star}
        disabled={disabled}
        pre={
          <Select
            className="w-max min-w-20 h-8 bg-muted rounded-full justify-between outline-0 flex items-center gap-1 text-muted-foreground"
            size="sm"
            disabled={disabled}
            options={countries.map((iso) => ({
              value: regionNames.of(iso || "") + " " + iso,
              label: CountryCodeLabel(getCountryCallingCode(iso), iso),
              original: { iso: iso },
            }))}
            value={country?.value ? country : null}
            onChange={(e: OptionItem<{ iso: string }>) =>
              setCountry(e?.value ? e : undefined)
            }
          />
        }
        className="w-full"
        onChange={(e) => setValue(asYouType.input(e.target.value))}
        onBlur={checkValidation}
      />
      {error && (
        <span className="flex gap-1 items-center captionS ml-4 mt-0.5 text-red-600">
          <PiWarningCircle size={12} />
          {error}
        </span>
      )}
    </div>
  )
}
