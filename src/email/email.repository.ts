import {Injectable} from "@nestjs/common";
import {PrismaClient} from "prisma/prisma-client/scripts/default-index";
import {MailerService} from "@nestjs-modules/mailer";

@Injectable()
export class EmailRepository {
    constructor(private readonly mailerService: MailerService) {
    }
    prisma = new PrismaClient()

    async sendRecoveryKey(recoveryKey: string) {

        await this.mailerService.sendMail({
          to : '',
          from : '',

        })
        return await this.prisma.TOKEN.create({
            data: {
                recoveryKey: recoveryKey
            }
        })
    }
}
