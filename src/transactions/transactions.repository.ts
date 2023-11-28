import {Injectable} from "@nestjs/common";
import {PrismaClient, TRANSACTIONS, USUARIO} from "@prisma/client";
import {CreateTransactionDto} from "./dto/create-transaction.dto";
import {UpdateTransactionDto} from "./dto/update-transaction.dto";

@Injectable()
export class TransactionsRepository {

    prisma = new PrismaClient()

    async createTransaction(transaction: CreateTransactionDto): Promise<TRANSACTIONS> {
        return this.prisma.tRANSACTIONS.create({
            data: {
                IDUSUARIO: transaction.idUsuario,
                VALOR: transaction.valor,
                NOME: transaction.nome,
                DESCRICAO: transaction.descricao || null,
                DTPAGAMENTO: transaction.dtPagamento || null,
                TIPO: transaction.tipo,
                PAYMENT_ACCOUNT: transaction.paymentAccount,
                PAYMENT_TYPE_ID: transaction.paymentTypeId,
                CATEGORIA_ID: transaction.categoriaId,
                STATUS_ID: transaction.statusId,
            }
        })
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
        const actualTransaction =await this.findOneById(transaction.id);

        return this.prisma.tRANSACTIONS.update({
            where:{
                IDTRANSACTIONS:transaction.id
            },
            data:{
                NOME:transaction.nome || actualTransaction.NOME,
                TIPO:transaction.tipo || actualTransaction.TIPO,
                DESCRICAO:transaction.descricao || actualTransaction.DESCRICAO,
                VALOR:transaction.valor || actualTransaction.VALOR,
                PAYMENT_ACCOUNT: transaction.paymentAccount || actualTransaction.PAYMENT_ACCOUNT,
                PAYMENT_TYPE_ID: transaction.paymentTypeId || actualTransaction.PAYMENT_TYPE_ID,
                DTPAGAMENTO: transaction.dtPagamento || actualTransaction.DTPAGAMENTO,
                CATEGORIA_ID: transaction.categoriaId || actualTransaction.CATEGORIA_ID,
                STATUS_ID: transaction.statusId || actualTransaction.STATUS_ID,
                DTEDICAO:new Date()
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
