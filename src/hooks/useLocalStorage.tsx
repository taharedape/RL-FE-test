import { JsonService } from "@/lib/JsonService"

const useLocalStorage = () => {
  const getData = (key: string) => {
    const data = localStorage.getItem(key)
    return data ? JsonService.parser(data) : null
  }

  const saveData = (key: string, initialValue: any) => {
    localStorage.setItem(key, initialValue)
  }

  const removeData = (key: string) => {
    localStorage.removeItem(key)
  }

  return { getData, saveData, removeData }
}

export default useLocalStorage
