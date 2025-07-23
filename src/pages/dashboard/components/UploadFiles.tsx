import { Utilities } from "@/lib/Utilities"
import { useCallback, useEffect, useState } from "react"
import { Accept, useDropzone } from "react-dropzone"
import {
  PiFileArrowUp,
  PiInfo,
  PiSpinner,
  PiWarningCircle,
  PiWarningFill,
  PiX,
} from "react-icons/pi"
import { useToast } from "@/components/ui/use-toast.ts"
import { cn } from "@/lib/utils"

type FileWithPreview = File & { preview?: string; path?: string }

const MAX_FILE_SIZE_MB = 10 * 1024 * 1024
const ACCEPTED_TYPES = {
  "application/pdf": [],
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [], // DOCX
  "image/jpeg": [],
  "image/png": [],
}

interface UploadFilesProps {
  value?: FileWithPreview
  onFileSelected: (files: File[]) => void
  label?: string
  isSingle?: boolean
  isDisabled?: boolean
  isLoading?: boolean
  error?: string
  acceptTypes?: Accept
  acceptTypesLabel?: string
}

export default function UploadFiles({
  value,
  onFileSelected,
  label,
  isSingle,
  isDisabled,
  isLoading,
  error,
  acceptTypes,
  acceptTypesLabel,
}: UploadFilesProps) {
  const { toast } = useToast()
  const [files, setFiles] = useState<FileWithPreview[]>(value ? [value] : [])

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const validFiles = acceptedFiles.filter((file) => {
      const isValidType = Object.keys(acceptTypes || ACCEPTED_TYPES).includes(
        file.type
      )
      const isValidSize = file.size <= MAX_FILE_SIZE_MB

      return isValidType && isValidSize
    })

    setFiles((prev) => (isSingle ? validFiles : [...prev, ...validFiles]))
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: acceptTypes || ACCEPTED_TYPES,
    maxSize: MAX_FILE_SIZE_MB,
    multiple: !isSingle,
    disabled: isDisabled,
    onDropRejected: (rejectedFiles) => {
      rejectedFiles.forEach((file) => {
        if (file.errors.length > 0)
          file.errors.forEach((error) => {
            toast({
              duration: 10000,
              variant: "default",
              title: "",
              description: (
                <div className="flex gap-2">
                  <PiWarningFill size={24} className="text-yellow-500" />
                  {error.code === "file-too-large"
                    ? "File is larger than the limit amount. please upload another."
                    : error.code === "file-invalid-type"
                    ? `File has an invalid type. Accepted types are ${
                        acceptTypesLabel || "PDF, DOCX, JPG, PNG"
                      }.`
                    : "Unable to upload this file. Please try again later."}
                </div>
              ),
            })
          })
      })
    },
  })

  const removeFile = (fileName: string) => {
    setFiles((prev) => prev.filter((file) => file.name !== fileName))
  }

  useEffect(() => {
    onFileSelected(files)
  }, [files])

  return (
    <div>
      <div
        {...getRootProps()}
        className={cn(
          "border-2 border-dashed p-4 rounded-lg flex items-center flex-wrap gap-2 min-h-20",
          !isLoading && "cursor-pointer",
          isDragActive
            ? "border-blue-500 bg-blue-50"
            : isDisabled
            ? "border-gray-100"
            : "border-gray-300"
        )}
      >
        {!files ||
          (files.length == 0 && (
            <div className="flex gap-2 flex-row justify-center items-center w-full text-center">
              <PiFileArrowUp size={24} className="text-[#a5a7a6]" />
              <span className="justify-start text-[#a5a7a6] body">
                {label ? label : `Upload File${!isSingle && "s"}`}
              </span>
            </div>
          ))}

        <input {...getInputProps()} />
        {files.map((file, index) => (
          <div
            key={index}
            className={cn(
              "flex items-center gap-2 p-2 pr-3 bg-gray-100 rounded-full shadow-sm",
              isDisabled ? "cursor-default" : "cursor-pointer"
            )}
          >
            <div className="size-8 bg-gray-300 text-[#141414] flex items-center justify-center rounded-full">
              <div className="captionS text-center">
                {(file?.name || file.path)?.split(".")?.pop()?.toUpperCase()}
              </div>
            </div>
            <div className="flex flex-col max-w-32">
              <span className="captionL leading-4 text-[#141414] truncate">
                {file?.name || file.path}
              </span>
              <span className="captionS leading-4 text-gray-500">
                {Utilities.fileSizeRate(file.size)}
              </span>
            </div>
            {!isDisabled && (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  removeFile(file?.name || (file.path as string))
                }}
                disabled={isDisabled}
                className="ml-1 text-gray-500 hover:text-red-500 z-10"
              >
                {isLoading ? (
                  <PiSpinner size={16} className="animate-spin" />
                ) : (
                  <PiX size={16} />
                )}
              </button>
            )}
          </div>
        ))}
      </div>
      {error ? (
        <span className="flex gap-1 items-center captionS ml-4 mt-0.5 text-red-600">
          <PiWarningCircle size={12} />
          {error}
        </span>
      ) : (
        <p className="captionS flex items-center text-gray-500 mx-2 my-0.5">
          <PiInfo size={14} className="inline mr-1" />
          {acceptTypesLabel || "PDF, DOCX, JPG, PNG"}, Less than 10 MB
        </p>
      )}
    </div>
  )
}
