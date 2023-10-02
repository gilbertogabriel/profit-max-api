import { Injectable } from '@nestjs/common';
import {RestorePasswordDto} from "./dto/restore-password.dto";
import {EmailRepository} from "./email.repository";

@Injectable()
export class EmailService {
    constructor(private readonly emailRepository: EmailRepository) {
    }
    subscriveToken() {

    }
    sendRecoveryEmail(restorePasswordDto: RestorePasswordDto) {

        const min = 1000;
        const max = 9999;
        const token = Math.floor(Math.random() * (max - min + 1)) + min;
        return this.emailRepository.sendRecoveryKey(token.toString());
    }
}