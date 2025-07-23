import { useEffect, useRef, useState } from "react"
import { Input } from "../ui/input"
import { PiBarcode, PiWarningCircle } from "react-icons/pi"
import { Button } from "../ui/button"
import jsQR from "jsqr"
import { IFormValues } from "@/pages/sendMoney/components/CreatePayment"
import { UploadFieldWithRef } from "../common/uploadField"
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf"

pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdfjs/pdf.worker.min.js" // ✅ served locally

export default function WalletAddressField({
  formValues,
  isLoading,
  currentFile,
  validationError,
  setFormValues,
  handleSubmitUpload,
  checkIsContinueDisabled,
}: {
  formValues: IFormValues
  isLoading: boolean
  currentFile?: File
  validationError?: string
  setFormValues: (IFormValues) => void
  handleSubmitUpload: (file?: File, wallet?: string) => void
  checkIsContinueDisabled: () => void
}) {
  const [error, setError] = useState<string>()

  const canvasRef = useRef(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    checkIsContinueDisabled()
  }, [formValues.wallet])

  async function checkWalletAddress(file: File, isPDF?: boolean) {
    if (!file) return null
    const canvas = canvasRef?.current as unknown as HTMLCanvasElement

    if (isPDF) {
      const arrayBuffer = await file.arrayBuffer()
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise

      for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
        const page = await pdf.getPage(pageNum)
        const viewport = page.getViewport({ scale: 2 })
        if (!canvas) return

        const context = canvas.getContext("2d")
        context?.clearRect(0, 0, canvas.width, canvas.height)
        canvas.width = viewport.width
        canvas.height = viewport.height

        await page.render({ canvasContext: context!, viewport }).promise

        const imageData = context?.getImageData(
          0,
          0,
          canvas.width,
          canvas.height
        )
        const code = imageData?.data
          ? jsQR(imageData?.data, canvas.width, canvas.height)
          : null
        if (!code?.data)
          setError(
            "No wallet address found from the QR code, please check your QR file."
          )
        else handleSubmitUpload(file, code?.data)
      }
      return
    }

    return new Promise((resolve) => {
      try {
        const reader = new FileReader()
        reader.onload = (e) => {
          const image = new Image()
          image.onload = () => {
            if (!canvas) return resolve(null)

            const context = canvas.getContext("2d")
            context?.clearRect(0, 0, canvas.width, canvas.height)
            canvas.width = image.width
            canvas.height = image.height
            context?.drawImage(image, 0, 0, image.width, image.height)

            const imageData = context?.getImageData(
              0,
              0,
              canvas.width,
              canvas.height
            )
            const code = imageData?.data
              ? jsQR(imageData?.data, imageData?.width, imageData?.height)
              : null

            if (!code?.data)
              setError(
                "No wallet address found from the QR code, please check your QR file."
              )
            else handleSubmitUpload(file, code?.data)
          }

          image.src = e.target!.result as string
        }
        reader.readAsDataURL(file)
      } catch {
        setError(
          "No wallet address found from the QR code, please check your QR file."
        )
        resolve(null)
      } finally {
        resolve(null)
      }
    })
  }

  async function handleFileChange(inputFile?: File) {
    if (!inputFile) return

    try {
      const acceptedFiles = ["image/jpeg", "image/png", "application/pdf"]
      const MAX_FILE_SIZE_MB = 10 * 1024 * 1024
      const isValidType = acceptedFiles.includes(inputFile.type)
      const isValidSize = inputFile.size <= MAX_FILE_SIZE_MB
      const isPDF = inputFile.type === "application/pdf"

      if (isValidType && isValidSize) await checkWalletAddress(inputFile, isPDF)
      else setError("File is not valid! Just JPG, PNG files, max 10Mb.")
    } catch (e) {
      setError("File Upload field!")
      console.debug("Error", e)
    }
  }

  function removeFile() {
    setFormValues({
      ...formValues,
      wallet: undefined,
      selectedFile: undefined,
      isWalletValidated: false,
      errors: { ...formValues.errors, wallet: false },
      key: formValues.key + 1,
    })

    const canvas = canvasRef?.current as unknown as HTMLCanvasElement
    if (canvas) {
      const context = canvas.getContext("2d")
      context?.clearRect(0, 0, canvas.width, canvas.height)
    }

    handleSubmitUpload()
  }

  return (
    <div className="flex flex-col">
      <canvas key={formValues.key} ref={canvasRef} className="hidden"></canvas>
      <div className={formValues.selectedFile || isLoading ? "" : "hidden"}>
        <UploadFieldWithRef
          ref={fileInputRef}
          value={currentFile}
          label="Wallet Address *"
          placeholder="Wallet Address *"
          accept="image/jpeg, image/png, application/pdf"
          isLoading={isLoading}
          onFileChange={handleFileChange}
          onFileRemove={removeFile}
        />
      </div>
      {!(formValues.selectedFile || isLoading) && (
        <Input
          value={formValues.wallet}
          label="Wallet Address *"
          placeholder="Wallet Address *"
          className="w-full"
          pre={<PiBarcode size={20} />}
          postfix={
            <Button
              variant="link"
              className="shrink-0 p-0 inline-block w-24"
              onClick={() => {
                const ref = fileInputRef?.current as unknown as {
                  selectFile: () => void
                }
                ref?.selectFile()
              }}
            >
              Upload QR
            </Button>
          }
          onChange={(e) => {
            setFormValues({
              ...formValues,
              wallet: e.target.value,
              isWalletValidated: false,
              errors: { ...formValues.errors, wallet: false },
              key: formValues.key + 1,
            })
          }}
          onBlur={() =>
            setError(
              formValues.wallet ? undefined : "Wallet Address is required!"
            )
          }
        />
      )}
      {(validationError || error) && (
        <span className="flex gap-1 items-center captionS ml-4 mt-0.5 text-red-600">
          <PiWarningCircle size={12} />
          {validationError || error}
        </span>
      )}
    </div>
  )
}
