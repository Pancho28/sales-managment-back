import { 
    Entity, 
    Column, 
    PrimaryGeneratedColumn,
    ManyToOne,
    JoinColumn
} from 'typeorm';
import { PaymentOrder } from "./";
  
  
@Entity()
export class CustomerInformation {
  
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({type: 'varchar'})
    name: string;

    @Column({type: 'varchar', nullable: true})
    lastName: string;

    @Column({ type: 'timestamp', nullable: true, default: null})
    paymentDate: Date;

    @ManyToOne(type => PaymentOrder, paymentOrder => paymentOrder.id , {onDelete: 'CASCADE'})
    @JoinColumn()
    paymentOrder: PaymentOrder;

}
  