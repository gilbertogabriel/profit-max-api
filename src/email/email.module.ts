import {Module} from '@nestjs/common';
import {MailerModule} from '@nestjs-modules/mailer';
import { EmailController } from './email.controller';
import {EmailService} from "./email.service";
import {EmailRepository} from "./email.repository";

@Module({
    imports: [
        MailerModule.forRoot({
            transport: {
                host: 'smtp.office365.com',
                secure: false,
                port: 587,
                auth: {
                    user: 'profitmax-recovery@outlook.com',
                    pass: 'Profitehtopdemais',
                },
                tls: {
                    ciphers: 'SSLv3',
                },
            },
        }),
    ],
    controllers: [EmailController],
    providers: [EmailService, EmailRepository],
})
export class EmailModule {}
