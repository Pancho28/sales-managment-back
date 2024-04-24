import { Controller, Get, Post, UseGuards, HttpStatus, HttpCode, Put, Param, Body } from '@nestjs/common';
import { JwtAuthGuard } from '../authorization/guards';
import { GetUser } from '../authorization/decorators';
import { OrderService } from "./order.service";
import { CreateOrderDto, CreatePaymentTypeDto } from "./dtos";
import { User } from "../users/entities";

@Controller('orders')
export class OrderController {

    constructor(
        private readonly orderService: OrderService,
    ) {}
    
    @Post()
    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.CREATED)
    async createOrder(
        @GetUser() user: User,
        @Body() dto: CreateOrderDto
    ): Promise<any> {
        await this.orderService.createorder(dto, user);
        return {
            statusCode: HttpStatus.CREATED,
            message: 'Order created'
        };
    }

    @Get('/summaryPaymentType/:id')
    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.OK)
    async getOrdersSummaryByPaymentType(
        @Param('id') id: string
    ) : Promise<any> {
        const summary = await this.orderService.getOrdersSummaryByPaymentType(id);
        return {
            statusCode: HttpStatus.OK,
            summary
        };
    }

    @Post('/paymentType')
    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.CREATED)
    async createPaymentType(
        @GetUser() user: User,
        @Body() dto: CreatePaymentTypeDto
    ): Promise<any> {
        await this.orderService.createPaymentType(user,dto);
        return {
            statusCode: HttpStatus.CREATED,
            message: 'PaymentType created'
        };
    }

}