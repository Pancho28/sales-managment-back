import { Controller, Get, Post, UseGuards, HttpStatus, HttpCode, Put, Param, Body } from '@nestjs/common';
import { JwtAuthGuard } from '../authorization/guards';
import { GetUser } from '../authorization/decorators';
import { ProductService } from "./product.service";
import { User } from "../users/entities";
import { Product, Category } from "./entities";
import { CreateProductDto, CategoryDto, UpdateProductDto } from "./dtos";

@Controller('products')
export class ProductController {

    constructor(
        private readonly productService: ProductService,
    ) {}
    
    @Get()
    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.OK)
    async getProducts(
        @GetUser() user: User 
    ): Promise<any> {
        let products: Product[];

        products = await this.productService.getProducts(user);

        return {
            statusCode: HttpStatus.OK,
            products
        };
    }

    @Post()
    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.CREATED)
    async createProduct(
        @Body() product: CreateProductDto
    ): Promise<any> {
        let newProduct: Product;

        newProduct = await this.productService.createProduct(product);

        return {
            statusCode: HttpStatus.CREATED,
            message: 'Product created successfully',
        };
    }

    @Put('/:id')
    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.CREATED)
    async updateProduct(
        @Param('id') localId: string,
        @Body() product: UpdateProductDto
    ): Promise<any> {

        await this.productService.updateProduct(localId, product);

        return {
            statusCode: HttpStatus.CREATED,
            message: 'Product updated successfully',
        };
    }

    @Put('/active/:localId/:productId')
    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.CREATED)
    async activeProduct(
        @Param('productId') productId: string,
        @Param('localId') localId: string
    ): Promise<any> {

        await this.productService.activeProduct(localId,productId);

        return {
            statusCode: HttpStatus.CREATED,
            message: 'Product activated successfully',
        };
    }

    @Put('/inactive/:localId/:productId')
    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.CREATED)
    async inactiveProduct(
        @Param('productId') productId: string,
        @Param('localId') localId: string
    ): Promise<any> {
        let newProduct: Product;

        newProduct = await this.productService.inactiveProduct(localId,productId);

        return {
            statusCode: HttpStatus.CREATED,
            message: 'Product inactivated successfully',
        };
    }

    @Post('/category')
    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.CREATED)
    async createCategory(
        @Body() category: CategoryDto,
        @GetUser() user: User 
    ): Promise<any> {

        await this.productService.createCategory(user,category);

        return {
            statusCode: HttpStatus.CREATED,
            message: 'Category created successfully',
        };
    }

    @Put('/category/:id')
    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.CREATED)
    async updtateCategory(
        @Body() category: CategoryDto,
        @Param('id') categoryId: string,
        @GetUser() user: User
    ): Promise<any> {
        let newCategory: Category;

        newCategory = await this.productService.updateCategory(user,category,categoryId);

        return {
            statusCode: HttpStatus.CREATED,
            message: 'Category updated successfully',
        };
    }

    @Get('/category')
    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.OK)
    async getCategories(): Promise<any> {
        let categories: Category[];

        categories = await this.productService.getCategories();

        return {
            statusCode: HttpStatus.OK,
            categories
        };
    }

    @Get('/summaryByPrice/:id')
    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.OK)
    async getSummaryByPrice(
        @Param('id') localId: string
    ): Promise<any> {
        let summary: any;

        summary = await this.productService.getProductsSummaryByPrice(localId);

        return {
            statusCode: HttpStatus.OK,
            summary
        };
    }

}