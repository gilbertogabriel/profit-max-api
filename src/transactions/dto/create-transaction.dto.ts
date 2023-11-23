export class CreateTransactionDto {
    userId:number;
    value:number;
    name: string;
    desc?: string;
    type: number;
    paymentDate?: Date;
    paymentAccount: string;
    paymentType: string;
    categoryId: number;
    statusId: number;
}

