import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TransactionsModule } from './transactions/transactions.module';
import { LoansModule } from './loans/loans.module';

@Module({
  imports: [TransactionsModule, LoansModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
