import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { EmailModule } from './email/email.module';
import {EmailService} from "./email/email.service";
import {EmailController} from "./email/email.controller";

@Module({
  imports: [UserModule, EmailModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
