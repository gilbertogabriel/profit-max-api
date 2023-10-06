import {Body, Controller, Post} from '@nestjs/common';
import {RestorePasswordDto} from "./dto/restore-password.dto";
import {EmailService} from "./email.service";
import {SendEmailDto} from "./dto/send-email.dto";
import * as path from "path";
import {ChangePasswordDto} from "./dto/change-password.dto";


@Controller('email')
export class EmailController {
    constructor(private readonly emailService: EmailService) {
    }

    @Post()
    sendRecoveryKey(@Body() restorePasswordDto: SendEmailDto) {
        return this.emailService.sendRecoveryEmail(restorePasswordDto.userEmail);
    }

    @Post('recovery')
    compareRecoveryKey(@Body() restorePasswordDto: RestorePasswordDto) {
        return this.emailService.compareRecoveryKey({
            email: restorePasswordDto.userEmail,
            token: restorePasswordDto.token
        })
    }

    @Post('password')
    changePassword(@Body() changePasswordDto: ChangePasswordDto) {
        return this.emailService.changeUserPassword(changePasswordDto.userEmail, changePasswordDto.newPassword)
    }
}
