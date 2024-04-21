import { 
    Entity, 
    Column, 
    PrimaryGeneratedColumn,
    CreateDateColumn,
    ManyToOne,
    JoinColumn,
    OneToMany
} from 'typeorm';
import { Local, PaymentType, OrderItem } from "./";
  
  
@Entity()
export class Order {
  
    @PrimaryGeneratedColumn("uuid")
    orderId: string;
  
    @Column({ type: 'decimal', precision: 10, scale: 2 })
    totalDl: number;
  
    @Column({ type: 'decimal', precision: 10, scale: 2 })
    totalBs: number;
  
    @CreateDateColumn({ type: 'timestamp', readonly: true})
    creationDate: Date;

    @ManyToOne(type => Local, local => local.localId , {onDelete: 'CASCADE'})
    @JoinColumn()
    local: Local;

    @ManyToOne(type => PaymentType, paymentType => paymentType.paymentTypeId , {onDelete: 'CASCADE'})
    @JoinColumn()
    paymentType: PaymentType;

    @OneToMany(() => OrderItem, orderItem => orderItem.order)
    orderItem: OrderItem;
    
}
  