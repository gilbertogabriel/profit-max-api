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
import { badRequest, forbbiden, serverError } from 'src/utils/http-helper';
import { CreateUserDto } from './dto/create-user.dto';
import { UserObject } from './interfaces/user-interfaces';

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

    const error = await this.findUserByEmailValidation.validate(data)
    if (error)
      return badRequest(error)

    const user = await this.findUserByEmail(data.email)
    const passIsValid = await this.bcrypt.compare(data.senha, user.senha)

    const { TOKEN: token } = await this.findTokenByEmail(user.email)
    // if (!token)
      //criar token

    if (!passIsValid)
      return forbbiden(new LoginError('Logir Error: Verify email or password'))

    return { code: 200, status: true, body: { token } }
  }

  async findUserByEmail(email: string): Promise<UserObject | null> {
    const result = await this.prisma.uSUARIO.findUnique({ where: { EMAIL: email } });
    return { email: result.EMAIL, senha: result.SENHA } || null;
  }

  async findTokenByEmail(email: string): Promise<string | any>  {
    const result = await this.prisma.tOKEN.findMany({
      where: {
        DTEXPIRA: {
          gte: new Date()
        },
        USUARIO: {
          EMAIL: email
        }
      },
      include: {
        USUARIO: true
      }
    });

    return result[0]
  }
}
