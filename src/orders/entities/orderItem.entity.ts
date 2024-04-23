import { 
    Entity, 
    Column, 
    PrimaryGeneratedColumn,
    ManyToOne,
    JoinColumn
} from 'typeorm';
import { Order } from "./";
import { Product } from "../../products/entities";
  
  
@Entity()
export class OrderItem {
  
    @PrimaryGeneratedColumn("uuid")
    id: string;
  
    @Column({ type: 'int' })
    quantity: number;
  
    @Column({ type: 'decimal', precision: 10, scale: 2 })
    price: number;

    @ManyToOne(type => Order, order => order.id , {onDelete: 'CASCADE'})
    @JoinColumn()
    order: Order;

    @ManyToOne(type => Product, product => product.id , {onDelete: 'CASCADE'})
    @JoinColumn()
    product: Product;
    
}
  