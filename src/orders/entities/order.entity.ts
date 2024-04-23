import { 
    Entity, 
    Column, 
    PrimaryGeneratedColumn,
    CreateDateColumn,
    ManyToOne,
    JoinColumn,
    OneToMany
} from 'typeorm';
import { PaymentType, OrderItem } from "./";
import { Local } from "../../users/entities";
  
  
@Entity()
export class Order {
  
    @PrimaryGeneratedColumn("uuid")
    id: string;
  
    @Column({ type: 'decimal', precision: 10, scale: 2 })
    totalDl: number;
  
    @Column({ type: 'decimal', precision: 10, scale: 2 })
    totalBs: number;
  
    @CreateDateColumn({ type: 'timestamp', readonly: true})
    creationDate: Date;

    @ManyToOne(type => Local, local => local.id , {onDelete: 'CASCADE'})
    @JoinColumn()
    local: Local;

    @ManyToOne(type => PaymentType, paymentType => paymentType.id , {onDelete: 'CASCADE'})
    @JoinColumn()
    paymentType: PaymentType;

    @OneToMany(() => OrderItem, orderItem => orderItem.order)
    orderItem: OrderItem;
    
}
  