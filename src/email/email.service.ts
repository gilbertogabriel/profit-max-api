import {Injectable} from '@nestjs/common';
import {EmailRepository} from "./email.repository";
import {CompareRecoveryKeyInterface} from "./interfaces/compare-recovery-key-interface";

@Injectable()
export class EmailService {
    constructor(private readonly emailRepository: EmailRepository) {
    }

    compareRecoveryKey(campareEmail:CompareRecoveryKeyInterface) {
        return this.emailRepository.compareRecoveryKey(campareEmail.email, campareEmail.token);
    }

    async sendRecoveryEmail(email: string) {

        const min = 1000;
        const max = 9999;
        const token = Math.floor(Math.random() * (max - min + 1)) + min;

       const user_token = await this.emailRepository.createToken(email, token)
       return await this.emailRepository.sendRecoveryKey(email, token.toString())

    }
    async changeUserPassword(email:string, password: string, confirmPassword: string) {
        if(password !== confirmPassword) {
            throw new Error('As senhas não conferem')
        }else {
            return this.emailRepository.changeUserPassword(password, email)
        }
    }
}