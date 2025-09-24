import { 
    Entity, 
    Column, 
    PrimaryGeneratedColumn,
    ManyToOne,
    JoinColumn,
    OneToMany
} from 'typeorm';
import { OrderItem, PaymentOrder } from "./";
import { Local } from "../../users/entities";
  
  
@Entity()
export class Orders {
  
    @PrimaryGeneratedColumn("uuid")
    id: string;
  
    @Column({ type: 'decimal', precision: 10, scale: 2 })
    totalDl: number;
  
    @Column({ type: 'decimal', precision: 10, scale: 2 })
    totalBs: number;
  
    @Column({ type: 'timestamp', readonly: true})
    creationDate: Date;

    @Column({ type: 'timestamp', nullable: true, default: null})
    deliveredDate: Date; 

    @ManyToOne(type => Local, local => local.id , {onDelete: 'CASCADE'})
    @JoinColumn()
    local: Local;

    @OneToMany(() => OrderItem, orderItem => orderItem.order)
    orderItem: OrderItem;

    @OneToMany(() => PaymentOrder, paymentOrder => paymentOrder.order)
    paymentOrder: PaymentOrder;
    
}
  