import { Url } from 'src/url/entity/url.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum userRole {
  USER = 'user',
  ADMIN = 'admin',
}

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  fullname: string;

  @Column()
  password: string;

  @Column({ type: 'enum', enum: userRole, default: userRole.USER })
  role: userRole;

  @OneToMany(() => Url, (url) => url.user, {cascade: true})
  urls: Url[]

  @Column({default: "", nullable: true})
  refreshToken: string 
  
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
