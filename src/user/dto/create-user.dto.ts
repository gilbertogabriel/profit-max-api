export class CreateUserDto {

    readonly nome: string
    readonly senha: string
    readonly email: string

    constructor (nome: string, senha: string, email: string) {}

    getUser () {
        return { nome: this.nome, senha: this.senha, email: this.email }
    }
}
