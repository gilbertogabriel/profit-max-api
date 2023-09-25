import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { RestorePasswordDto } from './dto/restore-password.dto';

@Injectable()
export class UserService {
  create(createUserDto: CreateUserDto) {
    return 'This action adds a new user';
  }

  findAll() {
    return `This action returns all user`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: RestorePasswordDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  subscribeToken(){

  }

  sendRecoveryEmail(restorePasswordDto: RestorePasswordDto) {
    const min = 1000;
    const max = 9999;
    const token = Math.floor(Math.random() * (max - min + 1)) + min;
    this.subscribeToken();


  }

}
