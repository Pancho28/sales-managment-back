import { 
    Entity, 
    Column, 
    PrimaryGeneratedColumn,
    OneToMany
} from 'typeorm';
import { Order } from "./";
  
  
@Entity()
export class PaymentType {
  
    @PrimaryGeneratedColumn("uuid")
    id: string;
  
    @Column({type: 'varchar'})
    name: string;
  
    @Column({type: 'varchar'})
    currency: string;

    @OneToMany(() => Order, order => order.paymentType)
    order: Order;
    
}
  