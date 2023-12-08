import {Controller, Get, Post, Body, Patch, Param, Delete, Query} from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';

@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post()
  create(@Body() createTransactionDto: CreateTransactionDto) {
    return this.transactionsService.createTransaction(createTransactionDto);
  }

  @Get()
  findAll(@Query('userId') userId: string) {
    return this.transactionsService.findAll(+userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.transactionsService.findOne(+id);
  }

  @Patch()
  update(@Body() updateTransactionDto: UpdateTransactionDto) {
    return this.transactionsService.update(updateTransactionDto);
  }

  @Delete('/:id')
  remove(@Param('id') id: string) {
    return this.transactionsService.remove(+id);
  }
}
