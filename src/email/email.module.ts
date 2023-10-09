import {Module} from '@nestjs/common';
import {MailerModule} from '@nestjs-modules/mailer';
import { EmailController } from './email.controller';
import {EmailService} from "./email.service";
import {EmailRepository} from "./email.repository";

@Module({
    imports: [
        MailerModule.forRoot({
            transport: {
                service: 'Gmail',
                auth: {
                    user: 'profitmaxrecovery@gmail.com',
                    pass: 'profitehtopdemais',
                },
            },
        }),
    ],
    controllers: [EmailController],
    providers: [EmailService, EmailRepository],
})
export class EmailModule {}
