import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import * as moment from 'moment';
import { ServerError } from 'src/class/error/server-error';
import { HttpResponse } from 'src/utils/http';
import { badRequest, responseOk, serverError } from 'src/utils/http-helper';

type AuxDate = {
  antes: boolean
  hoje: boolean
  depois: boolean
}

type Saldo = {
  data: string
  saldo: number
}

type Percent = { 
  id: number, 
  percent: number, 
  quantidade: number, 
  total: number
}

type CategoryPercent = {
    LAZER           : Percent
  , RECORRENTE      : Percent
  , 'BENS MATERIAIS': Percent
  , EXTRA           : Percent 
}

type PaymentPercent = {
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

type ObjectLate = { 
    IDTRANSACTION: number
  , NOME: string
  , STATUS_ID: number
  , DESCRICAO : string
  , VALOR: number
}

type PaymentDashboard = { 
    total: number
  , percent: number
  , quantidade: number
  , pagamentos: NextPayments
}
type NextPayments = { 
  atraso : Array<NextPaymentsObj>
  futuras: Array<NextPaymentsObj> 
  hoje   : Array<NextPaymentsObj> 
}

type NextPaymentsObj = {
  NOME: string
  STATUS_ID: number
  DESCRICAO: string
}

type Total = {
  saldo: number
}

type Cash = {
  despesa: PaymentDashboard
  receita: PaymentDashboard
  total: Total
}

@Injectable()
export class DashboardService {

  private readonly prisma: PrismaClient = new PrismaClient()
  
  async getDashboard(token: string): Promise<HttpResponse> {

    try {
      if (!token)
      return badRequest(new Error('Token inválido'))
    
      const user = await this.findUserbyToken(token)
      
      if (!user)
      return { code: 200, status: false, message: 'Invalid user' }
    
      const cash: Cash = { 
          despesa: { total: 0, percent: 0.0, quantidade: 0, pagamentos: { atraso: [], futuras: [], hoje: [] } }
        , receita: { total: 0, percent: 0.0, quantidade: 0, pagamentos: { atraso: [], futuras: [], hoje: [] } }
        , total  : { saldo: 0 } 
      }
      const result = await this.getData(user.IDUSUARIO)
      const categorias: CategoryPercent = { 
          LAZER           : { id: 1, percent: 0.0, quantidade: 0, total: 0.0 }
        , RECORRENTE      : { id: 2, percent: 0.0, quantidade: 0, total: 0.0 }
        , 'BENS MATERIAIS': { id: 3, percent: 0.0, quantidade: 0, total: 0.0 }
        , EXTRA           : { id: 4, percent: 0.0, quantidade: 0, total: 0.0 }   
      }
      const pagamentos = {
          'Credito em conta' : { id: 1, percent: 0.0, quantidade: 0, total: 0.0 }
        , 'Boleto'           : { id: 2, percent: 0.0, quantidade: 0, total: 0.0 }
        , 'Debito Automático': { id: 3, percent: 0.0, quantidade: 0, total: 0.0 }
        , 'Conta corrente'   : { id: 4, percent: 0.0, quantidade: 0, total: 0.0 }
        , 'Dinheiro'         : { id: 5, percent: 0.0, quantidade: 0, total: 0.0 }
        , 'Contra-cheque'    : { id: 6, percent: 0.0, quantidade: 0, total: 0.0 }
        , 'Cartão de Crédito': { id: 7, percent: 0.0, quantidade: 0, total: 0.0 }
        , 'Cartão de Débito' : { id: 8, percent: 0.0, quantidade: 0, total: 0.0 }
        , 'PIX'              : { id: 9, percent: 0.0, quantidade: 0, total: 0.0 }
      }
      
      const saldo: Array<Saldo> = []

      for (const element of result) {
        const hour = 60*60*1000
        let dtpagemento = new Date(element.DTPAGAMENTO); dtpagemento = new Date(dtpagemento.getTime()+3*hour)
        const dtpagamento_str = dtpagemento.toLocaleDateString('en-US', {
          month: '2-digit',
          day: '2-digit',
          year: 'numeric',
        });
        let dtcriacao = new Date(element.DTCRIACAO); dtcriacao = new Date(dtcriacao.getTime()+3*hour)
        const dtcriacao_str = new Date(dtcriacao).toLocaleDateString('en-US', {
          month: '2-digit',
          day: '2-digit',
          year: 'numeric',
        });
        const data = this.compareDate(dtpagamento_str)

        const { TIPO, VALOR, IDTRANSACTION, STATUS_ID, DESCRICAO, NOME, CATEGORIA, PAYMENT_TYPE } = element
        if (TIPO == 1) {
          cash.despesa.quantidade++
          cash.despesa.total += VALOR
          cash.despesa.percent = (cash.despesa.quantidade/result.length)*100

          if (STATUS_ID !== 1) {
            this.getRunningLate(cash.despesa, data, { IDTRANSACTION, NOME, STATUS_ID, DESCRICAO, VALOR })
          }
        }

        if (TIPO == 2) {
          cash.receita.quantidade++
          cash.receita.total += VALOR
          cash.receita.percent = (cash.receita.quantidade/result.length)*100

          if (STATUS_ID !== 1) {
            this.getRunningLate(cash.receita, data, { IDTRANSACTION, NOME, STATUS_ID, DESCRICAO, VALOR })
          }      
        }

        categorias[CATEGORIA.NOME].quantidade += 1
        categorias[CATEGORIA.NOME].percent = (categorias[CATEGORIA.NOME].quantidade/result.length*100).toFixed(2)

        if (TIPO == 1)
          categorias[CATEGORIA.NOME].total -= VALOR
        else
          categorias[CATEGORIA.NOME].total += VALOR

        pagamentos[PAYMENT_TYPE.NOME].quantidade += 1
        pagamentos[PAYMENT_TYPE.NOME].percent = (pagamentos[PAYMENT_TYPE.NOME].quantidade/result.length*100).toFixed(2)

        if (TIPO == 1)
          pagamentos[PAYMENT_TYPE.NOME].total -= VALOR
        else
          pagamentos[PAYMENT_TYPE.NOME].total += VALOR

        if (saldo.length > 0) {
          const filtro = saldo.filter(data => data.data == dtcriacao_str) ?? null 
          if (!!filtro.length)
            if (TIPO == 1)
              saldo[saldo.indexOf(filtro[0])].saldo -= VALOR
            else
              saldo[saldo.indexOf(filtro[0])].saldo += VALOR
          else
            saldo.push({data: dtcriacao_str, saldo: TIPO == 1 ? -VALOR : VALOR })
        } else {
          saldo.push({ data: dtcriacao_str, saldo: TIPO == 1 ? -VALOR : VALOR })
        }

        if (TIPO == 1)
          cash.total.saldo -= VALOR
        else
          cash.total.saldo += VALOR
      }
      
      return responseOk({ ...cash, categorias, pagamentos, saldo })

    } catch (err) {
      if (err.message.match(new RegExp(/USUARIO_EMAIL_key/)))
        return serverError(new ServerError('User already in use'))

      await this.prisma.$executeRaw`ROLLBACK;`//descobrir um jeito de fazer rollback em caso de erro
      return serverError(new ServerError())
    }
  }

  async findUserbyToken(token: string): Promise<any> {

    try {
      const result = await this.prisma.tOKEN.findFirst({
        where: {
          SNDELETE: 0,
          TOKEN: token
        },
        include: {
          USUARIO: true
        }
      })

      return result.USUARIO
    } catch (err) {
      console.log(err.message)
      return null
    }
  }

  async getData(id: number): Promise<any> {

    try {
      const result = await this.prisma.tRANSACTIONS.findMany({
        where: {
          IDUSUARIO: id,
          DTCRIACAO: {
            gte: new Date(new Date().setDate(new Date().getDate() - 30))
          }
        },
        include: {
          STATUS: true,
          CATEGORIA: true,
          PAYMENT_TYPE: true
        }
      })

      return result
    } catch (err) {
      return null
    }
  }

  compareDate = (dataCompara: string): AuxDate  => {
    const dataAtual: string = moment().format('MM/DD/YYYY')
    const aux = { antes: false, hoje: false, depois: false }

    aux.antes = moment(dataCompara).isBefore(moment(dataAtual))
    aux.hoje = moment(dataCompara).isSame(moment(dataAtual))
    aux.depois = moment(dataCompara).isAfter(moment(dataAtual))

    return aux
  }

  getRunningLate = (element: PaymentDashboard, data: AuxDate, obj: ObjectLate): void => {
    if (data.antes) {      
      element.pagamentos.atraso.push(obj)
    }

    if (data.hoje) {
      element.pagamentos.hoje.push(obj)
    }

    if (data.depois) {
      element.pagamentos.futuras.push(obj)
    }
  }

}
