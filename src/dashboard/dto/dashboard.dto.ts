export class TokenDto {
    token: string;
}

export type AuxDate = {
    antes: boolean
    hoje: boolean
    depois: boolean
  }
  
  export type Saldo = {
    data: string
    saldo: number
    movimentacao_total: number
  }
  
  export type Percent = { 
    id: number, 
    percent: number, 
    quantidade: number, 
    total: number
  }
  
  export type CategoryPercent = {
      LAZER           : Percent
    , RECORRENTE      : Percent
    , 'BENS MATERIAIS': Percent
    , EXTRA           : Percent 
  }
  
  export type PaymentPercent = {
      'Credito em conta' : Percent
    , 'Boleto'           : Percent
    , 'Debito Automático': Percent
    , 'Conta Corrente'   : Percent
    , 'Dinheiro'         : Percent
    , 'Contra-cheque'    : Percent
    , 'Cartão de Crédito': Percent
    , 'Cartão de Débito' : Percent
    , 'PIX'              : Percent
  }
  
  export type ObjectLate = { 
      IDTRANSACTION: number
    , NOME: string
    , STATUS_ID: number
    , DESCRICAO : string
    , VALOR: number
  }
  
  export type PaymentDashboard = { 
      total: number
    , percent: number
    , quantidade: number
    , pagamentos: NextPayments
  }
  export type NextPayments = { 
    atraso : Array<NextPaymentsObj>
    futuras: Array<NextPaymentsObj> 
    hoje   : Array<NextPaymentsObj> 
  }
  
  export type NextPaymentsObj = {
    NOME: string
    STATUS_ID: number
    DESCRICAO: string
  }
  
  export type Total = {
    saldo: number
  }
  
  export type Cash = {
    despesa: PaymentDashboard
    receita: PaymentDashboard
    saldo_atual: number
  }
