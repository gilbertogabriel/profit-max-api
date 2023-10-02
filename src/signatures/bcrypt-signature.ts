export interface BcryptSignature {
    compare(webPass: string, userPass: string): Promise<boolean>

    hash(pass: string): Promise<string>
}