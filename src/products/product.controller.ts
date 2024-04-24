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
    
    @Get('/:id')
    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.OK)
    async getProducts(
        @Param('id') id: string
    ): Promise<any> {
        let products: Product[];

        products = await this.productService.getProducts(id);

        return {
            statusCode: HttpStatus.OK,
            products
        };
    }

    @Post('/:id')
    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.CREATED)
    async createProduct(
        @Param('id') id: string,
        @Body() product: CreateProductDto
    ): Promise<any> {
        let newProduct: Product;

        newProduct = await this.productService.createProduct(id, product);

        return {
            statusCode: HttpStatus.CREATED,
            message: 'Product created successfully',
        };
    }

    @Put('/:id')
    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.CREATED)
    async updateProduct(
        @Param('id') id: string,
        @Body() product: UpdateProductDto
    ): Promise<any> {
        let newProduct: Product;

        newProduct = await this.productService.updateProduct(id, product);

        return {
            statusCode: HttpStatus.CREATED,
            message: 'Product updated successfully',
        };
    }

    @Post('/category')
    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.CREATED)
    async createCategory(
        @Body() category: CategoryDto,
        @GetUser() user: User
    ): Promise<any> {
        let newCategory: Category;

        newCategory = await this.productService.createCategory(user,category);

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
        @Param('id') id: string,
        @GetUser() user: User
    ): Promise<any> {
        let newCategory: Category;

        newCategory = await this.productService.updateCategory(user,category,id);

        return {
            statusCode: HttpStatus.CREATED,
            message: 'Category updated successfully',
        };
    }

    @Get('/summaryByPrice/:id')
    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.OK)
    async getSummaryByPrice(
        @Param('id') id: string
    ): Promise<any> {
        let summary: any;

        summary = await this.productService.getProductsSummaryByPrice(id);

        return {
            statusCode: HttpStatus.OK,
            summary
        };
    }

}