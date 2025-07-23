export class JsonService {
  static parser(val: string): { [key: string]: string | number } {
    try {
      if (typeof val !== "string" || !val.length) return {}
      return JSON.parse(val)
    } catch {
      return {}
    }
  }
}
