import { Injectable, Logger, NotFoundException, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { Order, OrderItem, PaymentType, PaymentOrder } from "./entities";
import { Local, User } from "../users/entities";
import { ProductService } from "../products/product.service";
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateOrderDto, CreatePaymentTypeDto, UpdatePaymentTypeDto } from "./dtos";

@Injectable()
export class OrderService {

    logger : Logger;

    constructor(
        private readonly productService: ProductService,
        @InjectRepository(Order)
        private orderRepository: Repository<Order>,
        @InjectRepository(OrderItem)
        private orderItemRepository: Repository<OrderItem>,
        @InjectRepository(PaymentType)
        private paymentTypeRepository: Repository<PaymentType>,
        @InjectRepository(PaymentOrder)
        private paymentOrderRepository: Repository<PaymentOrder>,
        @InjectRepository(Local)
        private localRepository: Repository<Local>
    )
    {
        this.logger = new Logger(OrderService.name);
    }

    async getOrders(user : User) : Promise<Order[]> {
        if (user.role != 'ADMIN'){
            this.logger.error(`User with username ${user.username} not have permission to create paymentType`);
            throw new UnauthorizedException('Usuario no tiene permiso');
        }
        const orders = await this.orderRepository.createQueryBuilder('order')
                                                .innerJoinAndSelect('order.orderItem', 'orderItem')
                                                .getMany();
        return orders;
    }

    async getOrdersByLocal(localId: string) : Promise<Order[]> {
        const local = await this.localRepository.createQueryBuilder('local')
                                                .where('local.id = :localId', { localId })
                                                .getOne();
        if (!local){
            this.logger.error(`Local with id ${localId} not found`);
            throw new NotFoundException(`Local con id ${localId} no encontrado`);
        }
        const orders = await this.orderRepository.createQueryBuilder('order')
                                                .where('order.localId = :localId', { localId })
                                                .innerJoinAndSelect('order.orderItem', 'orderItem')
                                                .getMany();
        return orders;
    }

    async getOrderById(id: string) : Promise<Order> {
        const order = await this.orderRepository.createQueryBuilder('order')
                                                .where('order.id = :id', { id })
                                                .innerJoinAndSelect('order.orderItem', 'orderItem')
                                                .getOne();
        if (!order){
            this.logger.error(`Order with id ${id} not found`);
            throw new NotFoundException(`Orden con id ${id} no encontrada`);
        }
        return order;
    }

    async createorder(data: CreateOrderDto, user: User) : Promise<void> {
        const local = await this.localRepository.createQueryBuilder('local')
                                                    .where('local.id = :localId', { localId: data.localId })
                                                    .innerJoinAndSelect('local.user', 'user')
                                                    .getOne();
        if (!local){
            this.logger.error(`Local with id ${data.localId} not found`);
            throw new NotFoundException(`Local con id ${data.localId} no encontrado`);
        }
        if (user.id !== local.user.id && user.role !== 'ADMIN'){
            this.logger.error(`User with id ${user.username} not have permission for local ${local.name}`);
            throw new UnauthorizedException(`Usuario con id ${user.username} no tiene permiso para local ${local.name}`);

        }
        let totalAmount = 0;
        data.payments.forEach(payment => {
            totalAmount += payment.amount;
        });
        if (totalAmount !== data.totalDl){
            this.logger.error(`Total amount ${data.totalDl} not match with total amount of payments ${totalAmount}`);
            throw new BadRequestException(`Monto total ${data.totalDl} no coincide con el monto total de los pagos ${totalAmount}`);
        }
        const newOrder = this.orderRepository.create({
            totalDl: data.totalDl,
            totalBs: data.totalBs,
            local: local
        });
        await this.orderRepository.save(newOrder);
        this.logger.log(`Order with id ${newOrder.id} created for local ${local.name}`);
        const products = await this.productService.getProducts(user);
        for (const item of data.items){
            const product = products.find(p => p.id === item.productId);
            if (!product){
                this.logger.error(`Product with id ${item.productId} not found`);
                throw new NotFoundException(`Producto con id ${item.productId} no encontrado`);
            }
            const newOrderItem = this.orderItemRepository.create({
                quantity: item.quantity,
                price: item.price,
                order: newOrder,
                product
            });
            await this.orderItemRepository.save(newOrderItem);
            this.logger.log(`OrderItem created for product ${product.name} in local ${local.name}`);
        }
        const payments = await this.paymentTypeRepository.find();
        for (const payment of data.payments){
            const paymentType = payments.find(p => p.id === payment.paymentTypeId);
            if (!paymentType){
                this.logger.error(`PaymentType with id ${payment.paymentTypeId} not found`);
                throw new NotFoundException(`Tipo de pago con id ${payment.paymentTypeId} no encontrado`);
            }
            const newPaymentOrder = this.paymentOrderRepository.create({
                amount: payment.amount,
                paymentType,
                order: newOrder
            });
            await this.paymentOrderRepository.save(newPaymentOrder);
            this.logger.log(`PaymentOrder created for paymentType ${paymentType.name} ${paymentType.currency} in local ${local.name}`);
        }
    }

    async getOrdersSummaryByPaymentType(localId: string) {
        const ordersByPaymentType = await this.orderRepository.createQueryBuilder("order")
          .select("SUM(order.totalDl)", "totalDl")
          .addSelect("SUM(order.totalBS)", "totalBS")
          .addSelect("payment_type.name", "name")
          .addSelect("payment_type.currency", "currency")
          .innerJoin("payment_order","payment_order","order.id = payment_order.orderId")
          .innerJoin("payment_type","payment_type","payment_order.paymentTypeId = payment_type.id")
          .where("order.localId = :localId", { localId })
          .groupBy("payment_type.name")
          .addGroupBy("payment_type.currency")
          .getRawMany();
        return ordersByPaymentType;
    }

    async createPaymentType(user: User, data: CreatePaymentTypeDto) : Promise<PaymentType> {
        if (user.role != 'ADMIN'){
            this.logger.error(`User with username ${user.username} not have permission to create paymentType`);
            throw new UnauthorizedException('Usuario no tiene permiso');
        }
        const paymentTypeExist = await this.paymentTypeRepository.findOneBy({ name: data.name, currency: data.currency});
        if (paymentTypeExist){
            this.logger.error(`PaymentType with name ${data.name} already exists`);
            throw new BadRequestException(`Tipo de pago con nombre ${data.name} ya existe`);
        }
        const newPaymentType = this.paymentTypeRepository.create({
            name: data.name,
            currency: data.currency
        });
        await this.paymentTypeRepository.save(newPaymentType);
        this.logger.log(`PaymentType with name ${newPaymentType.name} created`);
        return newPaymentType;
    }

    async updatePaymentType(user: User, id: string, data: UpdatePaymentTypeDto) : Promise<void> {
        if (!data.name && !data.currency){
            this.logger.error(`Name or currency is required to update paymentType`);
            throw new BadRequestException('Nombre o moneda es requerido para actualizar tipo de pago');
        }
        if (user.role != 'ADMIN'){
            this.logger.error(`User with username ${user.username} not have permission to update paymentType`);
            throw new UnauthorizedException('Usuario no tiene permiso');
        }
        const paymentType = await this.paymentTypeRepository.findOneBy({ id });
        if (!paymentType){
            this.logger.error(`PaymentType with id ${id} not found`);
            throw new NotFoundException(`Tipo de pago con id ${id} no encontrado`);
        }
        paymentType.name ? paymentType.name = data.name : null;
        paymentType.currency ? paymentType.currency = data.currency : null;
        await this.paymentTypeRepository.save(paymentType);
        this.logger.log(`PaymentType with id ${paymentType.id} updated`);
    }

    async getPaymentTypes() : Promise<PaymentType[]> {
        const paymentTypes = await this.paymentTypeRepository.find();
        return paymentTypes;
    }

}