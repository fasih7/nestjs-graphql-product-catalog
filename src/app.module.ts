import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductModule } from './product/product.module';
import { DateScalar } from './scalars/date.scalar';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { ReviewsModule } from './reviews/reviews.module';
import { CategoriesModule } from './categories/categories.module';
import appConfig from './config/app.config';
import databaseConfig from './config/database.config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [appConfig, databaseConfig] }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      context: ({ req, res }) => ({ req, res }),
      fieldResolverEnhancers: ['guards'],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) =>
        config.get<TypeOrmModuleOptions>('database')!,
    }),
    ProductModule,
    AuthModule,
    UserModule,
    ReviewsModule,
    CategoriesModule,
  ],
  controllers: [AppController],
  providers: [DateScalar, AppService],
})
export class AppModule {}

// --------------- TODOS ------------------ //
// 1. Add category
