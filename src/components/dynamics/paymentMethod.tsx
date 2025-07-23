import {
  components,
  default as ReactSelect,
  GroupBase,
  MenuProps,
  OptionProps,
  ValueContainerProps,
} from "react-select"
import {
  CustomLabel,
  DropdownIndicator,
  IndicatorSeparator,
  NoOptionsMessage,
  OptionItem,
  SelectContainer,
  SelectProps,
} from "../ui/select"
import { Fragment } from "react/jsx-runtime"
import { cn } from "@/lib/utils"
import { SendMoneyInfoPaymentMethod } from "@/types/sendmoney"
import { useState } from "react"

const Menu = (
  props: MenuProps<
    OptionItem<SendMoneyInfoPaymentMethod>,
    boolean,
    GroupBase<OptionItem<SendMoneyInfoPaymentMethod>>
  >
) => {
  return (
    <Fragment>
      <div className="relative z-50">
        <components.Menu
          className="mt-4 py-0 !rounded-3xl overflow-hidden !bg-muted"
          {...props}
        >
          {props.children}
        </components.Menu>
      </div>
    </Fragment>
  )
}

function Option(
  props: OptionProps<
    OptionItem<SendMoneyInfoPaymentMethod>,
    boolean,
    GroupBase<OptionItem<SendMoneyInfoPaymentMethod>>
  >,
  receiversType?: string
) {
  const data = props.data.original as SendMoneyInfoPaymentMethod
  return (
    <div className="group bg-[#ededee] hover:bg-[#DEE0E0]">
      <components.Option
        {...props}
        className={cn(
          "bodyS bg-[#ededee] group-hover:bg-[#DEE0E0] p-4 ",
          data.isDisabled ? "opacity-20" : ""
        )}
      >
        <div className="border-l-2 border-l-blue-600 px-3 flex flex-col gap-1">
          <span className="bodySB font-semibold">{data.Label}</span>
          <span className="captionL text-[#4C4C4C]">{data.Description}</span>
          <span className="captionS text-muted-foreground">
            Transfer fee:{" "}
            <strong>{data.Fees?.[receiversType as string] ?? "Free"} | </strong>
            Arrival: <strong>{data.Arrival}</strong>
          </span>
        </div>
      </components.Option>
    </div>
  )
}

export function ValueContainer<T>(
  {
    children,
    ...props
  }: ValueContainerProps<OptionItem<T>, boolean, GroupBase<OptionItem<T>>>,
  pre: React.ReactNode,
  setMenuIsOpen: () => void,
  value?: null | OptionItem<T>,
  receiversType?: string
) {
  const data = value?.original as SendMoneyInfoPaymentMethod
  return (
    <components.ValueContainer {...props}>
      <div className="flex items-center gap-2" onClick={() => setMenuIsOpen()}>
        {pre}
        {value ? (
          <>
            <span>{data.Label}</span>
            <span className="captionL text-muted-foreground">{`| Fee: ${
              data.Fees?.[receiversType as string] ?? "Free"
            } | Arrival: ${data.Arrival}`}</span>
          </>
        ) : (
          children
        )}
      </div>
    </components.ValueContainer>
  )
}

interface IPaymentMethod extends SelectProps<SendMoneyInfoPaymentMethod> {
  receiversType?: string
}

export default function PaymentMethod({ ...props }: IPaymentMethod) {
  const [menuIsOpen, setMenuIsOpen] = useState(false)
  return (
    <div className="relative w-full h-12">
      {CustomLabel(props.value, props.label)}
      <ReactSelect
        {...props}
        classNamePrefix="react-select"
        menuPortalTarget={document.body}
        menuIsOpen={menuIsOpen}
        onMenuOpen={() => setMenuIsOpen(true)}
        onMenuClose={() => setMenuIsOpen(false)}
        closeMenuOnSelect={false}
        components={{
          SelectContainer,
          ValueContainer: (p) =>
            ValueContainer(
              p,
              props.pre,
              () => setMenuIsOpen(!menuIsOpen),
              props.value,
              props.receiversType
            ),
          IndicatorSeparator,
          DropdownIndicator,
          Menu,
          Option: (p) => Option(p, props.receiversType),
          NoOptionsMessage,
        }}
        styles={{
          control: (baseStyles, state) => ({
            ...baseStyles,
            borderColor: "#DEE0E0",
            background: "transparent",
            borderRadius: "6.25rem",
            padding: "0.25rem",
            boxShadow: "none",
            opacity: state.isDisabled ? "0.8" : "",
            "&:hover": { borderColor: "#FFB82E", boxShadow: "none" },
          }),
          option: (provided, state) => ({
            ...provided,
            backgroundColor: state.isSelected ? "#EDEDEE" : "#FAFAFA",
            color: "#141414",
          }),
          placeholder: (base, state) => ({
            ...base,
            display: state.isFocused ? "none" : "block",
          }),
        }}
      />
    </div>
  )
}
