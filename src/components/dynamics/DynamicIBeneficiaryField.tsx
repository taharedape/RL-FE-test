import { useEffect, useState } from "react"
import { SendMoneyInfoField, SendMoneyObjField } from "@/types/sendmoney"
import { RadioGroup, RadioGroupItem } from "../ui/radio-group"
import FadeIn from "react-fade-in"
import UploadFiles from "@/pages/dashboard/components/UploadFiles"
import { useUploadFileMutation } from "@/store/api/walletAPI"
import { Input } from "../ui/input"
import { DynamicFieldTypes } from "@/types/dynamicFields"
import DynamicFieldsIconProvider from "./DynamicFieldsIconProvider"
import { PiWarningCircle } from "react-icons/pi"

const optionsList = [
  { value: "number", label: "Enter Beneficiary’s ID number *" },
  { value: "file", label: "Upload Beneficiary’s ID file *" },
]

export default function DynamicIBeneficiaryField({
  options,
  defaultValue,
  selectedFile,
  onChange,
  onFileSelected,
}: {
  options: SendMoneyInfoField
  defaultValue?: SendMoneyObjField
  selectedFile?: File
  onChange: (val: SendMoneyObjField | undefined, isValid: boolean) => void
  onFileSelected: (val?: File) => void
}) {
  const [uploadFile, uploadFileStatus] = useUploadFileMutation()

  const [error, setError] = useState<string | undefined>()
  const [file, setFile] = useState<File | undefined>(selectedFile)
  const [value, setValue] = useState<SendMoneyObjField>(
    defaultValue?.type
      ? defaultValue
      : (options.DefaultValue as SendMoneyObjField)?.type
      ? (options.DefaultValue as SendMoneyObjField)
      : { type: "number" }
  )

  function checkValidation(val?: SendMoneyObjField) {
    const v = val || value
    const isNumber = v?.type === "number"
    isNumber && !v?.value
      ? setError("Beneficiary ID is required!")
      : !isNumber && !v?.value
      ? setError("Beneficiary ID file is required!")
      : setError(undefined)
  }

  async function handleSubmitUpload(file) {
    if (!file) return setFile(undefined)
    try {
      setValue({ ...value })
      const resp = await uploadFile(file).unwrap()
      setValue({
        ...value,
        value: (resp as unknown as { path: string }).path,
      })
      setError(undefined)
      setFile(file)
      onFileSelected(file)
    } catch (e) {
      console.error("File upload failed:", e)
    }
  }

  useEffect(() => {
    if (error) checkValidation()
    onChange(value, !!error)
  }, [value, error])

  return (
    <>
      <FadeIn delay={200} className="col-span-2 mx-4 mb-4">
        <RadioGroup
          className="flex gap-8"
          defaultValue={value?.type as string}
          onValueChange={(e: "number" | "file") => {
            setValue({ type: e })
            if (e !== "file") {
              onFileSelected(undefined)
              setFile(undefined)
            }
            checkValidation({ type: e })
          }}
        >
          {optionsList.map((so) => (
            <RadioGroupItem
              key={so.value}
              id={so.value as string}
              value={so.value as "number" | "file"}
              label={so.label}
            />
          ))}
        </RadioGroup>
      </FadeIn>
      <FadeIn delay={200} className="col-span-2 mt-3 flex flex-col">
        {value.type === "file" ? (
          <UploadFiles
            value={file}
            isSingle
            isLoading={uploadFileStatus.isLoading}
            error={error}
            onFileSelected={(files) => {
              handleSubmitUpload(files[0])
            }}
          />
        ) : (
          <Input
            value={value.value}
            type={DynamicFieldTypes.TEXT}
            label={options.FieldLabel + " *"}
            placeholder={options.FieldLabel + " *"}
            pre={<DynamicFieldsIconProvider fieldName={options.FieldName} />}
            className="w-full"
            onChange={(e) => setValue({ ...value, value: e.target.value })}
            onBlur={() => checkValidation()}
          />
        )}
        {error && value.type === "number" && (
          <span className="flex gap-1 items-center captionS ml-4 mt-0.5 text-red-600">
            <PiWarningCircle size={12} />
            {error}
          </span>
        )}
      </FadeIn>
    </>
  )
}
