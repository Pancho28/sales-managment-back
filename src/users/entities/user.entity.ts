import { 
  Entity, 
  Column, 
  PrimaryGeneratedColumn,
  CreateDateColumn,
  BeforeInsert,
  Unique,
  OneToMany
} from 'typeorm';
import { hash } from 'bcryptjs';
import { UserAccess } from './userAccess.entity';
import { Local } from "./local.entity";


@Entity()
export class User {

  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({type: 'varchar'})
  @Unique(['username'])
  username: string;

  @Column()
  password: string;

  @Column({type: 'varchar', default: 'SELLER'})
  role: string;

  @Column({ type: 'varchar', default: 'ACTIVE'})
  status: string;

  @CreateDateColumn({ type: 'datetime', readonly: true})
  creationDate: Date;

  @Column({ type: 'timestamp', nullable: true, default: null})
  lastLogin: Date;

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
