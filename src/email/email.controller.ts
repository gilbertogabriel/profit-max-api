import {Body, Controller, Post} from '@nestjs/common';
import {RestorePasswordDto} from "./dto/restore-password.dto";
import {EmailService} from "./email.service";


@Controller('email')
export class EmailController {
    constructor(private readonly emailService: EmailService) {
    }
    @Post('restore-password')
    sendRecoveryKey(@Body() restorePasswordDto: RestorePasswordDto) {
        return this.emailService.sendRecoveryEmail(restorePasswordDto);
    }

    @Post()
    compareRecoveryKey(@Body() restorePasswordDto: RestorePasswordDto) {

    }
}
