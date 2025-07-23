import React from "react"
import { Link, useNavigate } from "react-router-dom"
import { useToast } from "@/components/ui/use-toast"
import { useDispatch } from "react-redux"
import { useLoginMutation } from "@/store/api/authAPI.ts"
import { ErrorMessage, Form, Formik } from "formik"
import { Input } from "@/components/ui/input"
import { InputPassword } from "@/components"
import { Button } from "@/components/ui/button.tsx"
import { signInSchema } from "@/services/schemas"
import { saveUserInfo } from "@/store/slice/auth"
import { SignInType } from "@/types"
import { PiGlobe, PiEnvelopeSimple } from "react-icons/pi"

const SignIn: React.FC = () => {
  const [loginRequest, loginRequestStatus] = useLoginMutation()
  const navigate = useNavigate()
  const { toast } = useToast()
  const dispatch = useDispatch()

  const initialValues: SignInType = { email: "", password: "" }

  const handleSubmit = async (values: SignInType, action: { resetForm: () => void }) => {
    loginRequest({ identifier: values.email, password: values.password })
      .unwrap()
      .then((res) => {
        action.resetForm()
        if (res.token) {
          dispatch(saveUserInfo({ token: res.token }))
          navigate("/")
        }
      })
      .catch((error) => {
        toast({
          duration: 5000,
          variant: `${"destructive"}`,
          title: `${"Error"}`,
          description: `${error?.data?.message || error?.data?.error}`,
        })
      })
  }

  return (
    <Formik initialValues={initialValues} validationSchema={signInSchema} onSubmit={handleSubmit}>
      {({ values, handleBlur, handleChange }) => (
        <Form className="w-full h-screen relative bg-neutral-50 overflow-hidden flex items-center justify-center">
          <div className="flex-col inline-flex w-96 lg:p-0 p-4">
            <div className="self-stretch justify-center items-center gap-4 inline-flex mb-14">
              <div className="h4 text-neutral-900">Sign In</div>
              <div className="justify-start items-center flex">
                <div className="w-10 h-10 p-1 bg-yellow-50 rounded-3xl border border-amber-400 flex-col justify-center items-center gap-1 inline-flex z-10">
                  <div className="bodySB text-yellow-700 text-center">IR</div>
                </div>
                <div className="-ml-5 w-10 h-10 p-1 bg-slate-50 rounded-3xl border border-slate-300 flex-col justify-center items-center gap-1 inline-flex">
                  <PiGlobe size={24} className="text-muted-foreground" />
                </div>
              </div>
            </div>
            <div className="self-stretch flex-col justify-start items-start gap-5 flex">
              <div className="self-stretch flex-col justify-start items-start gap-3 flex">
                <div className="w-full">
                  <Input
                    id="email"
                    type="email"
                    name="email"
                    value={values.email}
                    placeholder="Email Or Username"
                    className="w-full"
                    pre={<PiEnvelopeSimple size={20} className="text-muted-foreground" />}
                    onBlur={handleBlur}
                    onChange={handleChange}
                  />
                  <ErrorMessage name="email" component={"div"} className="p-3 text-sm text-danger" />
                </div>
                <div className="w-full">
                  <InputPassword
                    name="password"
                    id="password"
                    value={values.password}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder="****"
                    className="w-full"
                  />
                  <ErrorMessage name="password" component={"div"} className="p-3 text-sm text-danger" />
                </div>
              </div>
              <Button
                type="submit"
                variant="secondary"
                disabled={loginRequestStatus.isLoading}
                className="w-full"
                loading={loginRequestStatus.isLoading}
              >
                Login
              </Button>
              <div className="self-stretch justify-between items-center inline-flex px-6">
                <Link to={"/auth/reset-password"} className="linkS text-neutral-900">
                  Forget password
                </Link>
              </div>
            </div>
          </div>
        </Form>
      )}
    </Formik>
  )
}

export default SignIn
