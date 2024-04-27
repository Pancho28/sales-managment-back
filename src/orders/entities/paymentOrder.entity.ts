import { 
    Entity, 
    Column, 
    PrimaryGeneratedColumn,
    ManyToOne,
    JoinColumn,
    OneToMany
} from 'typeorm';
import { PaymentType, Order } from "./";
  
  
@Entity()
export class PaymentOrder {
  
    @PrimaryGeneratedColumn("uuid")
    id: string;
  
    @Column({ type: 'decimal', precision: 10, scale: 2 })
    amount: number;

    @ManyToOne(type => PaymentType, paymentType => paymentType.id , {onDelete: 'CASCADE'})
    @JoinColumn()
    paymentType: PaymentType;

    @ManyToOne(type => Order, order => order.id , {onDelete: 'CASCADE'})
    order: Order;
    
}
  