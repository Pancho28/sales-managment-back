import { 
    Entity, 
    Column, 
    PrimaryGeneratedColumn,
    ManyToOne,
    JoinColumn
} from 'typeorm';
import { User } from "./user.entity";
import { Access } from "./access.entity";
  
  
@Entity()
export class UserAccess {
  
    @PrimaryGeneratedColumn("uuid")
    id: string;
  
    @ManyToOne(type => User, user => user.id , {onDelete: 'CASCADE'})
    @JoinColumn()
    user: User;
  
    @ManyToOne(type => Access, access => access.id , {onDelete: 'CASCADE'})
    @JoinColumn()
    access: Access;
  
    @Column({type: 'varchar', nullable: true})
    password: string;
  
    @Column({ type: 'datetime', readonly: true})
    creationDate: Date;
    
}
  