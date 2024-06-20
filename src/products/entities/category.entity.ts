import { 
    Entity, 
    Column, 
    PrimaryGeneratedColumn,
    OneToMany
} from 'typeorm';
import { Product } from "./";
  
  
@Entity()
export class Category {
  
    @PrimaryGeneratedColumn("uuid")
    id: string;
  
    @Column({type: 'varchar'})
    name: string;
  
    @Column({ type: 'datetime', readonly: true})
    creationDate: Date;

    @Column({ type: 'datetime', nullable: true, default: null})
    updateDate: Date;

    @OneToMany(() => Product, product => product.category)
    product: Product;
    
}
  