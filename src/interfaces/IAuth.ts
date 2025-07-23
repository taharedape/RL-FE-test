export interface IUserResponse {
  id: number
  username: string
  email: string
  emailVerified: boolean
  name: string
  image?: string
  birthDate?: string
  registrationDate: string
}

export interface ILoginRequest {
  identifier: string
  password: string
}

export interface ILoginResponse {
  token: string
}

export interface ISignupRequest {
  email: string
  username: string
  password: string
  firstName: string
  lastName: string
  middleName?: string
}
export interface IRestPasswordRequest {
  email: string
}

export interface IConfirmPasswordWithCodeRequest {
  code: string
  password: string
}

export interface ICheckUsernameRequest {
  username: string
}

export interface ICheckUsernameResponse {
  isUsernameAvailable: boolean
}

export interface ICheckEmailRequest {
  email: string
}

export interface ICheckEmailResponse {
  isEmailAvailable: boolean
}

export interface IUpdateUserRequest {
  username?: string
  firstName?: string
  lastName?: string
  middleName?: string
  image?: string
  birthDate?: string | null
}
