import { Param, Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';
import { httpResponseDecorator } from 'src/decorator/http-response-decorator';
import { DashboardService } from './dashboard.service';
import { TokenDto } from './dto/dashboard.dto';

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('get/dashboard/:token')
  async create(@Param() token: TokenDto, @Res() res: Response): Promise<void> {
    const result = await this.dashboardService.getDashboard(token.token)
    return httpResponseDecorator(res, result)
  }
}
