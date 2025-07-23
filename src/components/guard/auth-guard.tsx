import React, { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { removeUserInfo } from "@/store/slice/auth"
import { useLocation, useNavigate } from "react-router"
import useNetworkDetect from "@/hooks/useNetworkDetect"
import { NetworkError } from "@/components"
import { ChildrenType } from "@/types"

const AuthGuardComponent: React.FC<ChildrenType> = ({ children }) => {
  const token = useSelector((state: { auth: { token?: string | null } }) => state?.auth?.token)
  const location = useLocation()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { isOnline } = useNetworkDetect()
  const isAuth = !!token?.length

  // Checking Authentication
  function checkAuth() {
    if (!isAuth) {
      navigate("/auth/sign-in")
      dispatch(removeUserInfo())
    } else {
      // Redirect Back Home is Auth Layout
      if (location.pathname === "/auth/sign-in" || location.pathname === "/auth/sign-up") navigate("/")
    }
  }

  useEffect(() => {
    checkAuth()
  }, [token])

  return <div>{isOnline ? children : <NetworkError />}</div>
}

export default AuthGuardComponent
