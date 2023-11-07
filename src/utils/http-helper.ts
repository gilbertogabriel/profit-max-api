import { ServerError } from "src/class/error/server-error"
import { HttpResponse } from "./http"

export const forbbiden = (error: Error): HttpResponse => ({
    code: 403
  , status: false
  , body: error
})

export const badRequest = (error: Error): HttpResponse => ({
    code: 401
  , status: false
  , body: error
})

export const serverError = (error: any): HttpResponse => ({
    code: 500
  , status: false
  , body: new ServerError(error.stack)
})

export const responseOk = (body: Object, status = true): HttpResponse => ({
    code: 200
  , status
  , body
})