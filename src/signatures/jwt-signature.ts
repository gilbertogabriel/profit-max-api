import { JwtPayload } from "jsonwebtoken"

export interface JwtSignature {
    encrypt (data: string): string

    decrypt (data: string): string | JwtPayload
}