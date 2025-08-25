import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Review } from '../entities/review.entity';
import { PaginationMeta } from '../../shared/inputs/pagination.input';

@ObjectType()
export class ReviewPaginatedResponse {
  @Field(() => [Review])
  items: Review[];

  @Field(() => PaginationMeta)
  pagination: PaginationMeta;
}
