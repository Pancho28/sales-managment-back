import { 
    Entity, 
    Column, 
    PrimaryGeneratedColumn,
    ManyToOne,
    JoinColumn
} from 'typeorm';
import { Order, Product } from "./";
  
  
@Entity()
export class OrderItem {
  
    @PrimaryGeneratedColumn("uuid")
    orderItemId: string;
  
    @Column({ type: 'int' })
    quantity: number;
  
    @Column({ type: 'decimal', precision: 10, scale: 2 })
    price: number;

    @ManyToOne(type => Order, order => order.orderId , {onDelete: 'CASCADE'})
    @JoinColumn()
    order: Order;

    @ManyToOne(type => Product, product => product.productId , {onDelete: 'CASCADE'})
    @JoinColumn()
    product: Product;
    
}
  