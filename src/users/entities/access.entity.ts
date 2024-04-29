import { 
    Entity, 
    Column, 
    PrimaryGeneratedColumn,
    CreateDateColumn,
    OneToMany
} from 'typeorm';
import { UserAccess } from './userAccess.entity';
  
  
@Entity()
export class Access {
  
    @PrimaryGeneratedColumn("uuid")
    id: string;
  
    @Column({type: 'varchar'})
    name: string;
  
    @Column({type: 'varchar'})
    description: string;
  
    @CreateDateColumn({ type: 'datetime', readonly: true})
    creationDate: Date;

    @OneToMany(() => UserAccess, userAccess => userAccess.access)
    userAccess: UserAccess;
    
}
  