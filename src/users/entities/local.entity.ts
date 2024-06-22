import { 
    Entity, 
    Column, 
    PrimaryGeneratedColumn,
    ManyToOne,
    JoinColumn,
    OneToMany
} from 'typeorm';
import { User } from '.';
import { Orders } from "../../orders/entities";
import { Product } from "../../products/entities";
  
  
@Entity()
export class Local {
  
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({type: 'varchar'})
    name: string;
  
    @Column({ type: 'decimal', precision: 10, scale: 2 })
    dolar: number;

    @ManyToOne(type => User, user => user.id , {onDelete: 'CASCADE'})
    @JoinColumn()
    user: User;

    @OneToMany(() => Orders, order => order.local)
    order: Orders;

    @OneToMany(() => Product, product => product.local)
    product: Product;
    
}
  