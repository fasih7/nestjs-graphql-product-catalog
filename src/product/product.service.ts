import { Product } from './entities/product.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProductInput } from './dto/create-product.input';
import { Category } from '../categories/entities/category.entity';
import { PaginationParams } from '../shared/types';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product) private productRepo: Repository<Product>,
  ) {}

  async create(input: CreateProductInput): Promise<Product> {
    const { categoryId, ...rest } = input;

    // Construct product object conditionally, only include category if categoryId is provided
    // Later can change if category becomes required
    const product = this.productRepo.create({
      ...rest,
      ...(categoryId ? { category: { id: categoryId } as Category } : {}),
    });

    return this.productRepo.save(product);
  }

  async findAll(pagination: PaginationParams = { page: 1, limit: 10 }) {
    const { page, limit } = pagination;
    const [items, total] = await this.productRepo.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      items,
      pagination: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async findOneById(id: number) {
    const result = await this.productRepo.findOne({ where: { id } });
    return result;
  }

  async update(
    id: number,
    updateProductInput: Partial<Product & CreateProductInput>,
  ) {
    const { categoryId, ...rest } = updateProductInput;

    // Prepare the update object
    const updateData: Partial<Product> = {
      ...rest,
      ...(categoryId ? { category: { id: categoryId } as Category } : {}),
    };

    // Use save to handle both update and relations properly
    const existingProduct = await this.productRepo.findOne({ where: { id } });
    if (!existingProduct) {
      throw new Error('Product not found');
    }

    const updatedProduct = this.productRepo.merge(existingProduct, updateData);
    return this.productRepo.save(updatedProduct);
  }

  async deleteById(id: number) {
    const result = await this.productRepo.delete(id);
    return { success: result.affected === 1 };
  }
}
