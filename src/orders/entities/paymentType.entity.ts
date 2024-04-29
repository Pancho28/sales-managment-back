import { 
    Entity, 
    Column, 
    PrimaryGeneratedColumn,
    OneToMany
} from 'typeorm';
import { Order, PaymentOrder } from "./";
  
  
@Entity()
export class PaymentType {
  
    @PrimaryGeneratedColumn("uuid")
    id: string;
  
    @Column({type: 'varchar'})
    name: string;
  
    @Column({type: 'varchar'})
    currency: string;

    @OneToMany(() => PaymentOrder, paymentOrder => paymentOrder.paymentType)
    paymentOrder: PaymentOrder;
    
}
  