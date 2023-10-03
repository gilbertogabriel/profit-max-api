import {Injectable} from "@nestjs/common";
import {MailerService} from "@nestjs-modules/mailer";
import {PrismaClient} from "@prisma/client";

@Injectable()
export class EmailRepository {
    constructor(private readonly mailerService: MailerService) {
    }

    prisma = new PrismaClient()


    async sendRecoveryKey(email: string) {
        const user = await this.getUserByEmail(email)

        await this.mailerService.sendMail({
            from: '"Recuperção de senha profit-max. 👻" <profitmaxrecovery@gmail.com>',
            to: "gilberto.gabriel.dev@gmail.com",
            subject: "Olá aqui está seu token de recuperação ✔",
            text: 'user.TOKEN()',
        })
    }

    async getUserByEmail(email: string) {
        return this.prisma.uSUARIO.findFirst({
            where: {
                EMAIL: email
            }
        })
    }

    async createToken(email: string, token:string) {
        const user = await this.getUserByEmail(email);
       return this.prisma.tOKEN.create({
                data: {
                    TOKEN: token,
                    DTCRIACAO: new Date(),
                    DTEXPIRA: new Date(Date.now() + 3600000),
                    USUARIO: {
                        connect: {
                            EMAIL: email
                        },
                    },
                },
            }
        )
    }

    async compareRecoveryKey(email: string, token: string) {
      return this.prisma.tOKEN.findFirst({
            where: {
                TOKEN: token,
                USUARIO: {
                    EMAIL: email,
                },
            },
        })
    }

    async changeUserPassword(password: string, email: string) {
        return this.prisma.uSUARIO.update({
            where: {
                EMAIL: email,
            },
            data: {
                SENHA: password,
            },
        })
    }

}
