import { Body, Controller, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { httpResponseDecorator } from 'src/decorator/http-response-decorator';
import { CreateUserDto } from './dto/create-user.dto';
import { FindUserDto } from './dto/find-user.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('create')
  async create(@Body() createUserDto: CreateUserDto, @Res() res: Response): Promise<void> {
    const result = await this.userService.create(createUserDto);
    return httpResponseDecorator(res, result)
  }

  @Post('get/login')
  async findAll(@Body() findUserDto: FindUserDto, @Res() res: Response): Promise<void> {
    const result = await this.userService.searchUserByEmail(findUserDto);
    return httpResponseDecorator(res, result)
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
  //   return this.userService.update(+id, updateUserDto);
  // }

  // @Delete('remove/:id')
  // remove(@Param('id') id: string) {
  //   return this.userService.remove(+id);
  // }
}
