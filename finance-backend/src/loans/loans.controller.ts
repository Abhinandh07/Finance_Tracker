import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  HttpCode,
  NotFoundException,
} from '@nestjs/common';
import { LoansService } from './loans.service';
import { CreateLoanDto } from './dto/create-loan.dto';
import { UpdateLoanDto } from './dto/update-loan.dto';

@Controller('loans')
export class LoansController {
  constructor(private loansService: LoansService) {}

  @Post()
  @HttpCode(201)
  async create(@Body() createLoanDto: CreateLoanDto) {
    return await this.loansService.create(createLoanDto);
  }

  @Get()
  async findAll() {
    return await this.loansService.findAll();
  }

  @Get('overdue')
  async getOverdueLoans() {
    return await this.loansService.getOverdueLoans();
  }

  @Get('pending')
  async getPendingLoans() {
    return await this.loansService.getPendingLoans();
  }

  @Get('total-amount')
  async getTotalAmount() {
    const totalAmount = await this.loansService.getTotalLoanAmount();
    return { totalAmount };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const loan = await this.loansService.findOne(id);
    if (!loan) throw new NotFoundException('Loan not found');
    return loan;
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateLoanDto: UpdateLoanDto) {
    const loan = await this.loansService.findOne(id);
    if (!loan) throw new NotFoundException('Loan not found');
    return await this.loansService.update(id, updateLoanDto);
  }

  @Put(':id/mark-returned')
  async markReturned(@Param('id') id: string) {
    const loan = await this.loansService.findOne(id);
    if (!loan) throw new NotFoundException('Loan not found');
    return await this.loansService.markAsReturned(id);
  }

  @Delete(':id')
  @HttpCode(204)
  async remove(@Param('id') id: string) {
    const loan = await this.loansService.findOne(id);
    if (!loan) throw new NotFoundException('Loan not found');
    await this.loansService.remove(id);
  }
}
