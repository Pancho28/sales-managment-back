import { 
    Entity, 
    Column, 
    PrimaryGeneratedColumn,
    CreateDateColumn,
    OneToMany,
    ManyToOne,
    JoinColumn
} from 'typeorm';
import { Category } from "./";
import { Local } from "../../users/entities";
import { OrderItem } from "../../orders/entities";
  
  
@Entity()
export class Product {
  
    @PrimaryGeneratedColumn("uuid")
    id: string;
  
    @Column({type: 'varchar'})
    name: string;

    @Column({ type: 'varchar', default: 'ACTIVE'})
    status: string;    
  
    @Column({ type: 'decimal', precision: 10, scale: 2 })
    price: number;
  
    @CreateDateColumn({ type: 'datetime', readonly: true})
    creationDate: Date;

    @CreateDateColumn({ type: 'datetime', nullable: true})
    updateDate: Date;

    @OneToMany(() => OrderItem, orderItem => orderItem.product)
    orderItem: OrderItem;

    @ManyToOne(type => Local, local => local.id , {onDelete: 'CASCADE'})
    @JoinColumn()
    local: Local;

    @ManyToOne(type => Category, category => category.id , {onDelete: 'CASCADE'})
    @JoinColumn()
    category: Category;

}
  