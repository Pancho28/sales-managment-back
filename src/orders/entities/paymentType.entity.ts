import { 
    Entity, 
    Column, 
    PrimaryGeneratedColumn,
    OneToMany
} from 'typeorm';
import { PaymentLocal } from "./";
  
  
@Entity()
export class PaymentType {
  
    @PrimaryGeneratedColumn("uuid")
    id: string;
  
    @Column({type: 'varchar'})
    name: string;
  
    @Column({type: 'varchar'})
    currency: string;

    @OneToMany(() => PaymentLocal, payment => payment.paymentType)
    payment: PaymentLocal;
    
}
  