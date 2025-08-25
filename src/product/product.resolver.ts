import { Resolver, Query, Args, Int, Mutation } from '@nestjs/graphql';
import { ProductService } from './product.service';
import { Product } from './entities/product.entity';
import { CreateProductInput } from './dto/create-product.input';
import { DeleteProductResponse } from './dto/delete-product.response';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../auth/guards/jwt-auth.gaurd';
import { RolesGuard } from '../auth/guards/role.gaurd';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../user/entities/user.entity';
import { ProductPaginatedResponse } from './dto/products.response';

@Resolver(() => Product)
export class ProductResolver {
  constructor(private readonly productService: ProductService) {}

  @Mutation(() => Product)
  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles(UserRole.admin)
  createProduct(@Args('createProductInput') input: CreateProductInput) {
    return this.productService.create(input);
  }

  @Query(() => ProductPaginatedResponse, { name: 'products' })
  findAll() {
    return this.productService.findAll();
  }

  @Query(() => Product, { name: 'product' })
  findOneById(@Args('id', { type: () => Int }) id: number) {
    return this.productService.findOneById(id);
  }

  @Mutation(() => DeleteProductResponse, { name: 'deleteProd' })
  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles(UserRole.admin)
  deleteProduct(@Args('id', { type: () => Int }) id: number) {
    return this.productService.deleteById(id);
  }
}
