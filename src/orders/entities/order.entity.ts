import { 
    Entity, 
    Column, 
    PrimaryGeneratedColumn,
    CreateDateColumn,
    ManyToOne,
    JoinColumn,
    OneToMany
} from 'typeorm';
import { OrderItem } from "./";
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

    @Column({ type: 'timestamp', nullable: true, default: null})
    deliveredDate: Date; 

    @ManyToOne(type => Local, local => local.id , {onDelete: 'CASCADE'})
    @JoinColumn()
    local: Local;

    @OneToMany(() => OrderItem, orderItem => orderItem.order)
    orderItem: OrderItem;
    
}
  