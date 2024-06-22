import { Controller, Get, Post, UseGuards, HttpStatus, HttpCode, Put, Param, Body } from '@nestjs/common';
import { JwtAuthGuard } from '../authorization/guards';
import { GetUser } from '../authorization/decorators';
import { OrderService } from "./order.service";
import { CreateOrderDto, CreatePaymentTypeDto, UpdatePaymentTypeDto } from "./dtos";
import { DateDto } from "../helpers/date.dto";
import { User } from "../users/entities";
import { Order } from "./entities";

@Controller('orders')
export class OrderController {

    constructor(
        private readonly orderService: OrderService,
    ) {}

    @Get()
    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.OK)
    async getOrders(
        @GetUser() user: User
    ) : Promise<any> {
        let orders : Order[];
        orders = await this.orderService.getOrders(user);
        return {
            statusCode: HttpStatus.OK,
            orders
        };
    }

    @Get("/ordersByLocal/:id")
    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.OK)
    async getOrdersByLocal(
        @Param('id') localId: string
    ) : Promise<any> {
        let orders : Order[];
        orders = await this.orderService.getOrdersByLocal(localId);
        return {
            statusCode: HttpStatus.OK,
            orders
        };
    }

    @Get(":id")
    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.OK)
    async getOrderById(
        @Param('id') orderId: string
    ) : Promise<any> {
        let order : Order;
        order = await this.orderService.getOrderById(orderId);
        return {
            statusCode: HttpStatus.OK,
            order
        };
    }
    
    @Post()
    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.CREATED)
    async createOrder(
        @GetUser() user: User,
        @Body() dto: CreateOrderDto
    ): Promise<any> {
        const newOrder = await this.orderService.createorder(dto, user);
        return {
            statusCode: HttpStatus.CREATED,
            message: 'Orden creada',
            order: newOrder
        };
    }

    @Post('/summaryPaymentType/:id')
    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.OK)
    async getOrdersSummaryByPaymentType(
        @Param('id') localId: string,
        @Body() dto: DateDto
    ) : Promise<any> {
        const summary = await this.orderService.getOrdersSummaryByPaymentType(localId, dto.date);
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
            message: 'Tipo de pago creado'
        };
    }

    @Put('/paymentType/:id')
    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.CREATED)
    async updatePaymentType(
        @GetUser() user: User,
        @Param('id') paymentTypeId: string,
        @Body() dto: UpdatePaymentTypeDto
    ): Promise<any> {
        await this.orderService.updatePaymentType(user, paymentTypeId, dto);
        return {
            statusCode: HttpStatus.CREATED,
            message: 'Tipo de pago actualizado'
        };
    }

    @Get('/paymentType/all')
    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.OK)
    async getPaymentTypes(
        @GetUser() user: User
    ): Promise<any> {
        const paymentTypes = await this.orderService.getPaymentTypes(user);
        return {
            statusCode: HttpStatus.OK,
            paymentTypes
        };
    }

    @Get('/notdelivered/all')
    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.OK)
    async getNotDeliveredOrders(
        @GetUser() user: User
    ): Promise<any> {
        const orders = await this.orderService.getOrdersNotDelivered(user);
        return {
            statusCode: HttpStatus.OK,
            orders
        };
    }

    @Post('/notdelivered/:id')
    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.CREATED)
    async orderDelivered(
        @GetUser() user: User,
        @Param('id') orderId: string,
        @Body() dto: DateDto
    ): Promise<any> {
        await this.orderService.orderDelivered(user,orderId,dto);
        return {
            statusCode: HttpStatus.CREATED,
            message: 'Orden entregada'
        };
    }

}