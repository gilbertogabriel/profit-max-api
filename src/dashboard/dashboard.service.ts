import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import * as moment from 'moment';
import { ServerError } from 'src/class/error/server-error';
import { HttpResponse } from 'src/utils/http';
import { badRequest, serverError } from 'src/utils/http-helper';

type AuxDate = {
  antes: boolean
  hoje: boolean
  depois: boolean
}

@Injectable()
export class DashboardService {

  private readonly prisma: PrismaClient = new PrismaClient()
  
  async getDashboard(token: string): Promise<HttpResponse> {

    try {
      const cash = { despesa: { total: 0, porcentagem: 0.0, quantidade: 0, pagamentos: { atraso: [], futuras: [], hoje: [] } }, receita: { total: 0, porcentagem: 0.0, quantidade: 0, pagamentos: { atraso: [], futuras: [], hoje: [] } }, total: { total: 0 } }
      if (!token)
        return badRequest(new Error('Token inválido'))

      const user = await this.findUserbyToken(token)

      if (!user)
        return { code: 200, status: false, message: 'Invalid user' }

      const result = await this.getData(user.IDUSUARIO)
      const categorias = { 
          LAZER           : { id: 1, percent: 0.0, quantidade: 0, total: 0.0 }
        , RECORRENTE      : { id: 2, percent: 0.0, quantidade: 0, total: 0.0 }
        , 'BENS MATERIAIS': { id: 3, percent: 0.0, quantidade: 0, total: 0.0 }
        , EXTRA           : { id: 4, percent: 0.0, quantidade: 0, total: 0.0 }   
      }

      const pagamentos = {
        'Credito em conta' : { id: 1, percent: 0.0, quantidade: 0, total: 0.0 }
      , 'Boleto'           : { id: 2, percent: 0.0, quantidade: 0, total: 0.0 }
      , 'Debito Automático': { id: 3, percent: 0.0, quantidade: 0, total: 0.0 }
      , 'Conta Corrente'   : { id: 4, percent: 0.0, quantidade: 0, total: 0.0 }
      , 'Dinheiro'         : { id: 5, percent: 0.0, quantidade: 0, total: 0.0 }
      , 'Contra-cheque'    : { id: 6, percent: 0.0, quantidade: 0, total: 0.0 }
      , 'Cartão de Crédito': { id: 7, percent: 0.0, quantidade: 0, total: 0.0 }
      , 'Cartão de Débito' : { id: 8, percent: 0.0, quantidade: 0, total: 0.0 }
      , 'PIX'              : { id: 9, percent: 0.0, quantidade: 0, total: 0.0 }
    }
    
    for (const element of result) {

        const aux = new Date(element.DTPAGAMENTO); aux.setHours(3);
        const data = this.compareDate(aux.toLocaleDateString('en-US', {
          month: '2-digit',
          day: '2-digit',
          year: 'numeric',
        }))

        const { TIPO, VALOR, IDTRANSACTION, STATUS_ID, DESCRICAO, NOME, CATEGORIA, PAYMENT_TYPE } = element
        if (TIPO == 1) {
          cash.despesa.quantidade++
          cash.despesa.total += VALOR

          if (STATUS_ID !== 1) {
            if (data.antes) {
              cash.despesa.pagamentos.atraso.push({ IDTRANSACTION, NOME, STATUS_ID, DESCRICAO })
            }
  
            if (data.hoje) {
              cash.despesa.pagamentos.hoje.push({ IDTRANSACTION, NOME, STATUS_ID, DESCRICAO })
            }
  
            if (data.depois) {
              cash.despesa.pagamentos.futuras.push({ IDTRANSACTION, NOME, STATUS_ID, DESCRICAO })
            }
          }
        }

        if (TIPO == 2) {
          cash.receita.quantidade++
          cash.receita.total += VALOR

          if (STATUS_ID !== 1) {
            if (data.antes) {      
              cash.receita.pagamentos.atraso.push({ IDTRANSACTION, NOME, STATUS_ID, DESCRICAO })
            }
  
            if (data.hoje) {
              cash.receita.pagamentos.hoje.push({ IDTRANSACTION, NOME, STATUS_ID, DESCRICAO })
            }
  
            if (data.depois) {
              cash.receita.pagamentos.futuras.push({ IDTRANSACTION, NOME, STATUS_ID, DESCRICAO })
            }
          }      
        }

        categorias[CATEGORIA.NOME].quantidade += 1
        categorias[CATEGORIA.NOME].percent = (categorias[CATEGORIA.NOME].quantidade/result.length*100).toFixed(2)
        categorias[CATEGORIA.NOME].total += VALOR
        pagamentos[PAYMENT_TYPE.NOME].quantidade += 1
        pagamentos[PAYMENT_TYPE.NOME].percent = (pagamentos[PAYMENT_TYPE.NOME].quantidade/result.length*100).toFixed(2)
        pagamentos[PAYMENT_TYPE.NOME].total += VALOR
        cash.total.total += VALOR
      }

      return { code: 200, status: true, body: { ...cash, categorias, pagamentos } }

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

}
