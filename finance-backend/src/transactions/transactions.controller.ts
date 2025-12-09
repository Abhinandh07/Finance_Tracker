import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  BadRequestException,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';

@Controller('transactions')
export class TransactionsController {
  private readonly logger = new Logger(TransactionsController.name);

  constructor(private readonly transactionsService: TransactionsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createTransactionDto: CreateTransactionDto) {
    this.logger.log(`Creating new transaction: ${JSON.stringify(createTransactionDto)}`);
    return this.transactionsService.create(createTransactionDto);
  }

  @Get()
  async findAll() {
    this.logger.log('Fetching all transactions');
    return this.transactionsService.findAll();
  }

  @Get('budget')
  async getBudget() {
    this.logger.log('Fetching budget');
    return this.transactionsService.getBudget();
  }

  @Post('budget')
  async setBudget(@Body() body: { amount: number }) {
    this.logger.log(`Setting budget to: ${body.amount}`);
    return this.transactionsService.setBudget(body.amount);
  }

  @Get('summary')
  async getSummary() {
    this.logger.log('Fetching transaction summary');
    return {
      totalIncome: await this.transactionsService.getTotalIncome(),
      totalExpenses: await this.transactionsService.getTotalExpenses(),
      balance: await this.transactionsService.getBalance(),
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    this.logger.log(`Fetching transaction with ID: ${id}`);
    const transaction = await this.transactionsService.findOne(id);
    if (!transaction) {
      this.logger.warn(`Transaction with ID ${id} not found`);
      throw new NotFoundException(`Transaction with id ${id} not found`);
    }
    return transaction;
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateTransactionDto: UpdateTransactionDto,
  ) {
    this.logger.log(`Updating transaction ${id}: ${JSON.stringify(updateTransactionDto)}`);
    const transaction = await this.transactionsService.update(
      id,
      updateTransactionDto,
    );
    if (!transaction) {
      this.logger.warn(`Failed to update: Transaction with ID ${id} not found`);
      throw new NotFoundException(`Transaction with id ${id} not found`);
    }
    return transaction;
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    this.logger.log(`Deleting transaction with ID: ${id}`);
    const success = await this.transactionsService.remove(id);
    if (!success) {
      this.logger.warn(`Failed to delete: Transaction with ID ${id} not found`);
      throw new NotFoundException(`Transaction with id ${id} not found`);
    }
  }
}
