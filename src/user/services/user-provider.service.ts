import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserProvider } from '../entities/user-provider.entity';
import { GoogleSSOObject, SQLQueryOptions } from '../../shared/types';

@Injectable()
export class UserProviderService {
  constructor(
    @InjectRepository(UserProvider)
    private userProviderRepo: Repository<UserProvider>,
  ) {}

  async createUserProvider(
    userProviderParams: Partial<GoogleSSOObject> & { userId: number },
  ) {
    const query = this.userProviderRepo.create({
      ...userProviderParams,
      user: { id: userProviderParams.userId },
    });
    const result = await this.userProviderRepo.save(query);

    return result;
  }

  async getUserProviderWithId(providerId: string, option: SQLQueryOptions) {
    const result = await this.userProviderRepo.findOne({
      where: { providerId },
      ...option,
    });
    return result;
  }
}
