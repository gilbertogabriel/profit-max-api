export class UpdateTransactionDto  {
    value:number;
    name: string;
    desc?: string;
    type: string;
    paymentDate?: Date;
    paymentAccount: string;
    categoryId: number;
    statusId: number;
}
