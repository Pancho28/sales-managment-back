import { 
    Entity, 
    Column, 
    PrimaryGeneratedColumn,
    ManyToOne,
    JoinColumn,
    OneToMany
} from 'typeorm';
import { User } from '../../users/entities/';
import { Order, Product } from "./";
  
  
@Entity()
export class Local {
  
    @PrimaryGeneratedColumn("uuid")
    localId: string;

    @Column({type: 'varchar'})
    name: string;
  
    @Column({ type: 'int' })
    dolar: number;

    @ManyToOne(type => User, user => user.userId , {onDelete: 'CASCADE'})
    @JoinColumn()
    user: User;

    @OneToMany(() => Order, order => order.local)
    order: Order;

    @OneToMany(() => Order, product => product.local)
    product: Product;
    
}
  