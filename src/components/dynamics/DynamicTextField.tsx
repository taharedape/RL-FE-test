import { useEffect, useState } from "react"
import { SendMoneyInfoField } from "@/types/sendmoney"
import { DynamicFieldTypes } from "@/types/dynamicFields"
import { Input } from "../ui/input"
import DynamicFieldsIconProvider from "./DynamicFieldsIconProvider"
import { PiWarningCircle } from "react-icons/pi"

export default function DynamicTextField({
  options,
  defaultValue,
  disabled,
  onChange,
}: {
  options: SendMoneyInfoField
  defaultValue?: string
  disabled?: boolean
  onChange: (val: string | undefined, isValid: boolean) => void
}) {
  const star = options.IsRequired ? " *" : ""
  const [value, setValue] = useState<string | undefined>(
    defaultValue ? defaultValue : (options.DefaultValue as string)
  )
  const [error, setError] = useState<string | undefined>()

  function checkValidation() {
    setError(undefined)
    if (options.IsRequired && !value?.length)
      return setError(`${options.FieldLabel} is required!`)
    if (options.Validation) {
      const regexp = new RegExp(options.Validation as string)
      if (!regexp.test(value || ""))
        setError(
          options.ValidationErrorMessage ||
            `${options.FieldLabel} is not valid!`
        )
    }
  }

  useEffect(() => {
    if (error) checkValidation()
    onChange(value, options.IsRequired ? !!error : false)
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
        onChange={(e) => setValue(e.target.value)}
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
