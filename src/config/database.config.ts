// src/config/database.config.ts
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export default () => ({
  database: {
    type: 'postgres' as const,
    host: process.env.DATABASE_HOST ?? 'localhost',
    port: parseInt(process.env.DATABASE_PORT ?? '5432', 10),
    username: process.env.DATABASE_USER ?? 'postgres',
    password: process.env.DATABASE_PASSWORD ?? '',
    database: process.env.DATABASE_NAME ?? 'product_catalog',
    autoLoadEntities: true,
    synchronize: process.env.NODE_ENV !== 'production',
  } as TypeOrmModuleOptions,
});
