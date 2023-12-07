export class UpdateTransactionDto  {
    transactionId: number;
    idUsuario: number;
    valor: number;
    nome: string;
    descricao: string;
    dtPagamento?: Date | null;
    tipo: number;
    paymentAccount: string;
    paymentTypeId: number;
    categoriaId: number;
    statusId: number;
}
