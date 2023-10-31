export class CreateTransactionDto {
    userId:number;
    value:number;
    name: string;
    desc?: string;
    type: string;
}
