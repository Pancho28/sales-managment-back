import { Injectable, Logger, NotFoundException, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { User, Local } from '../users/entities';
import { Product, Category } from "./entities";
import { CreateProductDto, CategoryDto, UpdateProductDto } from "./dtos";
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Roles } from "../helpers/enum";

@Injectable()
export class ProductService {

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
        this.logger = new Logger(ProductService.name);
    }

    async getProducts(user: User) : Promise<Product[]> { 
        let products: Product[]; 
        if (user.role = Roles.SELLER){  
            const local = await this.localRepository.createQueryBuilder('local')
                                                .where('local.userId = :userId', { userId: user.id })
                                                .getOne();
            products = await this.productRepository.createQueryBuilder('product')
                                                    .innerJoinAndSelect('product.category', 'category')
                                                    .where('product.localId = :localId', { localId: local.id })
                                                    .andWhere('product.status = :status', { status: 'ACTIVE' })
                                                    .getMany();
        }
        else if (user.role = Roles.ADMIN) {
            products = await this.productRepository.createQueryBuilder('product')
                                                    .innerJoinAndSelect('product.category', 'category')
                                                    .andWhere('product.status = :status', { status: 'ACTIVE' })
                                                    .getMany();
            
        }
        else {
            throw new UnauthorizedException(`Usuario ${user.username} no tiene permiso`);
        }
        return products;
    }

    async getCategoryProducts(user: User): Promise<Category[]>{
        let categories: Category[];
        if (user.role = Roles.SELLER){
            const local = await this.localRepository.createQueryBuilder('local')
                                                .where('local.userId = :userId', { userId: user.id })
                                                .getOne();
            categories = await this.categoryRepository.createQueryBuilder('category')
                                                    .select('category.id')
                                                    .addSelect('category.name')
                                                    .addSelect('products.id')
                                                    .addSelect('products.name')
                                                    .addSelect('products.price')
                                                    .addSelect('products.creationDate')
                                                    .addSelect('products.updateDate')
                                                    .addSelect('products.status')
                                                    .innerJoin('category.product', 'products')
                                                    .where('products.localId = :localId', { localId: local.id })
                                                    .getMany();
        }
        else if (user.role = Roles.ADMIN){
            categories = await this.categoryRepository.createQueryBuilder('category')
                                                    .innerJoinAndSelect('category.product', 'products')
                                                    .getMany();
        }
        else{
            throw new UnauthorizedException(`Usuario ${user.username} no tiene permiso`);
        }
        return categories;
    }

    async createProduct(product: CreateProductDto) : Promise<Product> {
        const local = await this.localRepository.findOneBy({ id: product.localId });
        if (!local){
            throw new NotFoundException(`Local con id ${product.localId} no encontrado`);
        }
        const category = await this.categoryRepository.findOneBy({ id: product.categoryId });
        if (!category){
            throw new NotFoundException(`Categorria con id ${product.categoryId} no encontrada`);
        }
        const productExist = await this.productRepository.findOneBy({ name: product.name, local });
        if (productExist){
            throw new BadRequestException(`Producto con nombre ${product.name} ya existe`);
        }
        const newProduct = this.productRepository.create({
            name: product.name,
            price: product.price,
            creationDate: product.creationDate,
            category,
            local
        });
        await this.productRepository.save(newProduct);
        this.logger.log(`Product with name ${product.name} created`);
        return newProduct;
    }

    async updateProduct(localId: string, productDto: UpdateProductDto) : Promise<Product> {
        if (!productDto.name && !productDto.price && !productDto.categoryId){
            throw new BadRequestException('Nombre, precio y categoria no pueden ser nulos');
        }
        const product = await this.productRepository.createQueryBuilder('product')
                                                    .where('product.id = :productId', { productId: productDto.productId })
                                                    .andWhere('product.localId = :localId', { localId })
                                                    .getOne();
        if (!product){
            throw new NotFoundException(`Producto con id ${productDto.productId} no encontrado`);
        }
        if (productDto.categoryId){
            const category = await this.categoryRepository.findOneBy({ id: productDto.categoryId });
            if (!category){
                throw new NotFoundException(`Categorria con id ${productDto.categoryId} no encontrada`);
            }
            productDto.categoryId ? product.category = category : null;
        }
        productDto.name ? product.name = productDto.name : null;
        productDto.price ? product.price = productDto.price : null;
        product.updateDate = productDto.updateDate;
        await this.productRepository.save(product);
        this.logger.log(`Product name ${product.name} updated`);
        return product;
    }

    async createCategory(user: User, category: CategoryDto) : Promise<Category> {
        if (user.role != Roles.ADMIN){
            throw new UnauthorizedException(`Usuario ${user.username} no tiene permiso`);
        }
        const categoryExist = await this.categoryRepository.findOneBy({ name: category.name });
        if (categoryExist){
            throw new BadRequestException(`Categoria con nombre ${category.name} ya existe`);
        }
        const newCategory = this.categoryRepository.create({
            name: category.name,
            creationDate: category.date
        });
        await this.categoryRepository.save(newCategory);
        this.logger.log(`Category with name ${category.name} created`);
        return newCategory;
    }

    async updateCategory(user: User, categoryDto: CategoryDto, categoryId: string) : Promise<Category> {
        if (user.role != Roles.ADMIN){
            throw new UnauthorizedException(`Usuario ${user.username} no tiene permiso`);
        }
        const category = await this.categoryRepository.findOneBy({ id: categoryId });
        if (!category){
            throw new NotFoundException(`Categoria con id ${categoryId} no encontrada`);
        }
        const categoryExist = await this.categoryRepository.findOneBy({ name: categoryDto.name });
        if (categoryExist){
            throw new BadRequestException(`Categoria con nombre ${categoryExist.name} ya existe`);
        }
        category.name = categoryDto.name;
        category.updateDate = categoryDto.date;
        await this.categoryRepository.save(category);
        this.logger.log(`Category with id ${categoryId} updated`);
        return category;
    }

    async getCategories() : Promise<Category[]> {
        const categories = await this.categoryRepository.find();
        return categories;
    }

    async activeProduct(localId: string, productId: string) : Promise<Product> {
        const product = await this.productRepository.createQueryBuilder('product')
                                                    .where('product.id = :productId', { productId })
                                                    .andWhere('product.localId = :localId', { localId })
                                                    .getOne();;
        if (!product){
            throw new NotFoundException(`Producto con id ${productId} no encontrado`);
        }
        product.status = 'ACTIVE';
        await this.productRepository.save(product);
        this.logger.log(`Product with id ${productId} activated`);
        return product;
    }

    async inactiveProduct(localId: string, productId: string) : Promise<Product> {
        const product = await this.productRepository.createQueryBuilder('product')
                                                    .where('product.id = :productId', { productId })
                                                    .andWhere('product.localId = :localId', { localId })
                                                    .getOne();;
        if (!product){
            throw new NotFoundException(`Producto con id ${productId} no encontrado`);
        }
        product.status = 'INACTIVE';
        await this.productRepository.save(product);
        this.logger.log(`Product with id ${productId} inactivated`);
        return product;
    }

    async getProductsSummaryByPrice(localId: string, date: Date) {
        const hours = date.getHours();
        let productsSummaryByPrice : any;
        if (hours >= 0 && hours <= 6){
            productsSummaryByPrice = await this.productRepository.createQueryBuilder("product")
                                    .select("SUM(order_item.quantity)", "quantity")
                                    .addSelect("order_item.price", "price")
                                    .addSelect("product.name", "name")
                                    .innerJoin("order_item","order_item", "order_item.productId = product.id")
                                    .innerJoin("orders","orders", "orders.id = order_item.orderId")
                                    .innerJoin("payment_order","payment_order","orders.id = payment_order.orderId")
                                    .where("product.localId = :localId", { localId })
                                    .andWhere("payment_order.isPaid = true")
                                    .andWhere("orders.creationdate >= CONCAT(DATE_ADD(CURDATE(), INTERVAL -1 DAY), ' 11:00:00')")
                                    .groupBy("order_item.price")
                                    .addGroupBy("product.name")
                                    .getRawMany();
        }else {   
            productsSummaryByPrice = await this.productRepository.createQueryBuilder("product")
                                    .select("SUM(order_item.quantity)", "quantity")
                                    .addSelect("order_item.price", "price")
                                    .addSelect("product.name", "name")
                                    .innerJoin("order_item","order_item", "order_item.productId = product.id")
                                    .innerJoin("orders","orders", "orders.id = order_item.orderId")
                                    .innerJoin("payment_order","payment_order","orders.id = payment_order.orderId")
                                    .where("product.localId = :localId", { localId })
                                    .andWhere("payment_order.isPaid = true")
                                    .andWhere("orders.creationdate >= CONCAT(CURDATE(), ' 11:00:00')")
                                    .groupBy("order_item.price")
                                    .addGroupBy("product.name")
                                    .getRawMany();
        }
        return productsSummaryByPrice;
    }

}