import { IsNumber, IsString, MinLength, Min, IsDateString, IsOptional } from 'class-validator';

export class CreateLoanDto {
  @IsNumber()
  @Min(0.01)
  amount: number;

  @IsString()
  @MinLength(2)
  borrowerName: string;

  @IsString()
  @MinLength(10)
  borrowerPhone: string;

  @IsDateString()
  dueDate: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
