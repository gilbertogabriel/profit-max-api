import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { EmailModule } from './email/email.module';
import { EmailServiceService } from './email/email-service.service';
import { EmailControllerService } from './email/email-controller.service';

@Module({
  imports: [UserModule, EmailModule],
  controllers: [],
  providers: [EmailServiceService],
})
export class AppModule {}
