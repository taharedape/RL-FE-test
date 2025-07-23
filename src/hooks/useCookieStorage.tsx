import { JsonService } from "@/lib/JsonService"
import { getCookie, setCookie, removeCookie } from "typescript-cookie"

export default function useCookieStorage() {
  function getData(key: string) {
    const data = getCookie(key)
    return data ? JsonService.parser(data) : null
  }

  function saveData<T>(
    key: string,
    initialValue: null | undefined | string | object | Array<T>
  ) {
    setCookie(key, JSON.stringify(initialValue), { expires: 30, path: "/" })
  }

  function removeData(key: string) {
    removeCookie(key)
  }

  return { getData, saveData, removeData }
}
