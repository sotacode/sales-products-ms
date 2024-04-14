import { Injectable, Logger, NotFoundException, OnModuleInit, Query } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaClient } from '@prisma/client';
import { PaginationDto } from 'src/common';

@Injectable()
export class ProductsService extends PrismaClient implements OnModuleInit {

  private readonly logger = new Logger(ProductsService.name);
  onModuleInit() {
    this.$connect();
    this.logger.log('Connected to the database');
  }
  create(createProductDto: CreateProductDto) {
    return this.product.create({
      data: createProductDto
    });
  }

  async findAll(paginatioDto: PaginationDto) {
    const { page, limit } = paginatioDto;
    const total = await this.product.count();
    const totalPages = Math.ceil(total / limit);
    return {
      data: await this.product.findMany({
        take: limit,
        skip: (page - 1) * limit
      }),
      meta: {
        page,
        totalPages,
        total
      }
    }
  }

  async findOne(id: number) {
    const product = await this.product.findUnique({
      where: { id }
    });

    if(!product) throw new NotFoundException(`Product with id ${id} not found`);

    return product
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    await this.findOne(id);
    const product = this.product.update({
      where: { id },
      data: updateProductDto
    });

    return product;
  }
  

  remove(id: number) {
    return `This action removes a #${id} product`;
  }
}
