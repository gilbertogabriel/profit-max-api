import {Module} from '@nestjs/common';
import {MailerModule} from '@nestjs-modules/mailer';
import {EmailServiceService} from "./email-service.service";
import { EmailController } from './email.controller';
import { EmailService } from './email.service';

@Module({
    imports: [
        MailerModule.forRoot({
            transport: {
                host: 'profit-max-recovery@proton.me',
                port: 487,
                secure: true,
                auth: {
                    user: 'profitmaxrecovery@gmail.com',
                    pass: 'profitehtop',
                },
            },
        }),
    ],
    controllers: [EmailController],
    providers: [EmailService],
})
export class EmailModule {}
