import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaClient } from '@prisma/client'
import { User, UserObject } from './interfaces/interfaces';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  
  private readonly prisma = new PrismaClient()

  async create(createUserDto: CreateUserDto): Promise<User | null> {
    const senha = await bcrypt.hash(createUserDto.senha, 12)
    const result = await this.prisma.uSUARIO.create({ data: { NOME: createUserDto.nome, SENHA: senha, EMAIL: createUserDto.email } });
    if (result === null)
      return null
    return { id: result.IDUSUARIO, nome: result.NOME, email: result.EMAIL, senha: result.SENHA }
  }

  findAll() {
    return this.prisma.uSUARIO.findMany();
  }

  async searchUserByEmail (data: UserObject): Promise<UserObject | Error> {
    const passRef = await bcrypt.hash(data.senha, 12)
    const user = await this.findUserByEmail(data.email)
    
    console.log(user)
    if (passRef !== user?.email)
      return new Error('Email ou senha inválidos')

    return user
  }

  async findUserByEmail(email: string): Promise<UserObject | null> {
    const result = await this.prisma.uSUARIO.findUnique({ where: { EMAIL: email } });
    return { email: result.EMAIL, senha: result.SENHA } || null;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
