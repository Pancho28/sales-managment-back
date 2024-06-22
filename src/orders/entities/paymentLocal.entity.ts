import { 
    Entity,
    PrimaryGeneratedColumn,
    ManyToOne,
    JoinColumn
} from 'typeorm';
import { PaymentType } from "./";
import { Local } from "../../users/entities";
  
  
@Entity()
export class PaymentLocal {
  
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @ManyToOne(type => PaymentType, paymentType => paymentType.id , {onDelete: 'CASCADE'})
    @JoinColumn()
    paymentType: PaymentType;

    @ManyToOne(type => Local, local => local.id , {onDelete: 'CASCADE'})
    @JoinColumn()
    local: Local;
    
}
  