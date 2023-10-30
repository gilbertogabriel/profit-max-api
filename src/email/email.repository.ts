import {Injectable} from "@nestjs/common";
import {MailerService} from "@nestjs-modules/mailer";
import {ACESS_CODE, PrismaClient, USUARIO} from "@prisma/client";

@Injectable()
export class EmailRepository {
    constructor(private readonly mailerService: MailerService) {
    }

    prisma = new PrismaClient()


    async sendRecoveryKey(email: string, acess_code: string) {
        const user = await this.getUserByEmail(email)
        await this.mailerService.sendMail({
            from: '"Recuperção de senha 👻" <profitmax-recovery@outlook.com>',
            to: email,
            subject: "Olá aqui está seu token de recuperação:",
            text:   "Seu códgio de acesso é :"+acess_code,
        })
    }

    async getUserByEmail(email: string): Promise<USUARIO> {
        return this.prisma.uSUARIO.findFirst({
            where: {
                EMAIL: email
            }
        })
    }

    async createToken(email: string, token: number): Promise<ACESS_CODE> {
        const user = await this.getUserByEmail(email);

        return this.prisma.aCESS_CODE.create({
                data: {
                    CODE: token,
                    VERIFICADO: false,
                    DTCRIACAO: new Date(),
                    DTEXPIRA: new Date(Date.now() + 3600000),
                    USUARIO: {
                        connect: {
                            IDUSUARIO: user.IDUSUARIO,
                        }
                    }
                },
            }
        )
    }

    async compareRecoveryKey(email: string, token: number) {
        const user = await this.getUserByEmail(email);
        return this.prisma.aCESS_CODE.updateMany({
            where: {
                CODE: token,
                USUARIO: {
                    IDUSUARIO: user.IDUSUARIO
                }
            },
            data: {
                VERIFICADO: true
            }

        })
    }

    async changeUserPassword(password: string, email: string): Promise<USUARIO> {
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
