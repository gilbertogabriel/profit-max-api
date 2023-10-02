export interface ValidationSignature {
    validate (data: any): Error | any
}