import {
  PiAt,
  PiBank,
  PiCashRegister,
  PiGlobe,
  PiHash,
  PiIdentificationBadge,
  PiMapPinLine,
  PiSealQuestion,
  PiUserCircle,
} from "react-icons/pi"

export default function DynamicFieldsIconProvider({
  fieldName,
}: {
  fieldName?: string
}) {
  const props = { size: 22, className: "text-muted-foreground" }
  return fieldName === "BeneficiaryName" ? (
    <PiUserCircle {...props} />
  ) : fieldName === "BeneficiaryAddress" || fieldName === "BankAddress" ? (
    <PiMapPinLine {...props} />
  ) : fieldName === "BankName" ? (
    <PiBank {...props} />
  ) : fieldName === "AccountNumber" ||
    fieldName === "RoutingNumber" ||
    fieldName === "BankCode" ? (
    <PiHash {...props} />
  ) : fieldName === "IntermediaryBankDetails" ? (
    <PiCashRegister {...props} />
  ) : fieldName === "BeneficiaryId" || fieldName === "BeneficiaryFile" ? (
    <PiIdentificationBadge {...props} />
  ) : fieldName === "SWIFT" ? (
    <PiGlobe {...props} />
  ) : fieldName === "Email" ? (
    <PiAt {...props} />
  ) : fieldName === "SecurityQuestion" || fieldName === "SecurityAnswer" ? (
    <PiSealQuestion {...props} />
  ) : (
    ""
  )
}
