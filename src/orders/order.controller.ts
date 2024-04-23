import { Controller, Get, Post, UseGuards, HttpStatus, HttpCode, Put, Param, Body } from '@nestjs/common';
import { JwtAuthGuard } from '../authorization/guards';
import { GetUser } from '../authorization/decorators';
import { OrderService } from "./order.service";
import { CreateorderDto } from "./dtos";
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
        @Body() dto: CreateorderDto
    ): Promise<any> {
        await this.orderService.createorder(dto, user);
        return {
            statusCode: HttpStatus.CREATED,
            message: 'Order created'
        };
    }

}