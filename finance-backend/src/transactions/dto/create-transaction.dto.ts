import { IsString, IsNumber, IsDateString, IsIn } from 'class-validator';

export class CreateTransactionDto {
  @IsDateString()
  date: string;

  @IsString()
  description: string;

  @IsNumber()
  amount: number;

  @IsIn(['Income', 'Food', 'Transport', 'Entertainment', 'Utilities', 'Other'])
  category: string;

  @IsIn(['income', 'expense'])
  type: string;
}
