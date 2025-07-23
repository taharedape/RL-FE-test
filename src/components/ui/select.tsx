import {
  ContainerProps,
  GroupBase,
  MenuProps,
  OptionProps,
  SingleValue,
  ActionMeta,
  ValueContainerProps,
  MultiValue,
  StylesConfig,
} from "node_modules/react-select/dist/declarations/src"
import {
  components,
  DropdownIndicatorProps,
  default as ReactSelect,
} from "react-select"
import CreatableSelect from "react-select/creatable"
import { Fragment } from "react"
import { PiCaretDown } from "react-icons/pi"
import { cn } from "@/lib/utils"

export function SelectContainer<T>({
  ...props
}:
  | ContainerProps<OptionItem<T>, boolean, GroupBase<OptionItem<T>>>
  | undefined) {
  return <components.SelectContainer {...props} />
}

export function ValueContainer<T>(
  {
    children,
    ...props
  }: ValueContainerProps<OptionItem<T>, boolean, GroupBase<OptionItem<T>>>,
  pre: React.ReactNode,
  size?: "default" | "ml" | "sm"
) {
  return (
    <components.ValueContainer className="w-full" {...props}>
      <div
        className={cn(
          "flex items-center gap-2 w-full",
          size === "sm" ? "captionL" : ""
        )}
      >
        {pre}
        {children}
      </div>
    </components.ValueContainer>
  )
}

export const IndicatorSeparator = () => <span />

export function DropdownIndicator<T>(
  props: DropdownIndicatorProps<
    OptionItem<T>,
    boolean,
    GroupBase<OptionItem<T>>
  >
) {
  return (
    <components.DropdownIndicator {...props}>
      <PiCaretDown size={16} />
    </components.DropdownIndicator>
  )
}

export function Menu<T>(
  props: MenuProps<OptionItem<T>, boolean, GroupBase<OptionItem<T>>>
) {
  return (
    <Fragment>
      <div className="relative z-50">
        <components.Menu
          className="mt-4 py-0 !rounded-3xl overflow-hidden"
          {...props}
        >
          {props.children}
        </components.Menu>
      </div>
    </Fragment>
  )
}

export function Option<T>(
  props: OptionProps<OptionItem<T>, boolean, GroupBase<OptionItem<T>>>
) {
  return (
    <components.Option
      {...props}
      className={"bodyS w-full p-3 hover:bg-muted focus:bg-muted"}
    />
  )
}

export function NoOptionsMessage() {
  return (
    <div className="captionL text-muted-foreground w-full text-center py-4 px-2">
      No Options
    </div>
  )
}

export function CustomLabel<T>(value?: OptionItem<T> | null, label?: string) {
  return (
    label && (
      <label
        className={
          (value !== null && value !== undefined
            ? "absolute -top-1.5 left-6 z-[1]"
            : "absolute top-1 left-6 text-transparent") +
          " transition-all duration-500 text-muted-foreground bg-[#FAFAFA] px-2 captionS"
        }
      >
        {label}
      </label>
    )
  )
}

export function Styles<T>(
  size?: "default" | "ml" | "sm"
): StylesConfig<OptionItem<T>, boolean, GroupBase<OptionItem<T>>> {
  return {
    control: (baseStyles, state: any) => ({
      ...baseStyles,
      border: size === "sm" ? "none" : "",
      borderColor: "#DEE0E0",
      background: "transparent",
      borderRadius: "6.25rem",
      padding: size === "sm" ? "0" : "0.25rem",
      boxShadow: "none",
      opacity: state.isDisabled ? "0.8" : "",
      "&:hover": { borderColor: "#FFB82E", boxShadow: "none" },
      minWidth: "6rem",
    }),
    option: (provided, state: any) => ({
      ...provided,
      backgroundColor: state.isSelected ? "#EDEDEE" : "#FAFAFA",
      color: "#141414",
      fontSize: size === "sm" ? "12px" : "",
    }),
    dropdownIndicator: (provided) => ({
      ...provided,
      padding: size === "sm" ? "4px" : provided.padding,
    }),
    input: (provided) => ({ ...provided }),
    placeholder: (base, state) => ({
      ...base,
      display: state.isFocused ? "none" : "block",
    }),
  }
}

export interface OptionItem<T> {
  value: string | number
  label: string | JSX.Element
  original?: T
}

export interface SelectProps<T> {
  options: Array<OptionItem<T>>
  value?: OptionItem<T> | null
  label?: string
  placeholder?: string
  pre?: React.ReactNode
  isDisabled?: boolean
  isOnModal?: boolean
  isCreatable?: boolean
  size?: "default" | "ml" | "sm"
  onChange?: (
    newValue: SingleValue<OptionItem<T>> | MultiValue<OptionItem<T>>,
    actionMeta: ActionMeta<OptionItem<T>>
  ) => void
  onBlur?: () => void
}

export default function Select<T>({ ...props }: SelectProps<T>) {
  const Comp = props.isCreatable ? CreatableSelect : ReactSelect
  return (
    <div className={cn("relative w-full", props.size === "sm" ? "" : "h-12")}>
      {CustomLabel(props.value, props.label)}
      <Comp
        {...props}
        classNamePrefix="react-select"
        menuPortalTarget={props.isOnModal ? undefined : document.body}
        components={{
          SelectContainer,
          ValueContainer: (p) => ValueContainer(p, props.pre, props.size),
          IndicatorSeparator,
          DropdownIndicator,
          Menu,
          Option,
          NoOptionsMessage,
        }}
        styles={Styles(props.size)}
        onBlur={props.onBlur}
      />
    </div>
  )
}
