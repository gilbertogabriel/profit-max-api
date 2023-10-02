export type UserObject = {
    email: string
    senha: string
}

export type User = {
    id: number
    nome: string
} & UserObject