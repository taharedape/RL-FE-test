import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ErrorMessage, Form, Formik } from "formik"
import { resetPasswordSchema } from "@/services/schemas"
import { Link } from "react-router-dom"
import { RestPasswordType } from "@/types"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useRestPasswordMutation } from "@/store/api/authAPI"
import { PiEnvelopeSimple } from "react-icons/pi"

const ResetPassword: React.FC = () => {
  const [restPassword, data] = useRestPasswordMutation()

  const initialValues: RestPasswordType = { email: "" }

  const handleSubmit = async (values: RestPasswordType, action: { resetForm: () => void }) => {
    await restPassword(values)
    data.isSuccess && action.resetForm()
  }

  return (
    <Formik initialValues={initialValues} validationSchema={resetPasswordSchema} onSubmit={handleSubmit}>
      {({ values, handleBlur, handleChange }) => (
        <Form className="w-full h-screen relative bg-neutral-50 flex items-center justify-center">
          <div className="flex-col inline-flex w-96 lg:p-0 p-4">
            <div className="self-stretch justify-center items-center gap-4 inline-flex h4 text-neutral-900">
              Reset Password
            </div>
            <div className="bodyS text-neutral-700 text-center px-6 mt-14">
              Enter the email which is your account connected to.
            </div>
            <div className="self-stretch flex-col flex">
              <div className="self-stretch flex-col gap-3 flex">
                <div className="w-full my-5">
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
                  <ErrorMessage name="email" component="div" className="p-3 text-sm text-danger" />
                </div>
              </div>
              <Button
                type="submit"
                variant="secondary"
                disabled={data.isLoading}
                className="w-full"
                loading={data.isLoading}
              >
                Confirm
              </Button>
            </div>
            <div className="self-stretch justify-between items-center inline-flex px-6 mt-5">
              <Link to={"/auth/sign-in"} className="linkS text-neutral-900">
                Back to Login
              </Link>
            </div>
            {data.isSuccess && (
              <div className="mt-14">
                <Alert variant="default">
                  <AlertDescription>
                    An email was sent to <br /> {data?.originalArgs?.email}. Please check
                    <br />
                    out the reset password link within.
                  </AlertDescription>
                </Alert>
              </div>
            )}
          </div>
        </Form>
      )}
    </Formik>
  )
}

export default ResetPassword
