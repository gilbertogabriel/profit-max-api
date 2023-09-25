import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { EmailModule } from './email/email.module';

@Module({
  imports: [UserModule, EmailModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
