import { Injectable } from '@nestjs/common';
import { CreateUserInput } from '../dto/create-user.input';
import { UpdateUserInput } from '../dto/update-user.input';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(@InjectRepository(User) private userRepo: Repository<User>) {}

  async create(createUserInput: CreateUserInput): Promise<User> {
    const user = this.userRepo.create(createUserInput);
    const result = await this.userRepo.save(user);
    return result;
  }

  //TODO: should be only on find one with any condition
  async findOneWithEmail(email: string) {
    return await this.userRepo.findOneBy({ email });
  }

  findAll() {
    return `Pending implementation`;
  }

  async findOne(id: number) {
    return await this.userRepo.findOne({ where: { id } });
  }

  async update(id: number, updateUserInput: UpdateUserInput) {
    const user = await this.userRepo.findOne({ where: { id } });
    if (!user) {
      throw new Error(`User with ID ${id} not found`);
    }

    Object.assign(user, updateUserInput);

    return await this.userRepo.save(user);
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
