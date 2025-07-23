import React from "react"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { PasswordInputType } from "@/types"
import { PiKey, PiEye, PiEyeSlash } from "react-icons/pi"

const InputPassword: React.FC<PasswordInputType> = (props) => {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <Input
      type={showPassword ? "text" : "password"}
      className={props.className}
      pre={<PiKey size={20} className="text-muted-foreground" />}
      postfix={
        <div className="cursor-pointer text-muted-foreground" onClick={() => setShowPassword((prev) => !prev)}>
          {showPassword ? <PiEye size={20} /> : <PiEyeSlash size={20} />}
        </div>
      }
      {...props}
    />
  )
}

export default InputPassword
