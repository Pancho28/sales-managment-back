import { 
    Entity, 
    Column, 
    PrimaryGeneratedColumn,
    CreateDateColumn,
    OneToMany,
    ManyToOne,
    JoinColumn
} from 'typeorm';
import { OrderItem, Local, Category } from "./";
  
  
@Entity()
export class Product {
  
    @PrimaryGeneratedColumn("uuid")
    productId: string;
  
    @Column({type: 'varchar'})
    name: string;

    @Column({ type: 'varchar', default: 'ACTIVE'})
    status: string;    
  
    @Column({ type: 'int' })
    price: number;
  
    @CreateDateColumn({ type: 'datetime', readonly: true})
    creationDate: Date;

    @CreateDateColumn({ type: 'datetime'})
    updateDate: Date;

    @OneToMany(() => OrderItem, orderItem => orderItem.product)
    orderItem: OrderItem;

    @ManyToOne(type => Local, local => local.localId , {onDelete: 'CASCADE'})
    @JoinColumn()
    local: Local;

    @ManyToOne(type => Category, category => category.categoryId , {onDelete: 'CASCADE'})
    @JoinColumn()
    category: Category;

}
  