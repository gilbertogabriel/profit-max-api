import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaClient } from '@prisma/client'

@Injectable()
export class UserService {
  prisma = new PrismaClient()
  create(createUserDto: CreateUserDto) {
    const result = this.prisma.uSUARIO.create({ data: { NOME: createUserDto.nome, SENHA: createUserDto.senha, EMAIL: createUserDto.email } });
    return result
  }

  findAll() {
    return this.prisma.uSUARIO.findMany();
  }

  findOne(id: number) {
    const prisma = new PrismaClient()
    const result = prisma.uSUARIO.findUnique({ where: { IDUSUARIO: id } });
    return result;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
