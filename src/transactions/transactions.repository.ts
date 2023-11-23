import {Injectable} from "@nestjs/common";
import {PrismaClient, TRANSACTIONS, USUARIO} from "@prisma/client";
import {CreateTransactionDto} from "./dto/create-transaction.dto";
import {UpdateTransactionDto} from "./dto/update-transaction.dto";

@Injectable()
export class TransactionsRepository {

    prisma = new PrismaClient()

    async createTransaction(transaction: CreateTransactionDto): Promise<TRANSACTIONS> {
        const {
            userId,
            value,
            name,
            desc,
            type,
            paymentDate,
            paymentAccount,
            paymentType,
            categoryId,
            statusId
        } = transaction;

        return this.prisma.tRANSACTIONS.create({
            data: {
                NOME: name,
                DESCRICAO: desc,
                VALOR: value,
                TIPO: 1,
                DTPAGAMENTO: paymentDate,
                CATEGORIA: {
                    connect: {IDCATEGORIA: categoryId},
                },
                PAYMENT_TYPE: {
                    connect: {IDPAYMENTTYPE: paymentType},
                },
                STATUS: {
                    connect: {IDSTATUS: statusId},
                },
                PAYMENT_ACCOUNT: paymentAccount,
                IDUSUARIO: userId,
            } as any
        });
    }


    async findAllTransactions(userId: number): Promise<TRANSACTIONS[]> {
        return this.prisma.tRANSACTIONS.findMany({
            where: {
                IDUSUARIO: userId
            }
        })
    }

    async findOneById(transactionId: number): Promise<TRANSACTIONS> {
        return this.prisma.tRANSACTIONS.findUnique({
            where: {
                IDTRANSACTIONS: transactionId
            }
        })
    }

    async updateTransaction(transaction: UpdateTransactionDto): Promise<TRANSACTIONS> {
        const actualTransaction = await this.findOneById(transaction.transactionId);

        return this.prisma.tRANSACTIONS.update({
            where: {
                IDTRANSACTIONS: transaction.transactionId
            },
            data: {
                NOME: transaction.name || actualTransaction.NOME,
                TIPO: transaction.type || actualTransaction.TIPO,
                DESCRICAO: transaction.desc || actualTransaction.DESCRICAO,
                VALOR: transaction.value || actualTransaction.VALOR,
                DTEDICAO: new Date()
            }
        })
    }

    async deleteTransaction(transactionId: number): Promise<TRANSACTIONS> {
        return this.prisma.tRANSACTIONS.delete({
            where: {
                IDTRANSACTIONS: transactionId
            }
        })
    }


}
