import {Module} from '@nestjs/common';
import {UserModule} from './user/user.module';
import {EmailModule} from './email/email.module';
import {TransactionsModule} from './transactions/transactions.module';

@Module({
  imports: [UserModule, EmailModule, TransactionsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
