import { 
    Entity, 
    Column, 
    PrimaryGeneratedColumn,
    ManyToOne,
    JoinColumn
} from 'typeorm';
import { PaymentLocal, Orders } from "./";
  
  
@Entity()
export class PaymentOrder {
  
    @PrimaryGeneratedColumn("uuid")
    id: string;
  
    @Column({ type: 'decimal', precision: 10, scale: 2 })
    amount: number;

    @ManyToOne(type => PaymentLocal, payment => payment.id , {onDelete: 'CASCADE'})
    @JoinColumn()
    payment: PaymentLocal;

    @ManyToOne(type => Orders, order => order.id , {onDelete: 'CASCADE'})
    order: Orders;
    
}
  