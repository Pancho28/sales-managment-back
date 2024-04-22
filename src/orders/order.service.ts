import { Injectable, Logger, NotFoundException, BadRequestException } from '@nestjs/common';
import { User } from '../users/entities';
import { Product, Local, Category } from "./entities";
import { CreateProductDto, CategoryDto } from "./dtos";
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class OrderService {

    logger : Logger;

    constructor(
        @InjectRepository(Product)
        private productRepository: Repository<Product>,
        @InjectRepository(Local)
        private localRepository: Repository<Local>,
        @InjectRepository(Category)
        private categoryRepository: Repository<Category>
    )
    {
        this.logger = new Logger(OrderService.name);
    }

    async getProducts(localId: string) : Promise<Product[]> {     
        const products = await this.productRepository.createQueryBuilder('product')
                                                    .where('local.localId = :localId', { localId })
                                                    .getMany();
        return products;
    }

    async createProduct(localId: string, product: CreateProductDto) : Promise<Product> {
        const local = await this.localRepository.findOneBy({ localId });
        if (!local){
            this.logger.error(`Local with id ${localId} not found`);
            throw new NotFoundException(`Local con id ${localId} no encontrado`);
        }
        const category = await this.categoryRepository.findOneBy({ categoryId: product.categoryId });
        if (!category){
            this.logger.error(`Category with id ${product.categoryId} not found`);
            throw new NotFoundException(`Categorria con id ${product.categoryId} no encontrada`);
        }
        const productExist = await this.productRepository.findOneBy({ name: product.name, local });
        if (productExist){
            this.logger.error(`Product with name ${product.name} already exists`);
            throw new BadRequestException(`Producto con nombre ${product.name} ya existe`);
        }
        const newProduct = this.productRepository.create({
            name: product.name,
            price: product.price,
            updateDate: null,
            category,
            local
        });
        await this.productRepository.save(newProduct);
        this.logger.log(`Product with name ${product.name} created`);
        return newProduct;
    }

    async createCategory(user: User, category: CategoryDto) : Promise<Category> {
        if (user.role != 'ADMIN'){
            this.logger.error(`User with email ${user.email} not have permission to create category`);
            throw new BadRequestException('Usuario no tiene permiso');
        }
        const categoryExist = await this.categoryRepository.findOneBy({ name: category.name });
        if (categoryExist){
            this.logger.error(`Category with name ${category.name} already exists`);
            throw new BadRequestException(`Categoria con nombre ${category.name} ya existe`);
        }
        const newCategory = this.categoryRepository.create({
            name: category.name,
            updateDate: null
        });
        await this.categoryRepository.save(newCategory);
        this.logger.log(`Category with name ${category.name} created`);
        return newCategory;
    }

    async updateCategory(user: User, categoryDto: CategoryDto, categoryId: string) : Promise<Category> {
        if (user.role != 'ADMIN'){
            this.logger.error(`User with email ${user.email} not have permission to update category`);
            throw new BadRequestException('Usuario no tiene permiso');
        }
        const category = await this.categoryRepository.findOneBy({ categoryId });
        if (!category){
            this.logger.error(`Category with id ${categoryId} not found`);
            throw new NotFoundException(`Categoria con id ${categoryId} no encontrada`);
        }
        const categoryExist = await this.categoryRepository.findOneBy({ name: categoryDto.name });
        if (categoryExist){
            this.logger.error(`Category with name ${categoryExist.name} already exists`);
            throw new BadRequestException(`Categoria con nombre ${categoryExist.name} ya existe`);
        }
        category.name = categoryDto.name;
        category.updateDate = new Date();
        await this.categoryRepository.save(category);
        this.logger.log(`Category with id ${categoryId} updated`);
        return category;
    }

}