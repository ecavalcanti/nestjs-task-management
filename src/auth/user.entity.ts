import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert, OneToMany } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { Task } from '../tasks/task.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @OneToMany(type => Task, task => task.user, { eager: true })
  tasks: Task[];

  @BeforeInsert()
  async BeforeInsert() {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
  }

  async validadePassword(password: string): Promise<boolean> {
    return await bcrypt.compare(password, this.password);
  }
}
