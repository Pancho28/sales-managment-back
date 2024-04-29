import { 
    Entity, 
    Column, 
    PrimaryGeneratedColumn,
    CreateDateColumn,
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
  
    @Column({ type: 'boolean' })
    password: boolean;
  
    @CreateDateColumn({ type: 'datetime', readonly: true})
    creationDate: Date;
    
}
  