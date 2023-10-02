import * as jwt from 'jsonwebtoken';
import { JwtSignature } from 'src/signatures/jwt-signature';

export class Jwt implements JwtSignature {
  private readonly jwt = jwt
  private readonly secret: string = '123qs88c55s9evfvygtvsd$'

  encrypt(data: string): string {
      const accessToken = this.jwt.sign({ id: data }, this.secret)
      return accessToken
  }

  decrypt (token: string): string | jwt.JwtPayload {
      const result = this.jwt.verify(token, this.secret)
      return result
  }
}