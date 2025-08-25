import { Module } from '@nestjs/common';
import { UserService } from './services/user.service';
import { UserResolver } from './user.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserProvider } from './entities/user-provider.entity';
import { UserProviderService } from './services/user-provider.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, UserProvider])],
  providers: [UserResolver, UserService, UserProviderService],
  exports: [UserService, UserProviderService],
})
export class UserModule {}
