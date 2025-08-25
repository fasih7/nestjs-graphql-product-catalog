import { ObjectType, Field } from '@nestjs/graphql';
import { PaginationMeta } from '../../shared/inputs/pagination.input';
import { Product } from '../entities/product.entity';

@ObjectType()
export class ProductPaginatedResponse {
  @Field(() => [Product])
  items: Product[];

  @Field(() => PaginationMeta)
  pagination: PaginationMeta;
}
