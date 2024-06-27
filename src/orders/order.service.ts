import { Injectable, Logger, NotFoundException, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { Orders, OrderItem, PaymentType, PaymentOrder, PaymentLocal } from "./entities";
import { Local, User } from "../users/entities";
import { ProductService } from "../products/product.service";
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateOrderDto, CreatePaymentTypeDto, UpdatePaymentTypeDto } from "./dtos";
import { DateDto } from "../helpers/date.dto";
import { Roles } from "../helpers/enum";

@Injectable()
export class OrderService {

    logger : Logger;

    constructor(
        private readonly productService: ProductService,
        @InjectRepository(Orders)
        private orderRepository: Repository<Orders>,
        @InjectRepository(OrderItem)
        private orderItemRepository: Repository<OrderItem>,
        @InjectRepository(PaymentType)
        private paymentTypeRepository: Repository<PaymentType>,
        @InjectRepository(PaymentLocal)
        private paymentRepository: Repository<PaymentLocal>,
        @InjectRepository(PaymentOrder)
        private paymentOrderRepository: Repository<PaymentOrder>,
        @InjectRepository(Local)
        private localRepository: Repository<Local>
    )
    {
        this.logger = new Logger(OrderService.name);
    }

    async getOrders(user : User) : Promise<Orders[]> {  
        let orders:any;
        if (user.role = Roles.ADMIN){
            orders = await this.orderRepository.createQueryBuilder('orders')
                                                    .innerJoinAndSelect('orders.orderItem', 'orderItem')
                                                    .innerJoinAndSelect('orderItem.product','product')
                                                    .orderBy('orders.creationDate','DESC')
                                                    .getMany();
        }else {
            throw new UnauthorizedException(`Usuario ${user.username} no tiene permiso`);
        }
        return orders;
    }

    async getOrdersByLocal(localId: string) : Promise<Orders[]> {
        const local = await this.localRepository.createQueryBuilder('local')
                                                .where('local.id = :localId', { localId })
                                                .getOne();
        if (!local){
            throw new NotFoundException(`Local con id ${localId} no encontrado`);
        }
        const orders = await this.orderRepository.createQueryBuilder('orders')
                                                .where('orders.localId = :localId', { localId })
                                                .innerJoinAndSelect('orders.orderItem', 'orderItem')
                                                .innerJoinAndSelect('orderItem.product','product')
                                                .orderBy('orders.creationDate','DESC')
                                                .getMany();
        return orders;
    }

    async getOrderById(id: string) : Promise<Orders> {
        const order = await this.orderRepository.createQueryBuilder('orders')
                                                .where('orders.id = :id', { id })
                                                .innerJoinAndSelect('orders.orderItem', 'orderItem')
                                                .innerJoinAndSelect('orderItem.product','product')
                                                .getOne();
        if (!order){
            throw new NotFoundException(`Orden con id ${id} no encontrada`);
        }
        return order;
    }

    async createorder(data: CreateOrderDto, user: User) : Promise<Orders> {
        const local = await this.localRepository.createQueryBuilder('local')
                                                    .where('local.id = :localId', { localId: data.localId })
                                                    .innerJoinAndSelect('local.user', 'user')
                                                    .getOne();
        if (!local){
            throw new NotFoundException(`Local con id ${data.localId} no encontrado`);
        }
        if (user.id !== local.user.id && user.role !== Roles.ADMIN){
            throw new UnauthorizedException(`Usuario con id ${user.username} no tiene permiso para local ${local.name}`);

        }
        let totalAmount = 0;
        data.payments.forEach(payment => {
            totalAmount += payment.amount;
        });
        if (totalAmount !== data.totalDl){
            throw new BadRequestException(`Monto total ${data.totalDl} no coincide con el monto total de los pagos ${totalAmount}`);
        }
        const newOrder = this.orderRepository.create({
            creationDate: data.creationDate,
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
        const payments = await this.paymentRepository.createQueryBuilder('payment')
                                                    .innerJoinAndSelect('payment.paymentType', 'paymentType')
                                                    .where('payment.localId = :localId', { localId: local.id })
                                                    .getMany();
        for (const payment of data.payments){
            const paymentType = payments.find(p => p.paymentType.id === payment.paymentTypeId);
            if (!paymentType){
                throw new NotFoundException(`Tipo de pago con id ${payment.paymentTypeId} no encontrado`);
            }
            const newPaymentOrder = this.paymentOrderRepository.create({
                amount: payment.amount,
                payment: paymentType,
                order: newOrder
            });
            await this.paymentOrderRepository.save(newPaymentOrder);
            this.logger.log(`PaymentOrder created for paymentType ${paymentType.paymentType.name} ${paymentType.paymentType.currency} in local ${local.name}`);
        }
        // se trae la orden completa para poder colocarla como orden sin entrega
        const order = await this.orderRepository.createQueryBuilder('orders')
                                                .where('orders.id = :id', { id: newOrder.id })
                                                .innerJoinAndSelect('orders.orderItem', 'orderItem')
                                                .innerJoinAndSelect('orderItem.product','product')
                                                .getOne(); 
        return order;
    }

    async getOrdersSummaryByPaymentType(localId: string, date: Date) {
        const hours = date.getHours();
        let ordersByPaymentType : any;
        if (hours >= 0 && hours <= 6){
            ordersByPaymentType = await this.orderRepository.createQueryBuilder("orders")
                                        .select("SUM(payment_order.amount)", "total")
                                        .addSelect("payment_type.name", "name")
                                        .addSelect("payment_type.currency", "currency")
                                        .innerJoin("payment_order","payment_order","orders.id = payment_order.orderId")
                                        .innerJoin("payment_local","payment","payment_order.paymentId = payment.id")
                                        .innerJoin("payment_type","payment_type","payment.paymentTypeId = payment_type.id")
                                        .where("orders.localId = :localId", { localId })
                                        .andWhere("orders.creationdate >= CONCAT(DATE_ADD(CURDATE(), INTERVAL -1 DAY), ' 11:00:00')")
                                        .groupBy("payment_type.name")
                                        .addGroupBy("payment_type.currency")
                                        .getRawMany();
        }
        else {
            ordersByPaymentType = await this.orderRepository.createQueryBuilder("orders")
                                        .select("SUM(payment_order.amount)", "total")
                                        .addSelect("payment_type.name", "name")
                                        .addSelect("payment_type.currency", "currency")
                                        .innerJoin("payment_order","payment_order","orders.id = payment_order.orderId")
                                        .innerJoin("payment_local","payment","payment_order.paymentId = payment.id")
                                        .innerJoin("payment_type","payment_type","payment.paymentTypeId = payment_type.id")
                                        .where("orders.localId = :localId", { localId })
                                        .andWhere("orders.creationdate >= CONCAT(CURDATE(), ' 11:00:00')")
                                        .groupBy("payment_type.name")
                                        .addGroupBy("payment_type.currency")
                                        .getRawMany();
        }
        return ordersByPaymentType;
    }

    async createPaymentType(user: User, data: CreatePaymentTypeDto) : Promise<PaymentType> {
        if (user.role != Roles.ADMIN){
            throw new UnauthorizedException(`Usuario ${user.username} no tiene permiso`);
        }
        const paymentTypeExist = await this.paymentTypeRepository.findOneBy({ name: data.name, currency: data.currency});
        if (paymentTypeExist){
            throw new BadRequestException(`Tipo de pago con nombre ${data.name} ya existe`);
        }
        const local = await this.localRepository.findOneBy({ id: data.localId });
        if (!local){
            throw new NotFoundException(`Local con id ${data.localId} no encontrado`);
        }
        const newPaymentType = this.paymentTypeRepository.create({
            name: data.name,
            currency: data.currency
        });
        await this.paymentTypeRepository.save(newPaymentType);
        const newPayment = this.paymentRepository.create({
            paymentType: newPaymentType,
            local
        });
        await this.paymentRepository.save(newPayment);
        this.logger.log(`PaymentType with name ${newPaymentType.name} created`);
        return newPaymentType;
    }

    async updatePaymentType(user: User, id: string, data: UpdatePaymentTypeDto) : Promise<void> {
        if (!data.name && !data.currency){
            throw new BadRequestException('Nombre o moneda es requerido para actualizar tipo de pago');
        }
        if (user.role != Roles.ADMIN){
            throw new UnauthorizedException(`Usuario ${user.username} no tiene permiso`);
        }
        const paymentType = await this.paymentTypeRepository.findOneBy({ id });
        if (!paymentType){
            throw new NotFoundException(`Tipo de pago con id ${id} no encontrado`);
        }
        paymentType.name ? paymentType.name = data.name : null;
        paymentType.currency ? paymentType.currency = data.currency : null;
        await this.paymentTypeRepository.save(paymentType);
        this.logger.log(`PaymentType with id ${paymentType.id} updated`);
    }

    async getPaymentTypes(user : User) : Promise<PaymentType[]> {
        if (user.role = Roles.ADMIN){
            const paymentTypes = await this.paymentTypeRepository.find();
            return paymentTypes;
        }
        else {
            const local = await this.localRepository.createQueryBuilder('local')
                                                    .where('local.userId = :userId', { userId: user.id })
                                                    .getOne();
            if (!local){
                throw new NotFoundException(`Local para usuario ${user.username} no encontrado`);
            }
            const paymentTypes = await this.paymentTypeRepository.createQueryBuilder('paymentType')
                                                    .innerJoin('paymentType.payment', 'payment')
                                                    .where('payment.localId = :localId', { localId: local.id })
                                                    .getMany();
            return paymentTypes;
        }
    }

    async getOrdersNotDelivered(user: User) : Promise<Orders[]> {
        let orders : any;
        if (user.role === Roles.ADMIN){
            orders = await this.orderRepository.createQueryBuilder('orders')
                                                .where('orders.deliveredDate is null')
                                                .innerJoinAndSelect('orders.orderItem', 'orderItem')
                                                .innerJoinAndSelect('orderItem.product','product')
                                                .orderBy('orders.creationDate','ASC')
                                                .getMany();
        } else if (user.role === Roles.SELLER) {
            const local = await this.localRepository.createQueryBuilder('local')
                                                    .where('local.userId = :userId', { userId: user.id })
                                                    .getOne();  
            if (!local){
                throw new NotFoundException(`Local para usuario ${user.username} no encontrado`);
            }
            orders = await this.orderRepository.createQueryBuilder('orders')
                                                .where('orders.deliveredDate is null')
                                                .andWhere('orders.localId = :localId', { localId: local.id })
                                                .innerJoinAndSelect('orders.orderItem', 'orderItem')
                                                .innerJoinAndSelect('orderItem.product','product')
                                                .orderBy('orders.creationDate','ASC')
                                                .getMany();
        }else {
            throw new UnauthorizedException(`Usuario ${user.username} no tiene permiso`);
        }
        return orders;
    }

    async orderDelivered(user: User, orderId: string, dto : DateDto) : Promise<void> {
        if (user.role != Roles.SELLER && user.role != Roles.ADMIN){
            throw new UnauthorizedException(`Usuario ${user.username} no tiene permiso`);
        }
        const order = await this.orderRepository.createQueryBuilder('orders')
                                                .where('orders.id = :orderId', { orderId })
                                                .innerJoinAndSelect('orders.local', 'local')
                                                .getOne();
        if (!order){
            throw new NotFoundException(`Orden con id ${orderId} no encontrada`);
        }
        if (user.role === Roles.SELLER){
            const local = await this.localRepository.createQueryBuilder('local')
                                                    .innerJoinAndSelect('local.user', 'user')
                                                    .where('local.userId = :userId', { userId: user.id })
                                                    .getOne();
            if (local.user.id !== user.id){
                throw new UnauthorizedException(`Usuario ${user.username} no tiene permiso para marcar orden como entregada`);
            }
        }
        order.deliveredDate = dto.date;
        await this.orderRepository.save(order);
        this.logger.log(`Order with id ${order.id} delivered`);
    }

}