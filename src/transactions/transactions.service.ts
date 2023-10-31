import {Injectable} from '@nestjs/common';
import {CreateTransactionDto} from './dto/create-transaction.dto';
import {UpdateTransactionDto} from './dto/update-transaction.dto';
import {TransactionsRepository} from "./transactions.repository";

@Injectable()
export class TransactionsService {
    constructor(private readonly transactionsRepository: TransactionsRepository) {
    }

    createTransaction(createTransactionDto: CreateTransactionDto) {
        return this.transactionsRepository.createTransaction(createTransactionDto)
    }

    findAll(userId:number) {
        return this.transactionsRepository.findAllTransactions(userId);
    }

    findOne(transactionId: number) {
        return this.transactionsRepository.findOneById(transactionId);
    }

    update(updateTransactionDto: UpdateTransactionDto) {
        return this.transactionsRepository.updateTransaction(updateTransactionDto);
    }

    remove(transactionId: number) {
        return this.transactionsRepository.deleteTransaction(transactionId);
    }
}
