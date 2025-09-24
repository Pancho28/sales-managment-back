import { 
    Entity, 
    Column, 
    PrimaryGeneratedColumn,
    ManyToOne,
    OneToMany,
    JoinColumn
} from 'typeorm';
import { PaymentLocal, Orders, CustomerInformation } from "./";
  
  
@Entity()
export class PaymentOrder {
  
    @PrimaryGeneratedColumn("uuid")
    id: string;
  
    @Column({ type: 'decimal', precision: 10, scale: 2 })
    amount: number;

    @Column({ type: 'boolean', default: true })
    isPaid: boolean;

    @ManyToOne(type => PaymentLocal, payment => payment.id , {onDelete: 'CASCADE'})
    @JoinColumn()
    payment: PaymentLocal;

    @ManyToOne(type => Orders, order => order.id , {onDelete: 'CASCADE'})
    order: Orders;

    @OneToMany(() => CustomerInformation, customerInformation => customerInformation.paymentOrder)
    customerInformation: CustomerInformation;
    
}
  