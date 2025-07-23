import { ConfirmPasswordType, RestPasswordType, SignInType } from "@/types"
import * as yup from "yup"

export const signInSchema: yup.ObjectSchema<SignInType> = yup.object({
  email: yup.string().required("Email or Username field is required"),
  password: yup.string().required("Password field is required"),
})

export const resetPasswordSchema: yup.ObjectSchema<RestPasswordType> = yup.object({
  email: yup.string().required("Email or Username field is required"),
})

export const confirmPasswordSchema: yup.ObjectSchema<ConfirmPasswordType> = yup.object({
  password: yup
    .string()
    .min(8, "Password must be at least 8 characters long")
    .matches(/^(?=.*\d)[A-Za-z\d]+$/, "Password must contain at least one number and only letters or numbers")
    .required("Password field is required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords must match")
    .required("Confirm Password field is required"),
})
