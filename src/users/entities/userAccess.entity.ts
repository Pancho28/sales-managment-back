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
    userAccessId: string;
  
    @ManyToOne(type => User, user => user.userId , {onDelete: 'CASCADE'})
    @JoinColumn()
    user: User;
  
    @ManyToOne(type => Access, access => access.accessId , {onDelete: 'CASCADE'})
    @JoinColumn()
    access: Access;
  
    @Column({ type: 'boolean' })
    password: boolean;
  
    @CreateDateColumn({ type: 'datetime', readonly: true})
    creationDate: Date;
    
}
  