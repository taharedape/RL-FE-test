import FadeIn from "react-fade-in"
import { RadioGroup, RadioGroupItem } from "../ui/radio-group"
import { Tooltip, TooltipTrigger, TooltipContent } from "../ui/tooltip"
import { PiWarningCircle } from "react-icons/pi"
import DisplayUploadFiles from "@/pages/dashboard/components/DisplayUploadFiles"
import UploadFiles from "@/pages/dashboard/components/UploadFiles"
import { IFormValues } from "@/pages/sendMoney/components/CreatePayment"
import { useEffect, useState } from "react"

const options = [
  {
    value: "upload",
    label: "Upload Beneficiary ID file *",
    tooltip: {
      title: "Upload the Beneficiary’s ID to verify their identity.",
      content:
        "This verification is required before continuing with the transfer process.",
    },
  },
  {
    value: "copy",
    label: "Copy & share with my Beneficiary",
    tooltip: {
      title: "Send this link to the beneficiary to verify their identity",
      content:
        "Once verified, you can proceed with the remaining steps of the transfer.",
    },
  },
]

export default function VerificationField({
  visibility,
  formValues,
  isDetails,
  beneficiaryIdFile,
  isLoading,
  setFormValues,
  handleSubmitUpload,
}: {
  visibility: boolean
  formValues: IFormValues
  isDetails?: boolean
  beneficiaryIdFile?: File
  isLoading: boolean
  setFormValues: (IFormValues) => void
  handleSubmitUpload: (File?) => void
}) {
  const [error, setError] = useState<string>()
  const [option, setOption] = useState(formValues.validationOption || "upload")

  const isValid =
    (option?.length && option !== "upload") || !!formValues.selectedFile

  function checkValidation() {
    setError(undefined)
    if (!isValid) setError("Beneficiary ID file is required!")
  }

  function updateData() {
    checkValidation()
    setFormValues({
      ...formValues,
      validationOption: option || "upload",
      errors: { ...formValues.errors, validationOption: !isValid },
    })
  }

  useEffect(() => {
    if (!formValues.validationOption) setOption("upload")
  }, [])

  useEffect(() => {
    updateData()
    handleSubmitUpload()
  }, [option])

  useEffect(() => {
    updateData()
  }, [beneficiaryIdFile, error])

  return (
    <>
      <FadeIn visible={visibility} delay={300} className="col-span-2">
        <div className="flex flex-col my-2">
          <div className="bodySB text-[#4C4C4C]">Verification</div>
          <hr className="border-[#DEE0E0] my-4" />
        </div>
      </FadeIn>
      <FadeIn visible={visibility} delay={400} className="col-span-2">
        <RadioGroup
          key={formValues.key}
          className="flex gap-8"
          value={option}
          onValueChange={setOption}
        >
          {options.map((so) => (
            <Tooltip key={so.value} delayDuration={400}>
              <TooltipTrigger>
                <div className="flex items-center gap-2">
                  <RadioGroupItem
                    value={so.value as string}
                    id={so.value as string}
                    label={so.label}
                  />
                  <PiWarningCircle size={20} className="text-blue-500" />
                </div>
              </TooltipTrigger>
              {so.tooltip?.title?.length && (
                <TooltipContent
                  className="sticky z-50 captionS flex flex-col max-w-60"
                  align="start"
                >
                  <strong>{so.tooltip?.title}</strong>
                  {so.tooltip?.content}
                </TooltipContent>
              )}
            </Tooltip>
          ))}
        </RadioGroup>
      </FadeIn>
      <FadeIn visible={visibility} delay={500} className="col-span-2 mt-3">
        {option === "copy" ? (
          <div className="bg-[#FFB82E1F] rounded-lg p-4 bodyS text-[#755A00]">
            Once your request is submitted, a unique link will be generated for
            you to share with your beneficiary. They must use this link to
            complete their verification process.
          </div>
        ) : isDetails ? (
          <DisplayUploadFiles urls={[formValues.selectedFile] as string[]} />
        ) : (
          <>
            <div className="captionL text-[#4C4C4C] mb-3">
              Please upload your receipt in the field below. Our AI scanner will
              extract the information from your receipt and fill it in for you.
            </div>
            <UploadFiles
              value={beneficiaryIdFile}
              isSingle
              error={error}
              isLoading={isLoading}
              onFileSelected={(files) => {
                handleSubmitUpload(files[0])
              }}
            />
          </>
        )}
      </FadeIn>
    </>
  )
}
