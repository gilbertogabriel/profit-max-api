export class CreateTransactionDto {
    idUsuario: number;
    valor: number;
    nome: string;
    descricao: string;
    dtPagamento?: Date;
    tipo: number;
    paymentAccount: string;
    paymentTypeId: number;
    categoriaId: number;
    statusId: number;
}