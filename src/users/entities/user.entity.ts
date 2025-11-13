import { 
  Entity, 
  Column, 
  PrimaryGeneratedColumn,
  BeforeInsert,
  Unique,
  OneToMany
} from 'typeorm';
import { hash } from 'bcryptjs';
import { UserAccess } from './userAccess.entity';
import { Local } from "./local.entity";
import { Roles, Status } from '../../helpers/enum';


@Entity()
export class User {

  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({type: 'varchar'})
  @Unique(['username'])
  username: string;

  @Column()
  password: string;

  @Column({type: 'varchar', default: Roles.SELLER})
  role: string;

  @Column({ type: 'varchar', default: Status.ACTIVE})
  status: string;

  @Column({ type: 'varchar', default: 'America/Caracas'})
  tz: string;

  @Column({ type: 'int', default: 0})
  loginAttempts : number;

  @Column({ type: 'datetime', readonly: true})
  creationDate: Date;

  @Column({ type: 'timestamp', nullable: true, default: null})
  lastLogin: Date;

  @Column({ type: 'varchar', nullable: true, default: null})
  email: string;

  @OneToMany(() => UserAccess, userAccess => userAccess.user)
  userAccess: UserAccess;

  @OneToMany(() => Local, local => local.user)
  local: Local;

  @BeforeInsert()
  async hasPassword(){
    if (!this.password){
      return;
    }
    this.password = await hash(this.password, 10)
  }

}
