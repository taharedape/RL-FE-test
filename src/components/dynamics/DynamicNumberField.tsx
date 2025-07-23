import { SendMoneyInfoField } from "@/types/sendmoney"
import { DynamicFieldTypes } from "@/types/dynamicFields"
import { Input } from "../ui/input"
import DynamicFieldsIconProvider from "./DynamicFieldsIconProvider"
import { useEffect, useState } from "react"
import { PiWarningCircle } from "react-icons/pi"

export default function DynamicNumberField({
  options,
  defaultValue,
  disabled,
  onChange,
}: {
  options: SendMoneyInfoField
  defaultValue?: number
  disabled?: boolean
  onChange: (val: number | undefined, isValid: boolean) => void
}) {
  const star = options.IsRequired ? " *" : ""
  const [error, setError] = useState<string | undefined>()
  const [value, setValue] = useState<string | undefined>(
    defaultValue
      ? defaultValue?.toString()
      : (options.DefaultValue as string) || ""
  )

  function checkValidation() {
    setError(undefined)
    if (options.IsRequired && !value?.toString())
      return setError(`${options.FieldLabel} is required!`)
    if (options.Validation) {
      const regexp = new RegExp(options.Validation as string)
      if (!regexp.test(value?.toString() || ""))
        setError(
          options.ValidationErrorMessage ||
            `${options.FieldLabel} is not valid!`
        )
    }
  }

  useEffect(() => {
    if (error) checkValidation()
    onChange(Number(value), options.IsRequired ? !!error : false)
  }, [value, error])

  return (
    <div className="flex flex-col">
      <Input
        value={value}
        type={DynamicFieldTypes.TEXT}
        disabled={disabled}
        label={options.FieldLabel + star}
        placeholder={options.FieldLabel + star}
        pre={<DynamicFieldsIconProvider fieldName={options.FieldName} />}
        className="w-full"
        onChange={(e) =>
          setValue(
            isNaN(Number(e.target.value))
              ? defaultValue?.toString() || ""
              : e.target.value
          )
        }
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
