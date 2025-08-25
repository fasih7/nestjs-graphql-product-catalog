import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { ReviewsService } from './reviews.service';
import { Review } from './entities/review.entity';
import { CreateReviewInput } from './dto/create-review.input';
import { UpdateReviewInput } from './dto/update-review.input';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../auth/guards/jwt-auth.gaurd';
import { RolesGuard } from '../auth/guards/role.gaurd';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../user/entities/user.entity';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { ReviewPaginatedResponse } from './dto/reviews.response';
import { PaginationInput } from '../shared/inputs/pagination.input';

@Resolver(() => Review)
export class ReviewsResolver {
  constructor(private readonly reviewsService: ReviewsService) {}

  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles(UserRole.user)
  @Mutation(() => Review)
  createReview(
    @Args('createReviewInput') createReviewInput: CreateReviewInput,
    @CurrentUser() req,
  ) {
    return this.reviewsService.create({ ...createReviewInput, userId: req.id });
  }

  @Query(() => ReviewPaginatedResponse, { name: 'reviews' })
  async findAll(
    @Args('pagination', { nullable: true }) pagination?: PaginationInput,
  ) {
    // Pass pagination object directly to service; service handles defaults
    return this.reviewsService.findAll(pagination);
  }

  @Query(() => Review, { name: 'review' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.reviewsService.findOne(id);
  }

  @Mutation(() => Review)
  updateReview(
    @Args('updateReviewInput') updateReviewInput: UpdateReviewInput,
  ) {
    return this.reviewsService.update(updateReviewInput.id, updateReviewInput);
  }
}
