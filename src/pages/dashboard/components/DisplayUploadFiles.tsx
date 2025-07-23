import { Utilities } from "@/lib/Utilities"
import { PiInfo } from "react-icons/pi"

export default function DisplayUploadFiles({ urls }: { urls: string[] }) {
  return (
    <div>
      <div className="border-2 border-dashed p-4 rounded-lg flex flex-wrap gap-2 min-h-20">
        {urls.map((url, index) => (
          <a
            key={index}
            href={url}
            target="_blank"
            className="flex items-center gap-2 p-2 bg-gray-100 rounded-full shadow-sm"
            rel="noreferrer"
          >
            <div className="size-8 bg-gray-300 text-[#141414] flex items-center justify-center rounded-full">
              <div className="captionS text-center">
                {url?.split(".").pop()?.toUpperCase()}
              </div>
            </div>
            <div className="captionL underline truncate max-w-32 pr-1">
              {Utilities.getFileNameFromFileUrl(url)}
            </div>
          </a>
        ))}
      </div>
      <p className="captionS flex items-center text-gray-500 mx-2 mt-0.5 leading-none">
        <PiInfo size={14} className="mr-1" />
        Your file is uploaded successfully!
      </p>
    </div>
  )
}
