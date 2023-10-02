import * as bcrypt from 'bcrypt';
import { BcryptSignature } from 'src/signatures/bcrypt-signature';

export class Bcrypt implements BcryptSignature {
  private readonly bcrypt = bcrypt
  async compare (webPass: string, userPass: string): Promise<boolean> {
    return await this.bcrypt.compare(webPass, userPass)
  }

  async hash(pass: string): Promise<string> {
      return await this.bcrypt.hash(pass, 12)
  }
}