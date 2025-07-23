import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react"
import { Input } from "../ui/input"
import {
  PiPaperclip,
  PiFileArrowUp,
  PiCloudArrowUpDuotone,
  PiX,
} from "react-icons/pi"
import { cn } from "@/lib/utils"

export function UploadFieldFunction(
  {
    value,
    label,
    placeholder,
    accept,
    isLoading,
    disabled,
    onFileChange,
    onFileTrigger,
    onFileRemove,
  }: {
    value?: File
    label?: string
    placeholder?: string
    accept?: string
    isLoading?: boolean
    disabled?: boolean
    onFileChange: (file?: File) => void
    onFileTrigger?: (ref: React.RefObject<HTMLInputElement>) => void
    onFileRemove?: () => void
  },
  ref
) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [inputKey, setInputKey] = useState<string>("")
  const [inputVal, setInputVal] = useState<File | undefined>()

  useEffect(() => {
    if (value) setInputVal(value)
  }, [])

  function ResetsFileInput() {
    setInputKey(Math.random().toString(36))
    if (fileInputRef.current) fileInputRef.current.value = ""
    setInputVal(undefined)
  }

  function onFileSelect(e) {
    const file = e?.target?.files?.[0] as File

    setInputVal(file || undefined)
    onFileChange(file || undefined)
  }

  useImperativeHandle(ref, () => ({
    selectFile: () => fileInputRef.current?.click(),
    getInputRef: () => fileInputRef.current,
  }))

  return (
    <div className="flex gap-2 w-full items-center">
      <input
        key={inputKey}
        ref={fileInputRef}
        type="file"
        accept={accept}
        disabled={disabled}
        onChange={onFileSelect}
        className="hidden"
      />
      <div className="relative w-full group">
        {isLoading && (
          <div className="absolute inset-0 bg-muted rounded-3xl z-50 flex items-center justify-center">
            <PiCloudArrowUpDuotone
              size={20}
              className="text-muted-foreground animate-bounce"
            />
          </div>
        )}
        <div
          className={cn(
            "absolute inset-0 z-40 rounded-3xl group-hover:!border-neutral-300 flex items-center pl-10 hover:underline mr-10",
            disabled ? "" : "cursor-pointer"
          )}
          onClick={() =>
            onFileTrigger !== undefined
              ? onFileTrigger(fileInputRef)
              : fileInputRef.current?.click()
          }
        >
          {inputVal?.name}
        </div>
        <Input
          key={inputKey}
          pre={<PiPaperclip size={20} className="text-muted-foreground" />}
          disabled
          placeholder={placeholder}
          label={isLoading ? "" : label}
          value={" "}
          postfix={
            inputVal?.name ? (
              <PiX
                size={20}
                className="text-muted-foreground relative z-50 hover:text-[#4c4c4c] cursor-pointer"
                onClick={() => {
                  setInputVal(undefined)
                  ResetsFileInput()
                  onFileRemove?.()
                }}
              />
            ) : (
              <PiFileArrowUp
                size={20}
                className="text-muted-foreground relative z-50"
              />
            )
          }
          className={cn(
            "w-full z-0 group-hover:!border-neutral-300",
            disabled ? "opacity-40" : ""
          )}
        />
      </div>
    </div>
  )
}

export const UploadFieldWithRef = forwardRef(UploadFieldFunction)
