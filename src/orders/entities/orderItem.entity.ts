import { 
    Entity, 
    Column, 
    PrimaryGeneratedColumn,
    ManyToOne,
    JoinColumn
} from 'typeorm';
import { Orders } from "./";
import { Product } from "../../products/entities";
  
  
@Entity()
export class OrderItem {
  
    @PrimaryGeneratedColumn("uuid")
    id: string;
  
    @Column({ type: 'int' })
    quantity: number;
  
    @Column({ type: 'decimal', precision: 10, scale: 2 })
    price: number;

    @ManyToOne(type => Orders, order => order.id , {onDelete: 'CASCADE'})
    @JoinColumn()
    order: Orders;

    @ManyToOne(type => Product, product => product.id , {onDelete: 'CASCADE'})
    @JoinColumn()
    product: Product;
    
}
  