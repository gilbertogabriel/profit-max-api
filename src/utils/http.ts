export type HttpResponse = {
  code: number
  status: boolean
  body?: Record<string, any> | Error
  message?: string
}