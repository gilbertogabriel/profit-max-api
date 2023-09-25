import {Module} from '@nestjs/common';
import {MailerModule} from '@nestjs-modules/mailer';

@Module({
    imports: [
        MailerModule.forRoot({
            transport: {
                host: 'seu-servidor-de-email.com',
                port: 587,
                secure: true,
                auth: {
                    user: 'seu-email@gmail.com',
                    pass: 'sua-senha',
                },
            },
        }),
    ],
    controllers: [],
    providers: [],
})
export class EmailModule {}
