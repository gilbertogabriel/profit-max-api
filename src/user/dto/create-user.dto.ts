export class CreateUserDto {

    readonly nome: string
    readonly senha: string
    readonly email: string
    readonly confirmacaoSenha: string

    constructor (nome: string, senha: string, email: string, confirmacaoSenha: string) {}

    getUser () {
        return { nome: this.nome, senha: this.senha, email: this.email, confirmacaoSenha: this.confirmacaoSenha }
    }
}
