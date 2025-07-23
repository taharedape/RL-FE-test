import { cn } from "@/lib/utils"

export default function StepViewer({ steps, currentStep }: { steps: string[]; currentStep: number }) {
  return (
    <div className="flex items-center justify-between space-x-4 px-2">
      {steps.map((step, index) => (
        <div key={index} className={cn("flex items-center space-x-4", index !== 0 && "grow")}>
          {index !== 0 && (
            <hr className={cn("w-full", index <= currentStep ? "border-[#947100]" : "border-[#DEE0E0]")} />
          )}
          <div
            key={index}
            className={`shrink-0 flex items-center justify-center captionL ${
              index <= currentStep ? "text-[#947100] !font-semibold" : "text-[#A5A7A6]"
            }`}
          >
            <div className="text-center">{step}</div>
          </div>
        </div>
      ))}
    </div>
  )
}
