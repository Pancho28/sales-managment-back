import { Injectable, Logger, NotFoundException, BadRequestException } from '@nestjs/common';
import { Order, PaymentType } from "./entities";
import { Local, User } from "../users/entities";
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateorderDto } from "./dtos";

@Injectable()
export class OrderService {

    logger : Logger;

    constructor(
        @InjectRepository(Order)
        private orderRepository: Repository<Order>,
        @InjectRepository(PaymentType)
        private paymentTypeRepository: Repository<PaymentType>,
        @InjectRepository(Local)
        private localRepository: Repository<Local>,
    )
    {
        this.logger = new Logger(OrderService.name);
    }

    async createorder(data: CreateorderDto, user: User) : Promise<void> {
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
        
    }

}