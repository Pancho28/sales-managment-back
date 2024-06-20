import { 
    Entity, 
    Column, 
    PrimaryGeneratedColumn,
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
  
    @Column({ type: 'datetime', readonly: true})
    creationDate: Date;

    @Column({ type: 'datetime', nullable: true, default: null})
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
  