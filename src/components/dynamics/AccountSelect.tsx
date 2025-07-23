import {
  components,
  DropdownIndicatorProps,
  GroupBase,
  MenuProps,
  OptionProps,
} from "react-select"
import { CustomLabel, IndicatorSeparator, OptionItem } from "../ui/select"
import AsyncSelect, { AsyncProps } from "react-select/async"
import { Fragment } from "react/jsx-runtime"
import { cn } from "@/lib/utils"
import {
  BeneficiariesAccount,
  IGetBeneficiaries,
  TransferType,
} from "@/types/sendmoney"
import { PiPlus, PiSpinner, PiXBold } from "react-icons/pi"
import Badge from "../ui/badge"
import FormatNumberView from "../common/FormatNumberView"
import { useRef, useState } from "react"
import { Utilities } from "@/lib/Utilities"
import { CountryCodeLabel } from "./DynamicPhoneNumber"

const Menu = (
  props: MenuProps<
    OptionItem<BeneficiariesAccount>,
    boolean,
    GroupBase<OptionItem<BeneficiariesAccount>>
  >,
  onAddNew?: () => void
) => (
  <Fragment>
    <div className="relative z-50">
      <components.Menu
        className="mt-4 py-0 !rounded-3xl overflow-hidden !bg-muted"
        {...props}
      >
        {props.children}
        <div
          className="flex items-center justify-center gap-1 button bg-[#ededee] text-[#00261D] py-3 cursor-pointer"
          onClick={onAddNew}
        >
          <PiPlus size={20} />
          Add new Beneficiary
        </div>
      </components.Menu>
    </div>
  </Fragment>
)

export function DropdownIndicator(
  props: DropdownIndicatorProps<
    OptionItem<BeneficiariesAccount>,
    boolean,
    GroupBase<OptionItem<BeneficiariesAccount>>
  >
) {
  return (
    <components.DropdownIndicator {...props}> </components.DropdownIndicator>
  )
}

function Option(
  props: OptionProps<
    OptionItem<BeneficiariesAccount>,
    boolean,
    GroupBase<OptionItem<BeneficiariesAccount>>
  >,
  transferType: { type: TransferType | null; mode: string | null }
) {
  const data = props.data.original as BeneficiariesAccount
  const PaymentMethod =
    data?.PaymentInformation?.[0]?.Currencies?.[0]?.PaymentMethods

  const CountryName = data?.PaymentInformation?.[0]?.CountryName

  const isCash = transferType.type == TransferType.CASH
  const isDomestic = transferType.type == TransferType.DOMESTIC

  const BeneficiaryName =
    (PaymentMethod?.[0]?.Fields?.find((f) => f.FieldName === "BeneficiaryName")
      ?.value as string) || ""
  const AccountNumber = PaymentMethod?.[0]?.Fields?.find(
    (f) => f.FieldName === "AccountNumber"
  )?.value as string
  const BeneficiaryAddress = isCash
    ? ""
    : (PaymentMethod?.[0]?.Fields?.find(
        (f) => f.FieldName === "BeneficiaryAddress"
      )?.value as string)

  const Currency = data?.PaymentInformation?.[0]?.Currencies?.[0]?.CurrencyCode

  const BeneficiaryId = isCash
    ? (PaymentMethod?.[0]?.Fields?.find((f) => f.FieldName === "BeneficiaryId")
        ?.value as string)
    : ""

  const PhoneNumber = isCash
    ? Utilities.getFormatPhoneNumber(
        PaymentMethod?.[0]?.Fields?.find((f) => f.FieldName === "PhoneNumber")
          ?.value as string
      )
    : null

  const Fees = isDomestic ? PaymentMethod?.[0]?.Fees?.[transferType.mode!] : 0

  return (
    <div className="group bg-[#ededee] hover:bg-[#DEE0E0]">
      <components.Option
        {...props}
        className={"bodyS bg-[#ededee] group-hover:bg-[#DEE0E0] p-4"}
      >
        <div
          className={cn(
            "border-l-4 px-3 flex flex-col gap-1",
            transferType.type == TransferType.INTERNATIONAL
              ? "border-l-blue-600"
              : transferType.type == TransferType.DOMESTIC
              ? "border-l-[#FAA500]"
              : "border-l-[#008767]"
          )}
        >
          <Badge
            variant="outline"
            className={cn(
              "rounded-full border-0 capitalize",
              transferType.type == TransferType.INTERNATIONAL
                ? "bg-[#0062FF12] text-blue-600"
                : transferType.type == TransferType.DOMESTIC
                ? "bg-[#FFB82E1F] text-[#947100]"
                : "bg-[#00876714] text-[#008767]"
            )}
          >
            {PaymentMethod?.[0]?.Name || ""}
          </Badge>
          <div className="mt-1.5 flex gap-1 items-center">
            <span className="bodySB capitalize">
              {isCash ? BeneficiaryName : AccountNumber}
            </span>
            {((isCash && BeneficiaryId) || !isCash) && (
              <Badge
                variant="outline"
                className="bg-[#2228310F] !p-0.5 !pr-1 rounded-full border-0"
              >
                <FormatNumberView
                  className="text-[#141414] captionS"
                  withCountry
                  currency={Currency}
                />
              </Badge>
            )}
          </div>
          {isCash ? (
            <>
              {PhoneNumber && PhoneNumber?.isValid() && (
                <span className="captionL text-[#141414] flex">
                  {CountryCodeLabel(
                    PhoneNumber?.countryCallingCode,
                    PhoneNumber?.country
                  )}
                  -{PhoneNumber?.nationalNumber}
                </span>
              )}
              <div className="captionL text-[#141414]">{CountryName}</div>
              <span className="captionL text-[#A5A7A6]">{BeneficiaryId}</span>
            </>
          ) : (
            <>
              <div className="captionL text-[#141414]">
                {BeneficiaryName}
                <span className="captionS font-bold text-[#A5A7A6] ml-2">
                  {transferType.mode}
                </span>
              </div>
              <span className="captionL text-[#A5A7A6]">{data.Email}</span>
              <div className="captionL text-[#141414]">
                {CountryName}
                <span className="captionL text-[#A5A7A6] ml-2">
                  | {BeneficiaryAddress}
                </span>
              </div>
            </>
          )}
          {isDomestic && (
            <span className="captionS font-semibold">Fee: {Fees}</span>
          )}
        </div>
      </components.Option>
    </div>
  )
}

function makeOptionLabel(option, transferType) {
  const isCash = transferType.type == TransferType.CASH
  const isDomestic = transferType.type == TransferType.DOMESTIC
  const fields =
    option?.PaymentInformation?.[0]?.Currencies?.[0]?.PaymentMethods?.[0]
      ?.Fields
  const BeneficiaryName: string =
    (fields?.find((f) => f.FieldName === "BeneficiaryName")?.value as string) ||
    ""
  const AccountNumber = fields?.find(
    (f) => f.FieldName === "AccountNumber" || f.FieldName === "Email"
  )?.value

  const BankName = isCash
    ? ""
    : fields?.find((f) => f.FieldName === "BankName")?.value
  const Currency =
    option?.PaymentInformation?.[0]?.Currencies?.[0]?.CurrencyCode

  const CountryName = option?.PaymentInformation?.[0]?.CountryName

  const BeneficiaryId = isCash
    ? (fields?.find((f) => f.FieldName === "BeneficiaryId")?.value as string)
    : ""
  const PhoneNumber =
    isCash || isDomestic
      ? Utilities.getFormatPhoneNumber(
          fields?.find((f) => f.FieldName === "PhoneNumber")?.value
        )
      : null

  return (
    <div className="shrink-0">
      <span className="capitalize">{BeneficiaryName}</span>
      {" | "}
      <span className="captionL">
        {isCash
          ? (PhoneNumber
              ? `+${PhoneNumber?.countryCallingCode}-${PhoneNumber?.nationalNumber} | `
              : "") +
            `${BeneficiaryId} | ${Utilities.Truncate(
              CountryName,
              20
            )} | ${Currency}`
          : `${AccountNumber} | ` +
            (PhoneNumber && PhoneNumber?.isValid()
              ? `+${PhoneNumber?.countryCallingCode}-${PhoneNumber?.nationalNumber}`
              : BankName) +
            ` | ${Currency}`}
      </span>
    </div>
  )
}

const Input = (props) => <components.Input {...props} />
const LoadingIndicator = () => (
  <PiSpinner size={20} className="mx-auto animate-spin" />
)
export const NoOptionsMessage = (inputValue: string) => (
  <div className="captionL text-muted-foreground w-full text-center py-6 px-2">
    {inputValue?.length ? "No Beneficiaries found!" : "Start Typing..."}
  </div>
)

interface AccountSelect
  extends AsyncProps<
    OptionItem<BeneficiariesAccount>,
    boolean,
    GroupBase<OptionItem<BeneficiariesAccount>>
  > {
  transferType: { type: TransferType | null; mode: string | null }
  pre?: React.ReactNode
  value?: OptionItem<BeneficiariesAccount>
  label?: string
  getMemoOptions?: (inputValue: string) => Promise<IGetBeneficiaries>
  onAddNew?: () => void
  onSelectChange?: (
    newVal: OptionItem<BeneficiariesAccount> | null,
    resp: IGetBeneficiaries
  ) => void
}

export default function AccountSelect({ ...props }: AccountSelect) {
  const [options, setOptions] = useState<OptionItem<BeneficiariesAccount>[]>([])
  const [resp, setResp] = useState<IGetBeneficiaries>()
  const [isFocused, setIsFocused] = useState<boolean>(false)
  const [inputValue, setInputValue] = useState<string | undefined>()
  const callLoadOptionsInterval = useRef<NodeJS.Timeout | null>(null)
  const selectRef = useRef()

  function loadOptions(
    inputValue: string,
    callBack: (options: OptionItem<BeneficiariesAccount>[]) => void
  ) {
    if (callLoadOptionsInterval.current)
      clearTimeout(callLoadOptionsInterval.current)

    if (inputValue?.length < 2) return

    callLoadOptionsInterval.current = setTimeout(async () => {
      const resp = await props.getMemoOptions?.(inputValue)
      const Beneficiaries =
        resp?.Beneficiaries.map((b) => ({
          value: b.Id,
          label: "",
          original: b,
        })) || []

      setOptions(Beneficiaries)
      setResp(resp)
      callBack(Beneficiaries)
      if (callLoadOptionsInterval.current)
        clearTimeout(callLoadOptionsInterval.current)
    }, 800)
  }

  const onInputChange = (inputValue, { action }) =>
    action === "input-change" && setInputValue(inputValue)
  const onChange = (option) => {
    props.onSelectChange?.(option, resp!)
    setInputValue("")
    setIsFocused(false)
  }

  return (
    <div className="relative w-full h-12">
      {CustomLabel(props.value, props.label)}
      <div className="absolute h-12 left-3.5 flex items-center">
        {props.pre}
      </div>
      {!!props.value?.original?.Id && !isFocused ? (
        <div
          className="flex items-center gap-2 w-full rounded-full h-full p-1 border border-[#DEE0E0] hover:border-[#FFB82E]"
          onClick={() => {
            if (props.isDisabled) return
            setIsFocused(true)
            setTimeout(() => selectRef.current?.focus(), 100)
          }}
        >
          <div className="mx-2 pl-4" />
          {makeOptionLabel(props.value?.original, props.transferType)}
          {!props.isDisabled && (
            <PiXBold
              size={16}
              className="ml-auto text-gray-500 hover:text-black mr-4"
              onClick={() => onChange(null)}
            />
          )}
        </div>
      ) : (
        <>
          <AsyncSelect
            {...props}
            ref={selectRef}
            inputValue={inputValue}
            cacheOptions
            defaultOptions={options}
            loadOptions={loadOptions}
            menuPortalTarget={document.body}
            loadingMessage={(props: { inputValue: string }) =>
              props.inputValue?.length
                ? `Searching for '${props.inputValue}'...`
                : "Searching..."
            }
            openMenuOnFocus={true}
            controlShouldRenderValue={false}
            isMulti={false}
            components={{
              IndicatorSeparator,
              DropdownIndicator,
              LoadingIndicator,
              Input,
              Menu: (p) => Menu(p, props.onAddNew),
              Option: (p) => Option(p, props.transferType),
              NoOptionsMessage: (p) =>
                NoOptionsMessage(p.selectProps.inputValue),
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
              input: (base) => ({
                ...base,
                paddingLeft: "2rem",
              }),
              placeholder: (base, state) => ({
                ...base,
                display: state.isFocused ? "none" : "block",
                paddingLeft: "2rem",
              }),
            }}
            onInputChange={onInputChange}
            onChange={(newVal) => onChange(newVal)}
            onBlur={() => setIsFocused(false)}
          />
        </>
      )}
    </div>
  )
}
