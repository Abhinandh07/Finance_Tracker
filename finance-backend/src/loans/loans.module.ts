import { Module } from '@nestjs/common';
import { LoansService } from './loans.service';
import { LoansController } from './loans.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  providers: [LoansService, PrismaService],
  controllers: [LoansController],
})
export class LoansModule {}
