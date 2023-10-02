export class FindUserDto {

    readonly senha: string
    readonly email: string

    constructor (senha: string, email: string) {}

    getUser () {
        return { senha: this.senha, email: this.email }
    }
}
