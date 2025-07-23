import { useState } from "react"
import { PiWhatsappLogoLight } from "react-icons/pi"
import { Button } from "@/components/ui/button"
import ReactCountryFlag from "react-country-flag"

export default function WhatsUpFloatBtn() {
  const [isOpen, setIsOpen] = useState(false)

  function linkItem(countryCode: string, label: string, link: string) {
    return (
      <a href={link} target="_blank" rel="noreferrer">
        <Button variant="outline" className="bg-muted my-1 py-2 px-5" onClick={() => setIsOpen(!isOpen)}>
          <ReactCountryFlag
            countryCode={countryCode}
            className="rounded-full w-6 h-6 mr-2"
            cdnUrl="https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.4.3/flags/1x1/"
            cdnSuffix="svg"
            svg
          />
          {label}
        </Button>
      </a>
    )
  }

  return (
    <div className="sticky bottom-4 right-4 mt-auto flex flex-col items-end">
      <div
        className={
          "flex flex-col items-end overflow-hidden transition-all duration-500 " + (isOpen ? "h-40 pb-2" : "h-0 pb-0")
        }
      >
        {linkItem("US", "EN", "https://wa.me/123456789")}
        {linkItem("CN", "CN", "https://wa.me/123456789")}
        {linkItem("IR", "FA", "https://wa.me/123456789")}
      </div>
      <div
        className="w-16 h-16 rounded-full bg-[#25D366] text-white flex items-center justify-center wa-btn hover:bg-[#25D366]/90"
        onClick={() => setIsOpen(!isOpen)}
      >
        <PiWhatsappLogoLight size={36} className="mb-0.5 ml-0.5" />
      </div>
    </div>
  )
}
