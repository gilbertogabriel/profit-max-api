import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { Bcrypt } from 'src/class/bcrypt/bcrypt';
import { ServerError } from 'src/class/error/server-error';
import { Jwt } from 'src/class/jwt/jwt';
import { createUserValidatorDecorator } from 'src/decorator/create-user-validator-decorator';
import { findUserByEmailValidatorDecorator } from 'src/decorator/find-user-by-email-validator-decorator';
import { BcryptSignature } from 'src/signatures/bcrypt-signature';
import { JwtSignature } from 'src/signatures/jwt-signature';
import { ValidationSignature } from 'src/signatures/validator-signature';
import { HttpResponse } from 'src/utils/http';
import { badRequest, forbbiden, responseOk, serverError } from 'src/utils/http-helper';


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

      return { code: 200, status: true, body: user }

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
}
