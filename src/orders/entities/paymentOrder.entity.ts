import { 
    Entity, 
    Column, 
    PrimaryGeneratedColumn,
    ManyToOne,
    JoinColumn
} from 'typeorm';
import { PaymentLocal, Order } from "./";
  
  
@Entity()
export class PaymentOrder {
  
    @PrimaryGeneratedColumn("uuid")
    id: string;
  
    @Column({ type: 'decimal', precision: 10, scale: 2 })
    amount: number;

    @ManyToOne(type => PaymentLocal, payment => payment.id , {onDelete: 'CASCADE'})
    @JoinColumn()
    payment: PaymentLocal;

    @ManyToOne(type => Order, order => order.id , {onDelete: 'CASCADE'})
    order: Order;
    
}
  