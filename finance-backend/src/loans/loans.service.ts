import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateLoanDto } from './dto/create-loan.dto';
import { UpdateLoanDto } from './dto/update-loan.dto';

@Injectable()
export class LoansService {
  constructor(private prisma: PrismaService) {}

  async create(createLoanDto: CreateLoanDto) {
    console.log('📝 Creating loan:', createLoanDto);
    
    // Create the loan using Prisma's raw client access
    const prismaAny = this.prisma as any;
    
    try {
      // Create the loan
      const newLoan = await prismaAny.loan.create({
        data: createLoanDto,
      });

      // Automatically create an expense transaction for the loan amount
      try {
        await prismaAny.transaction.create({
          data: {
            date: new Date(),
            description: `Loan given to ${createLoanDto.borrowerName}`,
            amount: createLoanDto.amount,
            category: 'Loans',
            type: 'expense',
          },
        });
        console.log('💰 Expense transaction created for loan:', {
          borrowerName: createLoanDto.borrowerName,
          amount: createLoanDto.amount
        });
      } catch (txError) {
        console.error('❌ Error creating expense transaction:', txError);
        // Continue - loan is already created
      }

      return newLoan;
    } catch (error) {
      console.error('❌ Error creating loan:', error);
      throw error;
    }
  }

  async findAll() {
    console.log('📋 Fetching all loans');
    return (this.prisma as any).loan.findMany({
      orderBy: { dueDate: 'asc' },
    });
  }

  async findOne(id: string) {
    console.log('🔍 Fetching loan:', id);
    return (this.prisma as any).loan.findUnique({
      where: { id },
    });
  }

  async update(id: string, updateLoanDto: UpdateLoanDto) {
    console.log('✏️ Updating loan:', id, updateLoanDto);
    return (this.prisma as any).loan.update({
      where: { id },
      data: updateLoanDto,
    });
  }

  async remove(id: string) {
    console.log('🗑️ Deleting loan:', id);
    return (this.prisma as any).loan.delete({
      where: { id },
    });
  }

  async markAsReturned(id: string) {
    console.log('✅ Marking loan as returned:', id);
    return (this.prisma as any).loan.update({
      where: { id },
      data: {
        status: 'returned',
        returnedDate: new Date(),
      },
    });
  }

  async getOverdueLoans() {
    console.log('⚠️ Fetching overdue loans');
    return (this.prisma as any).loan.findMany({
      where: {
        status: 'pending',
        dueDate: {
          lt: new Date(),
        },
      },
      orderBy: { dueDate: 'asc' },
    });
  }

  async getPendingLoans() {
    console.log('⏳ Fetching pending loans');
    return (this.prisma as any).loan.findMany({
      where: { status: 'pending' },
      orderBy: { dueDate: 'asc' },
    });
  }

  async getTotalLoanAmount() {
    console.log('💰 Calculating total loan amount');
    const result = await (this.prisma as any).loan.aggregate({
      where: { status: 'pending' },
      _sum: {
        amount: true,
      },
    });
    return result._sum.amount || 0;
  }
}
