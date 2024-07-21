import { Controller, Get, Post, UseGuards, HttpStatus, HttpCode, Put, Param, Body } from '@nestjs/common';
import { JwtAuthGuard } from '../authorization/guards';
import { GetUser } from '../authorization/decorators';
import { ProductService } from "./product.service";
import { User } from "../users/entities";
import { Product, Category } from "./entities";
import { CreateProductDto, CategoryDto, UpdateProductDto } from "./dtos";
import { DateDto } from "../helpers/date.dto";

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
    
    @Get('byCategory')
    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.OK)
    async getCategoryProducts(
        @GetUser() user: User 
    ): Promise<any> {
        let products: Category[];

        products = await this.productService.getCategoryProducts(user);

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
            message: 'Producto creado exitosamente',
            productId: newProduct.id
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
            message: 'Producto actualizado exitosamente',
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
            message: 'Producto activado exitosamente',
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
            message: 'Producto desactivado exitosamente',
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
            message: 'Categoria creada exitosamente',
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
            message: 'Categoria actualizada exitosamente',
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

    @Post('/summaryByPrice/:id')
    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.OK)
    async getSummaryByPrice(
        @Param('id') localId: string,
        @Body() dto: DateDto
    ): Promise<any> {
        let summary: any;

        summary = await this.productService.getProductsSummaryByPrice(localId, dto.date);

        return {
            statusCode: HttpStatus.OK,
            summary
        };
    }

}