type Variant =
  | "h1"
  | "h2"
  | "h3"
  | "h4"
  | "h5"
  | "bodyL"
  | "bodyLB"
  | "bodyS"
  | "bodySB"
  | "captionL"
  | "captionS"
  | "button"
  | "buttonL"
  | "linkL"
  | "linkS"
  | null
  | undefined

interface ITG extends React.ComponentProps<"div"> {
  variant: Variant
  children: React.ReactNode
  className?: string
}

export default function TG({ variant, children, className, ...props }: ITG) {
  return (
    <div className={variant + " " + className} {...props}>
      {children}
    </div>
  )
}
