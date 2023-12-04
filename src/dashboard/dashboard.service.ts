import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { ServerError } from 'src/class/error/server-error';
import { HttpResponse } from 'src/utils/http';
import { badRequest, serverError } from 'src/utils/http-helper';


@Injectable()
export class DashboardService {

  private readonly prisma: PrismaClient = new PrismaClient()

  async getDashboard(token: string): Promise<HttpResponse> {

    try {
      const cash = { despesa: 0, receita: 0, total: 0 }
      if (!token)
        return badRequest(new Error('Token inválido'))

      const user = await this.findUserbyToken(token)

      if (!user)
        return { code: 200, status: false, message: 'Invalid user' }

      const result = await this.getData(user.IDUSUARIO)

      for (const element of result) {
        if (element.TIPO == 1)
          cash.despesa += element.VALOR

        if (element.TIPO == 2)
          cash.receita += element.VALOR

        cash.total += element.VALOR
      }

      return { code: 200, status: true, body: cash }

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
}
