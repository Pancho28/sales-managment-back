import { Controller, Get, Post, UseGuards, HttpStatus, HttpCode, Put, Param, Body } from '@nestjs/common';
import { JwtAuthGuard } from '../authorization/guards';
import { GetUser } from '../authorization/decorators';
import { OrderService } from "./order.service";
import { User } from "../users/entities";
import { Product, Category } from "./entities";
import { CreateProductDto, CategoryDto } from "./dtos";

@Controller('orders')
export class OrderController {

    constructor(
        private readonly orderService: OrderService,
    ) {}
    
    @Get('product/:id')
    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.OK)
    async getProducts(
        @Param('id') id: string
    ): Promise<any> {
        let products: Product[];

        products = await this.orderService.getProducts(id);

        return {
            statusCode: HttpStatus.OK,
            products
        };
    }

    @Post('product/:id')
    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.CREATED)
    async createProduct(
        @Param('id') id: string,
        @Body() product: CreateProductDto
    ): Promise<any> {
        let newProduct: Product;

        newProduct = await this.orderService.createProduct(id, product);

        return {
            statusCode: HttpStatus.CREATED,
            message: 'Product created successfully',
        };
    }

    @Post('category')
    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.CREATED)
    async createCategory(
        @Body() category: CategoryDto,
        @GetUser() user: User
    ): Promise<any> {
        let newCategory: Category;

        newCategory = await this.orderService.createCategory(user,category);

        return {
            statusCode: HttpStatus.CREATED,
            message: 'Category created successfully',
        };
    }

    @Put('category/:id')
    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.CREATED)
    async updtateCategory(
        @Body() category: CategoryDto,
        @Param('id') id: string,
        @GetUser() user: User
    ): Promise<any> {
        let newCategory: Category;

        newCategory = await this.orderService.updateCategory(user,category,id);

        return {
            statusCode: HttpStatus.CREATED,
            message: 'Category updated successfully',
        };
    }

}