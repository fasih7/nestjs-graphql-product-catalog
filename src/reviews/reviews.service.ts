import { Injectable } from '@nestjs/common';
import { CreateReviewInput } from './dto/create-review.input';
import { UpdateReviewInput } from './dto/update-review.input';
import { InjectRepository } from '@nestjs/typeorm';
import { Review } from './entities/review.entity';
import { Repository } from 'typeorm';
import { ProductService } from '../product/product.service';
import { PaginationParams } from '../shared/types';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Review) private reviewRepo: Repository<Review>,
    private productService: ProductService,
  ) {}

  async create(createReviewInput: CreateReviewInput & { userId: number }) {
    const { userId, productId, ...restInput } = createReviewInput;
    const queryFields = {
      ...restInput,
      user: { id: userId },
      product: { id: productId },
    };

    const savedReview = await this.reviewRepo.save(queryFields);

    // Update product average
    await this.updateProductAverageRating(productId);

    return savedReview;
  }

  async findAll(pagination: PaginationParams = { page: 1, limit: 10 }) {
    const { page, limit } = pagination;
    const [items, total] = await this.reviewRepo.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      items,
      pagination: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  findOne(id: number) {
    return `This action returns a #${id} review`;
  }

  async update(id: number, updateReviewInput: UpdateReviewInput) {
    const review = await this.reviewRepo.findOne({
      where: { id },
      relations: ['product'],
    });
    if (!review) throw new Error('Review not found');

    Object.assign(review, updateReviewInput);
    const updatedReview = await this.reviewRepo.save(review);

    // Update product average
    await this.updateProductAverageRating(review.product.id);

    return updatedReview;
  }

  //------------- Private / Helper methods -------------//

  private async updateProductAverageRating(productId: number) {
    const { avg } = await this.reviewRepo
      .createQueryBuilder('review')
      .select('AVG(review.rating)', 'avg')
      .where('review.productId = :productId', { productId })
      .getRawOne();

    await this.productService.update(productId, {
      averageRating: parseFloat(avg),
    });
  }
}
