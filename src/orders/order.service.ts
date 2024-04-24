import { Injectable, Logger, NotFoundException, BadRequestException } from '@nestjs/common';
import { Order, OrderItem, PaymentType } from "./entities";
import { Local, User } from "../users/entities";
import { ProductService } from "../products/product.service";
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateOrderDto, CreatePaymentTypeDto } from "./dtos";

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
        @InjectRepository(Local)
        private localRepository: Repository<Local>
    )
    {
        this.logger = new Logger(OrderService.name);
    }

    async createorder(data: CreateOrderDto, user: User) : Promise<void> {
        const paymentType = await this.paymentTypeRepository.findOneBy({ id: data.paymentTypeId });
        if (!paymentType){
            this.logger.error(`PaymentType with id ${data.paymentTypeId} not found`);
            throw new NotFoundException(`PaymentType con id ${data.paymentTypeId} no encontrado`);
        }
        const local = await this.localRepository.createQueryBuilder('local')
                                                    .where('local.id = :localId', { localId: data.localId })
                                                    .innerJoinAndSelect('local.user', 'user')
                                                    .getOne();
        if (!local){
            this.logger.error(`Local with id ${data.localId} not found`);
            throw new NotFoundException(`Local con id ${data.localId} no encontrado`);
        }
        if (user.id !== local.user.id && user.role !== 'ADMIN'){
            this.logger.error(`User with id ${user.id} not have permission for local ${local.name}`);
            throw new BadRequestException(`Usuario con id ${user.id} no tiene permiso para local ${local.name}`);

        }
        const newOrder = this.orderRepository.create({
            totalDl: data.totalDl,
            totalBs: data.totalBs,
            paymentType: paymentType,
            local: local
        });
        await this.orderRepository.save(newOrder);
        this.logger.log(`Order with id ${newOrder.id} created for local ${local.name}`);
        const products = await this.productService.getProducts(data.localId);
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
    }

    async getOrdersSummaryByPaymentType(localId: string) {
        const ordersByPaymentType = await this.orderRepository.createQueryBuilder("order")
          .select("SUM(order.totalDl) AS totalDl", "totalDl")
          .addSelect("SUM(order.totalBS) AS totalBS", "totalBS")
          .addSelect("payment_type.name", "name")
          .addSelect("payment_type.currency", "currency")
          .innerJoin("payment_type", "order.paymentTypeId = payment_type.id")
          .where("order.localId = :localId", { localId })
          .groupBy("payment_type.name")
          .addGroupBy("payment_type.currency")
          .getRawMany();
      
        return ordersByPaymentType;
    }

    async createPaymentType(user: User, data: CreatePaymentTypeDto) : Promise<PaymentType> {
        if (user.role != 'ADMIN'){
            this.logger.error(`User with username ${user.username} not have permission to create paymentType`);
            throw new BadRequestException('Usuario no tiene permiso');
        }
        const paymentTypeExist = await this.paymentTypeRepository.findOneBy({ name: data.name });
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

}