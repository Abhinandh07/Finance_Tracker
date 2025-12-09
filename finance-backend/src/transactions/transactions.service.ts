import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { Transaction } from './entities/transaction.entity';

@Injectable()
export class TransactionsService {
  constructor(private prisma: PrismaService) {}

  async create(createTransactionDto: CreateTransactionDto): Promise<Transaction> {
    const transaction = await this.prisma.transaction.create({
      data: {
        date: new Date(createTransactionDto.date),
        description: createTransactionDto.description,
        amount: createTransactionDto.amount,
        category: createTransactionDto.category,
        type: createTransactionDto.type
      }
    });
    
    return this.mapToTransaction(transaction);
  }

  async findAll(): Promise<Transaction[]> {
    const transactions = await this.prisma.transaction.findMany({
      orderBy: { date: 'desc' }
    });
    return transactions.map(t => this.mapToTransaction(t));
  }

  async findOne(id: string): Promise<Transaction | null> {
    const transaction = await this.prisma.transaction.findUnique({
      where: { id }
    });
    return transaction ? this.mapToTransaction(transaction) : null;
  }

  async update(id: string, updateTransactionDto: UpdateTransactionDto): Promise<Transaction | null> {
    const data: any = {};
    if (updateTransactionDto.date) data.date = new Date(updateTransactionDto.date);
    if (updateTransactionDto.description) data.description = updateTransactionDto.description;
    if (updateTransactionDto.amount) data.amount = updateTransactionDto.amount;
    if (updateTransactionDto.category) data.category = updateTransactionDto.category;
    if (updateTransactionDto.type) data.type = updateTransactionDto.type;

    const transaction = await this.prisma.transaction.update({
      where: { id },
      data
    }).catch(() => null);

    return transaction ? this.mapToTransaction(transaction) : null;
  }

  async remove(id: string): Promise<boolean> {
    const result = await this.prisma.transaction.delete({
      where: { id }
    }).catch(() => null);
    return result !== null;
  }

  async getTotalIncome(): Promise<number> {
    const result = await this.prisma.transaction.aggregate({
      where: { type: 'income' },
      _sum: { amount: true }
    });
    return result._sum?.amount || 0;
  }

  async getTotalExpenses(): Promise<number> {
    const result = await this.prisma.transaction.aggregate({
      where: { type: 'expense' },
      _sum: { amount: true }
    });
    return result._sum?.amount || 0;
  }

  async getBalance(): Promise<number> {
    const income = await this.getTotalIncome();
    const expenses = await this.getTotalExpenses();
    return income - expenses;
  }

  async getBudget(): Promise<{ amount: number }> {
    const now = new Date();
    const budget = await this.prisma.budget.findUnique({
      where: {
        month_year: {
          month: now.getMonth(),
          year: now.getFullYear()
        }
      }
    });
    return { amount: budget?.amount || 2000 };
  }

  async setBudget(amount: number): Promise<{ amount: number }> {
    const now = new Date();
    const budget = await this.prisma.budget.upsert({
      where: {
        month_year: {
          month: now.getMonth(),
          year: now.getFullYear()
        }
      },
      update: { amount },
      create: {
        amount,
        month: now.getMonth(),
        year: now.getFullYear()
      }
    });
    return { amount: budget.amount };
  }

  private mapToTransaction(data: any): Transaction {
    return new Transaction({
      date: data.date,
      description: data.description,
      amount: data.amount,
      category: data.category,
      type: data.type
    });
  }
}

