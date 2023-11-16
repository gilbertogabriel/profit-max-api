import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { Bcrypt } from 'src/class/bcrypt/bcrypt';
import { LoginError } from 'src/class/error/login-error';
import { ServerError } from 'src/class/error/server-error';
import { Jwt } from 'src/class/jwt/jwt';
import { createUserValidatorDecorator } from 'src/decorator/create-user-validator-decorator';
import { findUserByEmailValidatorDecorator } from 'src/decorator/find-user-by-email-validator-decorator';
import { BcryptSignature } from 'src/signatures/bcrypt-signature';
import { JwtSignature } from 'src/signatures/jwt-signature';
import { ValidationSignature } from 'src/signatures/validator-signature';
import { HttpResponse } from 'src/utils/http';
import { badRequest, forbbiden, responseOk, serverError } from 'src/utils/http-helper';
import { CreateUserDto } from './dto/create-user.dto';
import { User, UserObject } from './interfaces/user-interfaces';

@Injectable()
export class UserService {

  private readonly prisma: PrismaClient = new PrismaClient()
  private readonly bcrypt: BcryptSignature = new Bcrypt()
  private readonly jwt: JwtSignature = new Jwt()
  private readonly createUserValidation: ValidationSignature = createUserValidatorDecorator()
  private readonly findUserByEmailValidation: ValidationSignature = findUserByEmailValidatorDecorator()

  async create(createUserDto: CreateUserDto): Promise<HttpResponse> {

    try {
      let token: string = ''
      const error = this.createUserValidation.validate(createUserDto)
      if (error)
        return badRequest(error)

      const { nome, senha, email } = createUserDto
      const hashPass = await this.bcrypt.hash(senha)
      const result = await this.prisma.uSUARIO.create({ data: { NOME: nome, SENHA: hashPass, EMAIL: email } });

      if (result) {
        token = this.jwt.encrypt(String(result.IDUSUARIO))
        await this.prisma.tOKEN.create({ data: { TOKEN: token, IDUSUARIO: result.IDUSUARIO } })
      }

      const body = {
          id: result.IDUSUARIO
        , nome: result.NOME, email: result.EMAIL
        , token
      }

      return { code: 200, status: true, body }

    } catch (err) {
      if (err.message.match(new RegExp(/USUARIO_EMAIL_key/)))
        return serverError(new ServerError('User already in use'))

      await this.prisma.$executeRaw`ROLLBACK;`//descobrir um jeito de fazer rollback em caso de erro
      return serverError(new ServerError())
    }
  }

  async searchUserByEmail(data: UserObject): Promise<HttpResponse> {
    let userId;
    const error = await this.findUserByEmailValidation.validate(data)
    if (error)
      return badRequest(error)

    const user = await this.findUserByEmail(data.email)
    userId = user.id;
    if (!user)
     return responseOk({ message: 'User not found' }, false)

    const passIsValid = await this.bcrypt.compare(data.senha, user.senha)

    if (!passIsValid)
      return forbbiden(new LoginError('Logir Error: Verify email or password'))

    let { TOKEN: token } = await this.findTokenByEmail(user.email)

    if (!token) {
      token = this.jwt.encrypt(String(user.id))
      await this.deleteTokens(user.id)
      await this.prisma.tOKEN.create({ data: { TOKEN: token, IDUSUARIO: user.id } })
    }
    console.log(responseOk({ user }))
    return responseOk({ user })
  }

  async findUserByEmail(email: string): Promise<User | null> {

    try {
      const result = await this.prisma.uSUARIO.findUnique({ where: { EMAIL: email } });

      if (result)
        return { id: result.IDUSUARIO, email: result.EMAIL, senha: result.SENHA };
      
      return null
    } catch (err) {
      return null
    }
  }

  async deleteTokens(IDUSUARIO: number): Promise<void> {
    try {
      await this.prisma.tOKEN.updateMany({ where: { IDUSUARIO }, data: { SNDELETE: 1 } })
    } catch (err) {
      throw err
    }
  }

  async findTokenByEmail(email: string): Promise<string | any>  {
    try {
      const result = await this.prisma.tOKEN.findMany({
        where: {
          DTEXPIRA: {
            gte: new Date()
          },
          SNDELETE: 0,
          USUARIO: {
            EMAIL: email
          }
        },
        include: {
          USUARIO: true
        }
      });
      
      if (result.length > 0)
        return result[0]
      
      return { TOKEN: null }
    } catch (error) {
      return null
    }
  }
}
