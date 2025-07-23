import React from "react"
import { useNavigate, useParams } from "react-router-dom"
import { useToast } from "@/components/ui/use-toast"
import { useDispatch } from "react-redux"
import { useConfirmPasswordWithCodeMutation } from "@/store/api/authAPI.ts"
import { ErrorMessage, Form, Formik } from "formik"
import { confirmPasswordSchema } from "@/services/schemas"
import { InputPassword } from "@/components"
import { Button } from "@/components/ui/button.tsx"
import { ReloadIcon } from "@radix-ui/react-icons"
import { IConfirmPasswordWithCodeRequest } from "@/interfaces/IAuth.ts"
import { saveUserInfo } from "@/store/slice/auth"

const ConfirmPassword: React.FC = () => {
  const [confirmPasswordRequest, confirmPasswordRequestStatus] = useConfirmPasswordWithCodeMutation()
  const navigate = useNavigate()
  const { toast } = useToast()
  const dispatch = useDispatch()
  const { code } = useParams()

  const handleSubmit = async (values: { password: string }, action: { resetForm: () => void }) => {
    if (code && code.length < 5)
      return toast({
        duration: 5000,
        variant: `${"destructive"}`,
        title: `${"Error"}`,
        description: `There is not code`,
      })

    confirmPasswordRequest({
      password: values.password,
      code: code,
    } as IConfirmPasswordWithCodeRequest)
      .unwrap()
      .then((res) => {
        action.resetForm()
        if (res.token) {
          dispatch(saveUserInfo({ token: res.token }))
          navigate("/")
        }
      })
      .catch((err) => {
        toast({
          duration: 5000,
          variant: `${"destructive"}`,
          title: `${"Error"}`,
          description: `${err?.data?.message || err?.data?.error}`,
        })
      })
  }

  return (
    <Formik
      initialValues={{ password: "", confirmPassword: "" }}
      validationSchema={confirmPasswordSchema}
      onSubmit={handleSubmit}
    >
      {({ values, handleBlur, handleChange }) => (
        <Form className="w-full h-screen relative bg-neutral-50 flex items-center justify-center">
          <div className="flex-col inline-flex w-96 lg:p-0 p-4">
            <div className="self-stretch justify-center items-center gap-4 inline-flex h4 text-neutral-900">
              Confirm Password
            </div>
            <div className="bodyS text-neutral-700 text-center px-2 mt-14">
              Enter a new strong password. Your password MUST be at least 8 characters & contain at least a lowercase,
              capital and a number.
            </div>
            <div className="self-stretch flex-col flex">
              <div className="self-stretch flex-col gap-3 flex">
                <div className="w-full my-5 flex flex-col gap-3">
                  {/* New Password */}
                  <div className="w-full">
                    <InputPassword
                      name="password"
                      id="password"
                      value={values.password}
                      onBlur={handleBlur}
                      onChange={handleChange}
                      placeholder="New Password"
                      className="w-full"
                    />
                    <ErrorMessage name="password" component={"div"} className="p-3 text-sm text-danger" />
                  </div>
                  {/* Confirm Password */}
                  <div className="w-full">
                    <InputPassword
                      name="confirmPassword"
                      id="confirmPassword"
                      value={values.confirmPassword}
                      onBlur={handleBlur}
                      onChange={handleChange}
                      placeholder="Confirm Password"
                      className="w-full"
                    />
                    <ErrorMessage name="confirmPassword" component={"div"} className="p-3 text-sm text-danger" />
                  </div>
                </div>
              </div>
              <Button type="submit" variant="secondary" disabled={confirmPasswordRequestStatus.isLoading}>
                {confirmPasswordRequestStatus.isLoading && <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />}
                <div className="button">Reset Password & Sign In</div>
              </Button>
            </div>
          </div>
        </Form>
      )}
    </Formik>
  )
}

export default ConfirmPassword
